// =====================================================================
// Gerador automático de horário + sugestões para resolver choques.
// Roda no navegador: recebe os dados (/api/dados) e devolve propostas.
// Nada é salvo aqui; quem salva é o app, depois que a coordenação aprova.
//
// Regras obrigatórias (nunca quebra):
//   - uma aula por horário em cada turma;
//   - professor não fica em duas turmas ao mesmo tempo (inclusive turnos que se sobrepõem);
//   - professor não recebe aula em horário que marcou "não pode";
//   - no máximo N aulas da mesma disciplina por dia na turma (Configurações);
//   - no máximo X aulas por dia para o professor, se cadastrado;
//   - aulas fixas (travadas) não se mexem.
// Preferências (tenta melhorar):
//   - menos "janelas" (buracos) no dia do professor;
//   - menos dias de deslocamento para o professor;
//   - espalhar a disciplina pela semana, ou aula dupla seguida se a escola preferir.
//
// Por dentro tudo vira número (índices) para ficar rápido: dá para testar
// dezenas de combinações em poucos segundos.
// =====================================================================
'use strict';
const Gerador = (() => {
  const sobrepoe = (a, b) => a.inicio < b.fim && b.inicio < a.fim;

  // Sorteio com semente (para "gerar outra opção" dar resultados diferentes)
  function sorteio(semente) {
    let s = semente >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function embaralhar(lista, rnd) {
    for (let i = lista.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
  }

  // ---------- Tudo o que não muda durante a geração ----------
  function contexto(D) {
    const per = D.periodos;
    const P = per.length;
    const pIdx = new Map(per.map((p, i) => [p.id, i]));
    const sobre = per.map((p) => per.map((q, j) => (sobrepoe(p, q) ? j : -1)).filter((j) => j >= 0));
    const turnos = ['Manhã', 'Tarde', 'Noite'].map((tn) => per.map((p, i) => [p, i]).filter(([p]) => p.turno === tn)
      .sort((a, b) => (a[0].inicio < b[0].inicio ? -1 : 1)).map(([, i]) => i)).filter((l) => l.length);
    const posNoTurno = new Int16Array(P);
    const turnoDe = new Int16Array(P);
    turnos.forEach((l, ti) => l.forEach((i, k) => { posNoTurno[i] = k; turnoDe[i] = ti; }));

    const dias = [...D.config.dias];
    const Dn = dias.length;
    const diaIdx = new Map(dias.map((d, i) => [d, i]));

    const turmas = D.turmas;
    const T = turmas.length;
    const tIdx = new Map(turmas.map((t, i) => [t.id, i]));
    const slots = turmas.map((t) => (t.turno === 'Integral'
      ? per.map((p, i) => [p, i]).filter(([p]) => p.turno === 'Manhã' || p.turno === 'Tarde')
      : per.map((p, i) => [p, i]).filter(([p]) => p.turno === t.turno))
      .sort((a, b) => (a[0].turno === b[0].turno ? (a[0].inicio < b[0].inicio ? -1 : 1) : (turnoDe[a[1]] - turnoDe[b[1]])))
      .map(([, i]) => i));
    // pares de horários seguidos (mesmo turno) de cada turma, para achar aulas duplas
    const pares = slots.map((sl) => {
      const r = [];
      for (let k = 0; k + 1 < sl.length; k++) {
        if (turnoDe[sl[k]] === turnoDe[sl[k + 1]] && posNoTurno[sl[k + 1]] === posNoTurno[sl[k]] + 1) r.push([sl[k], sl[k + 1]]);
      }
      return r;
    });

    const profs = D.professores;
    const Pr = profs.length;
    const prIdx = new Map(profs.map((p, i) => [p.id, i]));
    const maxDia = Int16Array.from(profs, (p) => p.max_aulas_dia || 0);

    const dists = D.distribuicao;
    const Di = dists.length;
    const dIdx = new Map(dists.map((d, i) => [d.id, i]));
    const dTurma = Int32Array.from(dists, (d) => tIdx.get(d.turma_id));
    const dProf = Int32Array.from(dists, (d) => prIdx.get(d.professor_id));

    const indisp = new Uint8Array(Pr * Dn * P);
    for (const i of D.indisponibilidades) {
      const pr = prIdx.get(i.professor_id), d = diaIdx.get(i.dia), p = pIdx.get(i.periodo_id);
      if (pr !== undefined && d !== undefined && p !== undefined) indisp[(pr * Dn + d) * P + p] = 1;
    }
    return {
      D, P, Dn, T, Pr, Di, per, pIdx, sobre, turnos, dias, diaIdx, turmas, tIdx, slots, pares,
      profs, prIdx, maxDia, dists, dIdx, dTurma, dProf, indisp,
      maxDisc: D.config.max_disc_dia || 2,
      duplas: !!D.config.preferir_duplas,
    };
  }

  // ---------- Estado de uma grade ----------
  class Grade {
    constructor(ctx, vazio = true) {
      this.ctx = ctx;
      if (!vazio) return;
      const { T, Dn, P, Pr, Di } = ctx;
      this.cel = new Int32Array(T * Dn * P);   // índice da distribuição + 1 (0 = vago)
      this.fixa = new Uint8Array(T * Dn * P);
      this.po = new Int16Array(Pr * Dn * P);   // aulas do professor em cada horário
      this.pdc = new Int16Array(Pr * Dn);      // aulas do professor no dia
      this.dd = new Int16Array(Di * Dn);       // aulas da disciplina (linha da distribuição) no dia
    }
    clonar() {
      const g = new Grade(this.ctx, false);
      g.cel = this.cel.slice(); g.fixa = this.fixa.slice(); g.po = this.po.slice(); g.pdc = this.pdc.slice(); g.dd = this.dd.slice();
      return g;
    }
    ci(t, d, p) { return (t * this.ctx.Dn + d) * this.ctx.P + p; }
    decod(c) {
      const { P, Dn } = this.ctx;
      const p = c % P, td = (c - p) / P;
      return [Math.floor(td / Dn), td % Dn, p];
    }
    por(t, d, p, di, fixa = 0) {
      const c = this.ci(t, d, p), { Dn, P } = this.ctx, pr = this.ctx.dProf[di];
      this.cel[c] = di + 1;
      this.fixa[c] = fixa ? 1 : 0;
      this.po[(pr * Dn + d) * P + p]++;
      this.pdc[pr * Dn + d]++;
      this.dd[di * Dn + d]++;
    }
    tirar(t, d, p) {
      const c = this.ci(t, d, p);
      const di = this.cel[c] - 1;
      if (di < 0) return -1;
      const { Dn, P } = this.ctx, pr = this.ctx.dProf[di];
      this.cel[c] = 0;
      this.fixa[c] = 0;
      this.po[(pr * Dn + d) * P + p]--;
      this.pdc[pr * Dn + d]--;
      this.dd[di * Dn + d]--;
      return di;
    }
    profLivre(pr, d, p) {
      const { Dn, P, sobre } = this.ctx, base = (pr * Dn + d) * P;
      for (const q of sobre[p]) if (this.po[base + q] > 0) return false;
      return true;
    }
    pode(t, d, p, di) {
      const ctx = this.ctx;
      if (this.cel[this.ci(t, d, p)]) return false;
      const pr = ctx.dProf[di];
      if (ctx.indisp[(pr * ctx.Dn + d) * ctx.P + p]) return false;
      if (this.dd[di * ctx.Dn + d] >= ctx.maxDisc) return false;
      if (ctx.maxDia[pr] && this.pdc[pr * ctx.Dn + d] >= ctx.maxDia[pr]) return false;
      return this.profLivre(pr, d, p);
    }
    // células (de qualquer turma) em que o professor está num horário que bate com p
    choques(pr, d, p) {
      const ctx = this.ctx, r = [];
      for (let t = 0; t < ctx.T; t++) {
        for (const q of ctx.sobre[p]) {
          const c = this.ci(t, d, q);
          if (this.cel[c] && ctx.dProf[this.cel[c] - 1] === pr) r.push(c);
        }
      }
      return r;
    }
    janelas(pr, d) {
      if (this.pdc[pr * this.ctx.Dn + d] < 2) return 0;
      const { Dn, P, turnos } = this.ctx, base = (pr * Dn + d) * P;
      let j = 0;
      for (const l of turnos) {
        let ini = -1, fim = -1, n = 0;
        for (let k = 0; k < l.length; k++) if (this.po[base + l[k]] > 0) { if (ini < 0) ini = k; fim = k; n++; }
        if (n > 1) j += fim - ini + 1 - n;
      }
      return j;
    }
  }

  // ---------- Custo (quanto menor, melhor) ----------
  function custoProfDia(g, pr, d) {
    return g.pdc[pr * g.ctx.Dn + d] ? 3 + g.janelas(pr, d) * 2 : 0;
  }
  function custoDistDia(g, di, d) {
    const n = g.dd[di * g.ctx.Dn + d];
    if (n < 2) return 0;
    const t = g.ctx.dTurma[di];
    let seguidos = 0;
    for (const [a, b] of g.ctx.pares[t]) if (g.cel[g.ci(t, d, a)] === di + 1 && g.cel[g.ci(t, d, b)] === di + 1) seguidos++;
    const soltos = n - 1 - seguidos;
    return g.ctx.duplas ? soltos * 4 - seguidos * 2 : seguidos * 2 + soltos * 5;
  }
  function custoTotal(g) {
    const { Pr, Di, Dn } = g.ctx;
    let c = 0;
    for (let pr = 0; pr < Pr; pr++) for (let d = 0; d < Dn; d++) c += custoProfDia(g, pr, d);
    for (let di = 0; di < Di; di++) for (let d = 0; d < Dn; d++) c += custoDistDia(g, di, d);
    return c;
  }
  // Diferença de custo ao colocar a aula nesta célula
  function custoColocar(g, t, d, p, di) {
    const pr = g.ctx.dProf[di];
    const antes = custoProfDia(g, pr, d) + custoDistDia(g, di, d);
    g.por(t, d, p, di);
    const depois = custoProfDia(g, pr, d) + custoDistDia(g, di, d);
    g.tirar(t, d, p);
    return depois - antes;
  }

  function contarLivres(g, di) {
    const t = g.ctx.dTurma[di];
    let n = 0;
    for (let d = 0; d < g.ctx.Dn; d++) for (const p of g.ctx.slots[t]) if (g.pode(t, d, p, di)) n++;
    return n;
  }
  function melhorLugar(g, di, rnd, evitar = -1) {
    const t = g.ctx.dTurma[di];
    let melhor = null, mc = Infinity;
    for (let d = 0; d < g.ctx.Dn; d++) {
      for (const p of g.ctx.slots[t]) {
        if (!g.pode(t, d, p, di) || g.ci(t, d, p) === evitar) continue;
        const c = custoColocar(g, t, d, p, di) + (rnd ? rnd() * 1.5 : 0);
        if (c < mc) { mc = c; melhor = [d, p]; }
      }
    }
    return melhor;
  }

  // Quando a disciplina não cabe: tenta abrir espaço mudando UMA outra aula de lugar
  function reparar(g, di, moveis, rnd) {
    const ctx = g.ctx, t = ctx.dTurma[di], pr = ctx.dProf[di];
    const celulas = [];
    for (let d = 0; d < ctx.Dn; d++) for (const p of ctx.slots[t]) celulas.push([d, p]);
    for (const [d, p] of embaralhar(celulas, rnd)) {
      if (ctx.indisp[(pr * ctx.Dn + d) * ctx.P + p]) continue;
      if (g.dd[di * ctx.Dn + d] >= ctx.maxDisc) continue;
      const c = g.ci(t, d, p);
      if (g.cel[c]) {
        // A) a turma está ocupada nesse horário por outra aula que pode mudar de lugar
        if (!moveis.has(c)) continue;
        const outra = g.tirar(t, d, p);
        if (g.pode(t, d, p, di)) {
          g.por(t, d, p, di);
          const novo = melhorLugar(g, outra, rnd, c);
          if (novo) {
            g.por(t, novo[0], novo[1], outra);
            moveis.add(g.ci(t, novo[0], novo[1]));
            return true;
          }
          g.tirar(t, d, p);
        }
        g.por(t, d, p, outra);
        continue;
      }
      // B) a turma está livre, mas o professor está em outra turma nesse horário
      const ch = g.choques(pr, d, p);
      if (ch.length !== 1 || !moveis.has(ch[0])) continue;
      const [t2, d2, p2] = g.decod(ch[0]);
      const outra = g.tirar(t2, d2, p2);
      if (g.pode(t, d, p, di)) {
        g.por(t, d, p, di);
        const novo = melhorLugar(g, outra, rnd, ch[0]);
        if (novo) {
          moveis.delete(ch[0]);
          g.por(t2, novo[0], novo[1], outra);
          moveis.add(g.ci(t2, novo[0], novo[1]));
          moveis.add(c);
          return true;
        }
        g.tirar(t, d, p);
      }
      g.por(t2, d2, p2, outra);
    }
    return false;
  }

  // Ajuste fino: troca aulas de lugar dentro da mesma turma quando isso diminui o custo
  function melhorar(g, moveis, rnd, tentativas) {
    const ctx = g.ctx;
    let mv = [...moveis];
    for (let n = 0; n < tentativas && mv.length; n++) {
      if (n % 300 === 0) mv = [...moveis];
      const ca = mv[Math.floor(rnd() * mv.length)];
      if (!moveis.has(ca)) continue;
      const [t, dA, pA] = g.decod(ca);
      const sl = ctx.slots[t];
      const dB = Math.floor(rnd() * ctx.Dn), pB = sl[Math.floor(rnd() * sl.length)];
      const cb = g.ci(t, dB, pB);
      if (ca === cb) continue;
      if (g.cel[cb] && !moveis.has(cb)) continue;
      const a = g.cel[ca] - 1, b = g.cel[cb] - 1;
      if (a < 0) { moveis.delete(ca); continue; }
      if (a === b) continue;
      const prA = ctx.dProf[a], prB = b >= 0 ? ctx.dProf[b] : -1;
      const custo = () => {
        let c = custoProfDia(g, prA, dA) + custoDistDia(g, a, dA) + custoDistDia(g, a, dB);
        if (dB !== dA) c += custoProfDia(g, prA, dB);
        if (b >= 0) {
          c += custoDistDia(g, b, dA) + custoDistDia(g, b, dB);
          if (prB !== prA) { c += custoProfDia(g, prB, dA); if (dB !== dA) c += custoProfDia(g, prB, dB); }
        }
        return c;
      };
      const antes = custo();
      g.tirar(t, dA, pA);
      if (b >= 0) g.tirar(t, dB, pB);
      let ok = g.pode(t, dB, pB, a);
      if (ok) {
        g.por(t, dB, pB, a);
        if (b >= 0) { ok = g.pode(t, dA, pA, b); if (ok) g.por(t, dA, pA, b); else g.tirar(t, dB, pB); }
      }
      if (ok) {
        const depois = custo();
        if (depois < antes || (depois === antes && rnd() < 0.3)) {
          if (b < 0) { moveis.delete(ca); moveis.add(cb); }
          continue;
        }
        g.tirar(t, dB, pB);
        if (b >= 0) g.tirar(t, dA, pA);
      }
      g.por(t, dA, pA, a);
      if (b >= 0) g.por(t, dB, pB, b);
    }
  }

  // Uma tentativa completa
  function rodada(base, demandas, rnd) {
    const g = base.clonar();
    const resta = new Map(demandas); // índice da distribuição -> aulas que faltam
    const moveis = new Set();
    const faltou = new Map();
    const { dTurma, Dn } = g.ctx;
    while (resta.size) {
      // a disciplina com menos opções por aula restante vai primeiro
      let escolhida = -1, menor = Infinity;
      for (const [di, n] of resta) {
        const s = contarLivres(g, di) / n + rnd() * 0.5;
        if (s < menor) { menor = s; escolhida = di; }
      }
      let colocou = false;
      const l = melhorLugar(g, escolhida, rnd);
      if (l) {
        g.por(dTurma[escolhida], l[0], l[1], escolhida);
        moveis.add(g.ci(dTurma[escolhida], l[0], l[1]));
        colocou = true;
      } else {
        colocou = reparar(g, escolhida, moveis, rnd);
      }
      if (colocou) {
        const n = resta.get(escolhida) - 1;
        n ? resta.set(escolhida, n) : resta.delete(escolhida);
      } else {
        faltou.set(escolhida, resta.get(escolhida));
        resta.delete(escolhida);
      }
    }
    melhorar(g, moveis, rnd, Math.min(40000, 60 * moveis.size + 500));
    // depois do ajuste fino, tenta de novo o que tinha sobrado
    for (const [di, n] of [...faltou]) {
      let k = n;
      while (k > 0) {
        const l = melhorLugar(g, di, null);
        if (l) { g.por(dTurma[di], l[0], l[1], di); moveis.add(g.ci(dTurma[di], l[0], l[1])); k--; }
        else if (reparar(g, di, moveis, rnd)) k--;
        else break;
      }
      k ? faltou.set(di, k) : faltou.delete(di);
    }
    let nFaltou = 0;
    for (const x of faltou.values()) nFaltou += x;
    void Dn;
    return { g, faltou, custo: nFaltou * 1000 + custoTotal(g) };
  }

  // Por que uma disciplina não coube (em português simples)
  function explicar(g, di) {
    const ctx = g.ctx, t = ctx.dTurma[di], pr = ctx.dProf[di];
    const turma = ctx.turmas[t].nome, prof = ctx.profs[pr].nome;
    let vagos = 0, naoPode = 0, ocupado = 0, limiteDia = 0, limiteDisc = 0;
    for (let d = 0; d < ctx.Dn; d++) {
      for (const p of ctx.slots[t]) {
        if (g.cel[g.ci(t, d, p)]) continue;
        vagos++;
        if (ctx.indisp[(pr * ctx.Dn + d) * ctx.P + p]) naoPode++;
        else if (!g.profLivre(pr, d, p)) ocupado++;
        else if (g.dd[di * ctx.Dn + d] >= ctx.maxDisc) limiteDisc++;
        else limiteDia++;
      }
    }
    if (!vagos) {
      // procura aulas a mais ocupando espaço na turma
      const sobras = [];
      ctx.dists.forEach((x, xi) => {
        if (ctx.dTurma[xi] !== t) return;
        let n = 0;
        for (let d = 0; d < ctx.Dn; d++) n += g.dd[xi * ctx.Dn + d];
        if (n > x.aulas_semana) sobras.push(`${ctx.D.disciplinas.find((y) => y.id === x.disciplina_id)?.nome} (${n} de ${x.aulas_semana})`);
      });
      if (sobras.length) return `o ${turma} não tem mais horários vagos porque há aulas a mais na grade: ${sobras.join(', ')}. Tire as aulas a mais (botão Resolver nos Avisos) ou use "Refazer do zero".`;
      return `o ${turma} não tem mais horários vagos (a distribuição pede mais aulas do que a grade comporta).`;
    }
    const partes = [];
    if (ocupado) partes.push(`${ocupado} em que ${prof} já está em outra turma`);
    if (naoPode) partes.push(`${naoPode} em que ${prof} marcou que não pode`);
    if (limiteDisc) partes.push(`${limiteDisc} em dias que já têm o máximo de aulas desta disciplina`);
    if (limiteDia) partes.push(`${limiteDia} em dias em que ${prof} já atingiu o máximo de aulas por dia`);
    return `sobraram ${vagos} horário(s) vago(s) no ${turma}: ${partes.join('; ')}.`;
  }

  // Monta a grade a partir das aulas salvas (só dias letivos)
  function carregarGrade(ctx, aulas, filtro = () => true) {
    const g = new Grade(ctx);
    const fora = [];
    for (const a of aulas) {
      const t = ctx.tIdx.get(a.turma_id), d = ctx.diaIdx.get(a.dia), p = ctx.pIdx.get(a.periodo_id), di = ctx.dIdx.get(a.distribuicao_id);
      if (d === undefined || t === undefined || p === undefined || di === undefined) { fora.push(a); continue; }
      if (!filtro(a)) continue;
      if (g.cel[g.ci(t, d, p)]) continue;
      g.por(t, d, p, di, a.fixa);
    }
    return { g, fora };
  }
  function paraAulas(g) {
    const ctx = g.ctx, r = [];
    for (let c = 0; c < g.cel.length; c++) {
      if (!g.cel[c]) continue;
      const [t, d, p] = g.decod(c);
      r.push({ turma_id: ctx.turmas[t].id, dia: ctx.dias[d], periodo_id: ctx.per[p].id, distribuicao_id: ctx.dists[g.cel[c] - 1].id, fixa: !!g.fixa[c] });
    }
    return r;
  }

  // ---------- Gerar ----------
  // escopo: Set de ids de turma a montar; manter: mantém o que já está colocado nelas (só completa)
  function gerar(D, { escopo, manter = true, semente = Date.now(), tempoMs = 2000 } = {}) {
    const ctx = contexto(D);
    // fica no lugar: aula fixa, aula de turma fora do escopo, ou tudo se for "completar"
    const { g: base, fora } = carregarGrade(ctx, D.aulas, (a) => a.fixa || !escopo.has(a.turma_id) || manter);
    const demandas = new Map();
    let pedidas = 0;
    ctx.dists.forEach((d, di) => {
      if (!escopo.has(d.turma_id)) return;
      pedidas += d.aulas_semana;
      let ja = 0;
      for (let k = 0; k < ctx.Dn; k++) ja += base.dd[di * ctx.Dn + k];
      if (d.aulas_semana > ja) demandas.set(di, d.aulas_semana - ja);
    });
    const rnd = sorteio(semente);
    const inicio = performance.now();
    let melhor = null, rodadas = 0;
    do {
      const r = rodada(base, demandas, sorteio(Math.floor(rnd() * 2 ** 32)));
      rodadas++;
      if (!melhor || r.custo < melhor.custo) melhor = r;
    } while (performance.now() - inicio < tempoMs && rodadas < 80);

    const g = melhor.g;
    const aulas = [...fora, ...paraAulas(g)];
    const k = (a) => `${a.turma_id}|${a.dia}|${a.periodo_id}`;
    const antes = new Set(D.aulas.map((a) => `${k(a)}#${a.distribuicao_id}`));
    const novas = new Set(aulas.filter((a) => escopo.has(a.turma_id) && !antes.has(`${k(a)}#${a.distribuicao_id}`)).map(k));
    let janelas = 0;
    for (let pr = 0; pr < ctx.Pr; pr++) for (let d = 0; d < ctx.Dn; d++) janelas += g.janelas(pr, d);
    const faltou = [...melhor.faltou].map(([di, n]) => ({ dist_id: ctx.dists[di].id, n, motivo: explicar(g, di) }));
    const naoColocadas = faltou.reduce((s, f) => s + f.n, 0);
    return {
      aulas, novas, faltou,
      resumo: { pedidas, colocadas: pedidas - naoColocadas, janelas, rodadas, ms: Math.round(performance.now() - inicio) },
      // o que o servidor precisa para salvar
      lote: {
        limpar_turmas: [...escopo],
        alteracoes: aulas.filter((a) => escopo.has(a.turma_id) && !a.fixa && ctx.diaIdx.has(a.dia))
          .map((a) => ({ turma_id: a.turma_id, dia: a.dia, periodo_id: a.periodo_id, distribuicao_id: a.distribuicao_id })),
      },
    };
  }

  // ---------- Opções para resolver uma aula com problema ----------
  function opcoes(D, ref) {
    const ctx = contexto(D);
    const { g } = carregarGrade(ctx, D.aulas);
    const vazio = { mover: [], trocar: [], professores: [], livres: [] };
    const t = ctx.tIdx.get(ref.turma_id), d = ctx.diaIdx.get(ref.dia), p = ctx.pIdx.get(ref.periodo_id);
    if (t === undefined || d === undefined || p === undefined) return vazio;
    const c = g.ci(t, d, p);
    if (!g.cel[c]) return vazio;
    if (g.fixa[c]) return { ...vazio, fixa: true };
    const di = g.tirar(t, d, p);
    const dist = ctx.dists[di];
    const id = (tt, dd, pp, x) => ({ turma_id: ctx.turmas[tt].id, dia: ctx.dias[dd], periodo_id: ctx.per[pp].id, distribuicao_id: x === null ? null : ctx.dists[x].id });

    // 1) mover para um horário vago da turma
    const mover = [];
    for (let d2 = 0; d2 < ctx.Dn; d2++) {
      for (const p2 of ctx.slots[t]) {
        if ((d2 === d && p2 === p) || !g.pode(t, d2, p2, di)) continue;
        mover.push({ dia: ctx.dias[d2], periodo_id: ctx.per[p2].id, custo: custoColocar(g, t, d2, p2, di), alteracoes: [id(t, d, p, null), id(t, d2, p2, di)] });
      }
    }
    // 2) trocar de lugar com outra aula da mesma turma
    const trocar = [];
    for (let d2 = 0; d2 < ctx.Dn; d2++) {
      for (const p2 of ctx.slots[t]) {
        const c2 = g.ci(t, d2, p2);
        const outra = g.cel[c2] - 1;
        if (outra < 0 || g.fixa[c2] || outra === di) continue;
        g.tirar(t, d2, p2);
        let ok = false, custo = 0;
        if (g.pode(t, d2, p2, di)) {
          g.por(t, d2, p2, di);
          if (g.pode(t, d, p, outra)) { ok = true; custo = custoColocar(g, t, d, p, outra); }
          g.tirar(t, d2, p2);
        }
        g.por(t, d2, p2, outra);
        if (ok) trocar.push({ dia: ctx.dias[d2], periodo_id: ctx.per[p2].id, dist: ctx.dists[outra].id, custo, alteracoes: [id(t, d2, p2, di), id(t, d, p, outra)] });
      }
    }
    // 3) outro professor que já dá a disciplina e está livre em todas as aulas dela nesta turma
    const aulasDaDist = [[d, p]];
    for (let d2 = 0; d2 < ctx.Dn; d2++) for (const p2 of ctx.slots[t]) if (g.cel[g.ci(t, d2, p2)] === di + 1) aulasDaDist.push([d2, p2]);
    // tira temporariamente todas as aulas desta disciplina na turma para testar outro professor
    for (const [d2, p2] of aulasDaDist.slice(1)) g.tirar(t, d2, p2);
    const discDoProf = new Map();
    for (const x of D.distribuicao) {
      if (!discDoProf.has(x.professor_id)) discDoProf.set(x.professor_id, new Set());
      discDoProf.get(x.professor_id).add(x.disciplina_id);
    }
    const professores = [], livres = [];
    const prAtual = ctx.dProf[di];
    ctx.profs.forEach((q, pr) => {
      if (pr === prAtual) return;
      const livreEm = (dd, pp) => !ctx.indisp[(pr * ctx.Dn + dd) * ctx.P + pp] && g.profLivre(pr, dd, pp);
      if (!livreEm(d, p)) return;
      const mesmaDisc = !!discDoProf.get(q.id)?.has(dist.disciplina_id);
      livres.push({ id: q.id, nome: q.nome, mesmaDisc });
      if (mesmaDisc && aulasDaDist.every(([dd, pp]) => livreEm(dd, pp))) {
        professores.push({ id: q.id, nome: q.nome, dist_id: dist.id, aulas_semana: dist.aulas_semana });
      }
    });
    for (const [d2, p2] of aulasDaDist.slice(1)) g.por(t, d2, p2, di);
    g.por(t, d, p, di);
    mover.sort((a, b) => a.custo - b.custo);
    trocar.sort((a, b) => a.custo - b.custo);
    livres.sort((a, b) => b.mesmaDisc - a.mesmaDisc || a.nome.localeCompare(b.nome));
    return { mover: mover.slice(0, 4), trocar: trocar.slice(0, 4), professores, livres };
  }

  // Janelas do professor na semana (para mostrar na tela)
  function janelasProfessor(D, profId) {
    const ctx = contexto(D);
    const pr = ctx.prIdx.get(profId);
    if (pr === undefined) return 0;
    const { g } = carregarGrade(ctx, D.aulas);
    let j = 0;
    for (let d = 0; d < ctx.Dn; d++) j += g.janelas(pr, d);
    return j;
  }

  return { gerar, opcoes, janelasProfessor };
})();
