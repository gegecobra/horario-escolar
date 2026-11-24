// ================= Ícones (estilo Lucide) =================
const ICONS = {
  grid: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
  triangle: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  print: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.8-9.8M17 6l3 3M14.5 8.5l2 2"/>',
  ban: '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
  restore: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  sparkles: '<path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/><path d="M19 3v4M17 5h4"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  unlock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.9-1"/>',
  wand: '<path d="m15 4 5 5L9 20l-5-5z"/><path d="M14 5l5 5"/><path d="M5 3v2M4 4h2M19 15v2M18 16h2"/>',
  move: '<path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>',
  swap: '<path d="M16 3l4 4-4 4"/><path d="M20 7H4"/><path d="M8 21l-4-4 4-4"/><path d="M4 17h16"/>',
  eraser: '<path d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4l10-10a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4L13 19"/><path d="M22 21H7M5 11l9 9"/>',
};
const icon = (n, cls = '') =>
  `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

// ================= Estado =================
const storage = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} },
};
const $app = document.getElementById('app');
const $modal = document.getElementById('modal');
const state = {
  token: storage.get('horario_token'),
  user: null,
  aba: storage.get('horario_aba') || 'grade',
  dados: null,
  calc: null,
  turmaId: Number(storage.get('horario_turma')) || 0,
  profId: 0,
  cad: 'turmas',
  distTurma: 0,
  editandoIndisp: null, // Set com "dia|periodo" enquanto marca os horários em que o professor não pode
  previa: null,         // proposta do gerador automático ainda não salva
};

const DIAS = { 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
const DIAS_CURTO = { 1: 'Seg', 2: 'Ter', 3: 'Qua', 4: 'Qui', 5: 'Sex', 6: 'Sáb' };
const TURNOS = ['Manhã', 'Tarde', 'Noite'];
const HUES = [221, 8, 152, 38, 275, 190, 330, 95, 25, 245, 170, 350];

// ================= Utilidades =================
async function api(caminho, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (state.token) headers.Authorization = 'Bearer ' + state.token;
  const res = await fetch('/api' + caminho, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && caminho !== '/login') { sairLocal(); throw new Error(data.erro || 'Sessão expirada'); }
  if (!res.ok) throw new Error(data.erro || 'Erro inesperado');
  return data;
}
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dadosForm = (form) => Object.fromEntries(new FormData(form));
const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;
const byId = (lista) => Object.fromEntries(lista.map((x) => [x.id, x]));
const hue = (disc) => HUES[(disc?.cor ?? 0) % HUES.length];
const sobrepoe = (a, b) => a.inicio < b.fim && b.inicio < a.fim;
function horas(h) {
  const min = Math.round(h * 60);
  const hh = Math.floor(min / 60), mm = min % 60;
  return mm ? `${hh}h${String(mm).padStart(2, '0')}` : `${hh}h`;
}
let toastTimer;
function toast(msg, erro = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'ver' + (erro ? ' erro' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.className = ''), 2800);
}
function sairLocal() {
  state.token = null; state.user = null; state.dados = null;
  storage.set('horario_token', null);
  if ($modal.open) $modal.close();
  render();
}
function tema() { return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'; }

// ================= Modal =================
// Abre um formulário. onSubmit recebe os dados; se der erro, a mensagem aparece no modal.
function modal({ titulo, sub = '', corpo, botao = 'Salvar', perigo = false, onSubmit, semRodape = false }) {
  $modal.innerHTML = `
    <form class="modal-corpo" method="dialog" novalidate>
      <div class="modal-cab">
        <div><h2>${esc(titulo)}</h2>${sub ? `<p>${sub}</p>` : ''}</div>
        <button type="button" class="icone-btn" data-fechar aria-label="Fechar">${icon('x')}</button>
      </div>
      ${corpo}
      <p class="erro-txt" data-erro></p>
      ${semRodape ? '' : `<div class="modal-rodape">
        <button type="button" class="btn" data-fechar>Cancelar</button>
        <button type="submit" class="btn ${perigo ? 'perigo' : 'primario'}">${esc(botao)}</button>
      </div>`}
    </form>`;
  const form = $modal.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!onSubmit) return $modal.close();
    const b = form.querySelector('[type=submit]');
    if (b) b.disabled = true;
    try {
      const r = await onSubmit(dadosForm(form), form);
      if (r !== false && $modal.open) $modal.close();
    } catch (err) {
      form.querySelector('[data-erro]').textContent = err.message;
    } finally {
      if (b) b.disabled = false;
    }
  });
  $modal.querySelectorAll('[data-fechar]').forEach((b) => b.addEventListener('click', () => $modal.close()));
  $modal.showModal();
  form.querySelector('input:not([type=hidden]), select')?.focus();
  return form;
}
const confirmar = (titulo, texto, botao = 'Excluir') => new Promise((ok) => {
  let sim = false;
  modal({ titulo, corpo: `<p class="muted">${texto}</p>`, botao, perigo: true, onSubmit: () => { sim = true; } });
  $modal.addEventListener('close', () => ok(sim), { once: true });
});

// ================= Dados e cálculo dos avisos =================
async function carregar() {
  state.dados = await api('/dados');
  calcular();
}
async function salvar(fn, msg) {
  if (state.previa) {
    toast('Há uma prévia do gerador na tela. Aplique ou descarte antes de editar.', true);
    throw new Error('prévia aberta');
  }
  try {
    await fn();
    await carregar();
    render();
    if (msg) toast(msg);
  } catch (e) {
    toast(e.message, true);
    throw e;
  }
}

function periodosDaTurma(t) {
  const P = state.dados.periodos;
  return t.turno === 'Integral' ? P.filter((p) => p.turno === 'Manhã' || p.turno === 'Tarde') : P.filter((p) => p.turno === t.turno);
}

function calcular() {
  const D = state.dados;
  const m = { dist: byId(D.distribuicao), disc: byId(D.disciplinas), prof: byId(D.professores), turma: byId(D.turmas), per: byId(D.periodos) };
  const diasLetivos = new Set(D.config.dias);
  const indisp = new Set(D.indisponibilidades.map((i) => `${i.professor_id}|${i.dia}|${i.periodo_id}`));
  const aulas = D.aulas.map((a) => {
    const d = m.dist[a.distribuicao_id];
    return { ...a, dist: d, prof_id: d.professor_id, disc_id: d.disciplina_id, per: m.per[a.periodo_id] };
  });
  const problemas = {}; // "turma|dia|periodo" -> [textos]
  const marcar = (a, txt) => (problemas[`${a.turma_id}|${a.dia}|${a.periodo_id}`] ||= []).push(txt);
  const avisos = [];
  const nomeHora = (a) => `${DIAS[a.dia]}, ${a.per.inicio}`;
  const ref = (a) => ({ turma_id: a.turma_id, dia: a.dia, periodo_id: a.periodo_id });

  // 1) Professor em duas turmas ao mesmo tempo
  const porProfDia = {};
  for (const a of aulas) if (diasLetivos.has(a.dia)) (porProfDia[`${a.prof_id}|${a.dia}`] ||= []).push(a);
  for (const lista of Object.values(porProfDia)) {
    for (let i = 0; i < lista.length; i++) {
      for (let j = i + 1; j < lista.length; j++) {
        const a = lista[i], b = lista[j];
        if (a.turma_id === b.turma_id || !sobrepoe(a.per, b.per)) continue;
        const p = m.prof[a.prof_id].nome, ta = m.turma[a.turma_id].nome, tb = m.turma[b.turma_id].nome;
        marcar(a, `${p} também está no ${tb} neste horário`);
        marcar(b, `${p} também está no ${ta} neste horário`);
        avisos.push({ nivel: 'erro', tipo: 'Conflito', turma_id: a.turma_id, turmas: [a.turma_id, b.turma_id], prof_id: a.prof_id, aulas: [ref(a), ref(b)],
          texto: `<strong>${esc(p)}</strong> está em duas turmas ao mesmo tempo: ${esc(ta)} e ${esc(tb)} (${nomeHora(a)}).` });
      }
    }
  }
  // 2) Aula em horário em que o professor não pode
  for (const a of aulas) {
    if (!diasLetivos.has(a.dia) || !indisp.has(`${a.prof_id}|${a.dia}|${a.periodo_id}`)) continue;
    const p = m.prof[a.prof_id].nome;
    marcar(a, `${p} marcou que não pode neste horário`);
    avisos.push({ nivel: 'erro', tipo: 'Indisponível', turma_id: a.turma_id, prof_id: a.prof_id, aulas: [ref(a)],
      texto: `<strong>${esc(p)}</strong> não pode na ${nomeHora(a)}, mas está com aula no ${esc(m.turma[a.turma_id].nome)}.` });
  }
  // 2b) Mais aulas da mesma disciplina no dia do que o permitido; professor acima do máximo por dia
  const maxDisc = D.config.max_disc_dia || 2;
  const porDistDia = {}, porProfDia2 = {};
  for (const a of aulas) {
    if (!diasLetivos.has(a.dia)) continue;
    (porDistDia[`${a.distribuicao_id}|${a.dia}`] ||= []).push(a);
    porProfDia2[`${a.prof_id}|${a.dia}`] = (porProfDia2[`${a.prof_id}|${a.dia}`] || 0) + 1;
  }
  for (const [k, lista] of Object.entries(porDistDia)) {
    if (lista.length <= maxDisc) continue;
    const a = lista[0];
    for (const x of lista) marcar(x, `mais de ${maxDisc} aulas de ${m.disc[a.disc_id].nome} neste dia`);
    avisos.push({ nivel: 'atencao', tipo: 'Muitas no dia', turma_id: a.turma_id,
      texto: `<strong>${esc(m.turma[a.turma_id].nome)}</strong>: ${lista.length} aulas de ${esc(m.disc[a.disc_id].nome)} na ${DIAS[a.dia]} (o máximo combinado é ${maxDisc} por dia).` });
  }
  for (const [k, n] of Object.entries(porProfDia2)) {
    const [pid, dia] = k.split('|').map(Number);
    const p = m.prof[pid];
    if (p.max_aulas_dia && n > p.max_aulas_dia) {
      avisos.push({ nivel: 'atencao', tipo: 'Muitas no dia', prof_id: pid,
        texto: `<strong>${esc(p.nome)}</strong> tem ${n} aulas na ${DIAS[dia]}, acima do máximo de ${p.max_aulas_dia} por dia.` });
    }
  }
  // 3) Carga do professor
  const cargaProf = {};
  for (const p of D.professores) cargaProf[p.id] = { planejadas: 0, naGrade: 0 };
  for (const d of D.distribuicao) cargaProf[d.professor_id].planejadas += d.aulas_semana;
  for (const a of aulas) if (diasLetivos.has(a.dia)) cargaProf[a.prof_id].naGrade++;
  const publica = D.config.rede === 'publica';
  for (const p of D.professores) {
    const c = cargaProf[p.id];
    const n = Math.max(c.planejadas, c.naGrade);
    c.horasSala = (n * D.config.duracao_aula) / 60;
    if (p.limite_aulas && n > p.limite_aulas) {
      avisos.push({ nivel: 'atencao', tipo: 'Carga', prof_id: p.id,
        texto: `<strong>${esc(p.nome)}</strong> tem ${n} aulas por semana, acima do limite de ${p.limite_aulas} definido pela escola.` });
    }
    if (publica && p.jornada_horas) {
      c.maxSala = (p.jornada_horas * 2) / 3;
      if (c.horasSala > c.maxSala + 1e-9) {
        avisos.push({ nivel: 'atencao', tipo: 'Lei do Piso', prof_id: p.id,
          texto: `<strong>${esc(p.nome)}</strong>: ${n} aulas de ${D.config.duracao_aula} min = ${horas(c.horasSala)} com alunos. Na rede pública o máximo é 2/3 da jornada de ${horas(p.jornada_horas)} (${horas(c.maxSala)}).` });
      }
    }
  }
  // 4) Aulas faltando ou sobrando em cada turma; turma sem espaço
  const naGradeDist = {};
  for (const a of aulas) if (diasLetivos.has(a.dia)) naGradeDist[a.distribuicao_id] = (naGradeDist[a.distribuicao_id] || 0) + 1;
  for (const t of D.turmas) {
    const ds = D.distribuicao.filter((d) => d.turma_id === t.id);
    const pedidas = ds.reduce((s, d) => s + d.aulas_semana, 0);
    const vagas = periodosDaTurma(t).length * D.config.dias.length;
    if (pedidas > vagas) {
      avisos.push({ nivel: 'erro', tipo: 'Sem espaço', turma_id: t.id,
        texto: `<strong>${esc(t.nome)}</strong>: a distribuição pede ${pedidas} aulas por semana, mas a grade só tem ${vagas} horários.` });
    }
    for (const d of ds) {
      const n = naGradeDist[d.id] || 0, disc = m.disc[d.disciplina_id].nome;
      if (n > d.aulas_semana) {
        avisos.push({ nivel: 'erro', tipo: 'Aula a mais', turma_id: t.id, sobra: d.id,
          texto: `<strong>${esc(t.nome)}</strong>: ${esc(disc)} está com ${n} aulas na grade, mas o combinado é ${d.aulas_semana}.` });
      } else if (n < d.aulas_semana) {
        avisos.push({ nivel: 'pendente', tipo: 'Falta colocar', turma_id: t.id,
          texto: `<strong>${esc(t.nome)}</strong>: falta${d.aulas_semana - n > 1 ? 'm' : ''} ${plural(d.aulas_semana - n, 'aula', 'aulas')} de ${esc(disc)} (${n} de ${d.aulas_semana}).` });
      }
    }
  }
  // 5) Aulas guardadas em dias que deixaram de ser letivos
  const foraDia = aulas.filter((a) => !diasLetivos.has(a.dia));
  if (foraDia.length) {
    avisos.push({ nivel: 'atencao', tipo: 'Dia sem aula', texto: `${plural(foraDia.length, 'aula está guardada', 'aulas estão guardadas')} em dias que não são mais letivos (${[...new Set(foraDia.map((a) => DIAS[a.dia]))].join(', ')}). Elas não aparecem na grade; volte o dia em Configurações para vê-las.` });
  }
  avisos.forEach((a, i) => (a.idx = i));
  state.calc = { m, aulas, problemas, avisos, cargaProf, naGradeDist, indisp };
}

// ================= Login =================
function renderLogin() {
  $app.innerHTML = `
    <div class="login">
      <form class="login-card" id="form-login">
        <div class="brand"><div class="brand-mark">${icon('grid')}</div><span>Horário Escolar<small>Coordenação pedagógica</small></span></div>
        <div><h2>Entrar</h2><p class="muted">Monte e confira o horário das turmas.</p></div>
        <label class="campo">Usuário ou e-mail<input name="login" autocomplete="username" required></label>
        <label class="campo">Senha<input name="senha" type="password" autocomplete="current-password" required></label>
        <p class="erro-txt" id="erro-login"></p>
        <button class="btn primario" type="submit">Entrar</button>
      </form>
    </div>`;
  document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    try {
      const r = await api('/login', { method: 'POST', body: dadosForm(e.target) });
      state.token = r.token;
      storage.set('horario_token', r.token);
      await iniciar();
    } catch (err) {
      document.getElementById('erro-login').textContent = err.message;
    } finally {
      btn.disabled = false;
    }
  });
}

// ================= Estrutura =================
const ABAS = [
  ['grade', 'grid', 'Grade das turmas'],
  ['professor', 'user', 'Por professor'],
  ['avisos', 'triangle', 'Avisos'],
  ['cadastros', 'layers', 'Cadastros'],
  ['equipe', 'users', 'Equipe'],
  ['config', 'settings', 'Configurações'],
];
function render() {
  if (!state.token || !state.user || !state.dados) return renderLogin();
  const av = state.calc.avisos;
  const erros = av.filter((a) => a.nivel === 'erro').length;
  const atencao = av.filter((a) => a.nivel === 'atencao').length;
  const badge = erros ? `<span class="badge">${erros}</span>` : atencao ? `<span class="badge amarelo">${atencao}</span>` : '';
  $app.innerHTML = `
    <div class="app">
      <aside class="sidebar">
        <div class="brand"><div class="brand-mark">${icon('grid')}</div><span>Horário Escolar<small>${esc(state.dados.config.escola)}</small></span></div>
        <nav class="nav">
          ${ABAS.map(([id, ic, rot]) => `<button class="nav-item ${state.aba === id ? 'ativo' : ''}" data-aba="${id}" title="${rot}">
            ${icon(ic)}<span class="rot">${rot}</span>${id === 'avisos' ? badge : ''}</button>`).join('')}
        </nav>
        <div class="user-card">
          <div><strong>${esc(state.user.nome)}</strong><span>${esc(state.user.cargo || state.user.login)}</span></div>
          <button class="icone-btn" data-acao="tema" title="Tema claro/escuro">${icon(tema() === 'dark' ? 'sun' : 'moon')}</button>
          <button class="icone-btn" data-acao="sair" title="Sair">${icon('logout')}</button>
        </div>
      </aside>
      <main class="conteudo" id="conteudo"></main>
    </div>`;
  const c = document.getElementById('conteudo');
  const telas = { grade: telaGrade, professor: telaProfessor, avisos: telaAvisos, cadastros: telaCadastros, equipe: telaEquipe, config: telaConfig };
  (telas[state.aba] || telaGrade)(c);
  if (state.previa) c.insertAdjacentHTML('afterbegin', bannerPrevia());
}

// ================= Gerador automático =================
function bannerPrevia() {
  const { resumo, faltou } = state.previa;
  const m = state.calc.m;
  const lista = faltou.map((f) => {
    const d = m.dist[f.dist_id];
    return `<div class="aviso atencao">${icon('triangle')}<div class="corpo"><strong>${esc(m.turma[d.turma_id].nome)} — ${esc(m.disc[d.disciplina_id].nome)}</strong>
      (${esc(m.prof[d.professor_id].nome)}): ${plural(f.n, 'aula ficou', 'aulas ficaram')} de fora. Motivo: ${esc(f.motivo)}</div>
      <div class="aviso-acoes"><button class="link-btn" data-ir-turma="${d.turma_id}">Ver turma</button></div></div>`;
  }).join('');
  return `<div class="previa nao-imprimir">
      <div><strong>Prévia do horário automático — ainda não foi salva</strong>
      <span>${resumo.colocadas} de ${plural(resumo.pedidas, 'aula colocada', 'aulas colocadas')} · ${plural(resumo.janelas, 'janela', 'janelas')} nos horários dos professores · aulas novas marcadas com um pontinho</span></div>
      <div class="acoes">
        <button class="btn sm" data-acao="previa-descartar">Descartar</button>
        <button class="btn sm" data-acao="previa-outra">Gerar outra opção</button>
        <button class="btn sm branco" data-acao="previa-aplicar">${icon('check')} Aplicar e salvar</button>
      </div>
    </div>
    ${faltou.length && state.aba === 'grade' ? `<div class="card faltou nao-imprimir"><h2>Não couberam</h2><div class="avisos">${lista}</div>
      <p class="muted peq" style="margin-top:10px">Dicas: libere horários do professor, troque o professor na Distribuição, aumente o máximo de aulas por dia ou fixe menos aulas.</p></div>` : ''}`;
}

function abrirGerador() {
  const D = state.dados;
  const t = state.calc.m.turma[state.turmaId];
  const fixas = D.aulas.filter((a) => a.fixa).length;
  modal({
    titulo: 'Gerar horário automático',
    sub: 'O sistema monta a grade seguindo as regras. Você vê uma prévia antes de salvar.',
    botao: 'Gerar prévia',
    corpo: `<div class="grade-form">
      <div class="campo" style="display:grid;gap:6px"><span style="font-size:.86rem;font-weight:600;color:var(--text-2)">Quais turmas?</span>
        <div class="radios">
          <label><input type="radio" name="escopo" value="todas" checked><div><strong>Todas as turmas (${D.turmas.length})</strong><span>Melhor resultado: o sistema equilibra os professores entre as turmas.</span></div></label>
          ${t ? `<label><input type="radio" name="escopo" value="${t.id}"><div><strong>Só o ${esc(t.nome)}</strong><span>As outras turmas ficam como estão.</span></div></label>` : ''}
        </div></div>
      <div class="campo" style="display:grid;gap:6px"><span style="font-size:.86rem;font-weight:600;color:var(--text-2)">O que fazer com as aulas que já estão na grade?</span>
        <div class="radios">
          <label><input type="radio" name="modo" value="completar" checked><div><strong>Manter e completar</strong><span>Só coloca as aulas que faltam.</span></div></label>
          <label><input type="radio" name="modo" value="refazer"><div><strong>Refazer do zero</strong><span>Monta tudo de novo. Só as aulas fixadas (${fixas}) ficam no lugar.</span></div></label>
        </div></div>
      <div class="aviso atencao" style="margin:0">${icon('settings')}<div class="corpo">Regras usadas: professor nunca em duas turmas ao mesmo tempo, respeita os horários em que não pode,
        no máximo ${D.config.max_disc_dia} aula(s) da mesma disciplina por dia${D.config.preferir_duplas ? ', preferindo aulas duplas seguidas' : ''},
        e tenta deixar o professor com menos janelas e menos dias na escola. Ajuste em Configurações e no cadastro de cada professor.</div></div>
    </div>`,
    onSubmit: async (d, form) => {
      const escopo = d.escopo === 'todas' ? new Set(D.turmas.map((x) => x.id)) : new Set([Number(d.escopo)]);
      const opts = { escopo, manter: d.modo !== 'refazer' };
      form.innerHTML = `<div class="gerando"><div class="roda"></div><strong>Montando o horário…</strong><span class="muted peq">Testando várias combinações. Leva poucos segundos.</span></div>`;
      await new Promise((r) => setTimeout(r, 60));
      entrarPrevia(Gerador.gerar(D, { ...opts, semente: Date.now() }), opts, D.aulas);
    },
  });
}

function entrarPrevia(r, opts, original) {
  state.previa = { ...r, opts, original };
  state.dados.aulas = r.aulas;
  state.editandoIndisp = null;
  calcular();
  state.aba = 'grade';
  render();
  window.scrollTo(0, 0);
}
function sairPrevia() {
  state.dados.aulas = state.previa.original;
  state.previa = null;
  calcular();
  render();
}

// Disciplina com mais aulas na grade do que o combinado: escolher qual tirar
function abrirSobra(distId) {
  const { m, aulas, problemas } = state.calc;
  const d = m.dist[distId];
  const lista = aulas.filter((a) => a.distribuicao_id === distId && state.dados.config.dias.includes(a.dia))
    .map((a) => ({ a, pr: problemas[`${a.turma_id}|${a.dia}|${a.periodo_id}`] }))
    .sort((x, y) => (y.pr ? 1 : 0) - (x.pr ? 1 : 0) || x.a.dia - y.a.dia);
  const extra = lista.length - d.aulas_semana;
  modal({
    titulo: 'Tirar aula a mais',
    sub: `${esc(m.disc[d.disciplina_id].nome)} do ${esc(m.turma[d.turma_id].nome)} tem ${lista.length} aulas e o combinado é ${d.aulas_semana}. Escolha ${extra === 1 ? 'qual tirar' : `quais tirar (${extra})`}. As com problema aparecem primeiro.`,
    semRodape: true,
    corpo: `<div class="opcoes">${lista.map(({ a, pr }, i) => `<button type="button" class="opcao" data-tirar="${i}" ${a.fixa ? 'disabled' : ''}>${icon('eraser')}
      <div><strong>Tirar a de ${DIAS[a.dia]}, ${a.per.inicio}</strong><small${pr ? ' class="alerta"' : ''}>${a.fixa ? 'Aula fixada' : pr ? '⚠ ' + esc(pr.join('; ')) : 'Sem problema'}</small></div></button>`).join('')}</div>
      <div class="modal-rodape"><button type="button" class="btn" data-fechar>Fechar</button></div>`,
  });
  $modal.querySelector('.modal-rodape [data-fechar]').addEventListener('click', () => $modal.close());
  $modal.querySelectorAll('[data-tirar]').forEach((b) => b.addEventListener('click', async () => {
    const { a } = lista[Number(b.dataset.tirar)];
    $modal.close();
    await salvar(() => api('/aulas', { method: 'PUT', body: { turma_id: a.turma_id, dia: a.dia, periodo_id: a.periodo_id, distribuicao_id: null } }), 'Aula retirada').catch(() => {});
  }));
}

// ================= Resolver choques =================
function abrirResolver(refs) {
  const { m } = state.calc;
  const ops = [];
  const nomeCel = (dia, pid) => `${DIAS[dia]}, ${m.per[pid].inicio}`;
  const blocos = refs.map((ref) => {
    const a = state.calc.aulas.find((x) => x.turma_id === ref.turma_id && x.dia === ref.dia && x.periodo_id === ref.periodo_id);
    if (!a) return '';
    const o = Gerador.opcoes(state.dados, ref);
    const disc = m.disc[a.disc_id].nome, prof = m.prof[a.prof_id], turma = m.turma[a.turma_id].nome;
    const botao = (op, ic, titulo, sub) => { ops.push(op); return `<button type="button" class="opcao" data-op="${ops.length - 1}">${icon(ic)}<div><strong>${titulo}</strong><small>${sub}</small></div></button>`; };
    let h = `<div class="grupo-opcoes"><h3>${esc(disc)} do ${esc(turma)} — ${nomeCel(a.dia, a.periodo_id)}</h3>`;
    if (o.fixa) return h + `<p class="muted peq">Esta aula está fixada. Solte-a na grade para ver opções.</p></div>`;
    for (const x of o.mover) h += botao({ alteracoes: x.alteracoes }, 'move', `Mover para ${nomeCel(x.dia, x.periodo_id)}`, `O ${esc(turma)} está vago e ${esc(prof.nome)} está livre nesse horário.`);
    for (const x of o.trocar) {
      const d2 = m.dist[x.dist];
      h += botao({ alteracoes: x.alteracoes }, 'swap', `Trocar com ${esc(m.disc[d2.disciplina_id].nome)} de ${nomeCel(x.dia, x.periodo_id)}`,
        `As duas aulas trocam de lugar; ${esc(m.prof[d2.professor_id].nome)} e ${esc(prof.nome)} ficam sem choque.`);
    }
    for (const x of o.professores) {
      h += botao({ professor: x }, 'user', `Passar ${esc(disc)} do ${esc(turma)} para ${esc(x.nome)}`,
        `${esc(x.nome)} já dá ${esc(disc)} e está livre em todas as ${x.aulas_semana} aulas desta disciplina na turma.`);
    }
    if (!o.mover.length && !o.trocar.length && !o.professores.length) {
      h += `<p class="muted peq">Não há mudança simples para esta aula. Tente "Gerar automático" só nesta turma, ou libere horários do professor.</p>`;
    }
    if (o.livres.length) {
      h += `<p class="livres">Livres neste horário: ${o.livres.slice(0, 8).map((q) => (q.mesmaDisc ? `<b>${esc(q.nome)}</b>` : esc(q.nome))).join(', ')}${o.livres.length > 8 ? '…' : ''}</p>`;
    }
    return h + '</div>';
  }).join('');
  modal({
    titulo: 'Opções para resolver',
    sub: 'Escolha uma opção e o sistema aplica na hora. Só aparecem mudanças que não criam choque novo.',
    semRodape: true,
    corpo: `<div class="opcoes">${blocos}</div><div class="modal-rodape"><button type="button" class="btn" data-fechar>Fechar</button></div>`,
  });
  $modal.querySelector('.modal-rodape [data-fechar]').addEventListener('click', () => $modal.close());
  $modal.querySelectorAll('[data-op]').forEach((b) => b.addEventListener('click', async () => {
    const op = ops[Number(b.dataset.op)];
    $modal.close();
    const fn = op.professor
      ? () => api(`/distribuicao/${op.professor.dist_id}`, { method: 'PUT', body: { professor_id: op.professor.id, aulas_semana: op.professor.aulas_semana } })
      : () => api('/aulas/lote', { method: 'POST', body: { alteracoes: op.alteracoes } });
    await salvar(fn, 'Pronto, horário ajustado').catch(() => {});
  }));
}

function vazio(titulo, texto, botao = '') {
  return `<div class="card vazio-box"><h3>${titulo}</h3><p>${texto}</p>${botao ? `<p style="margin-top:14px">${botao}</p>` : ''}</div>`;
}

function listaAvisos(av, comLinks = true) {
  if (!av.length) return `<div class="tudo-certo">${icon('check')} Nenhum problema encontrado.</div>`;
  const ordem = { erro: 0, atencao: 1, pendente: 2 };
  return `<div class="avisos">${[...av].sort((a, b) => ordem[a.nivel] - ordem[b.nivel]).map((a) => `
    <div class="aviso ${a.nivel === 'erro' ? 'erro' : 'atencao'}">
      ${icon(a.nivel === 'erro' ? 'alert' : 'triangle')}
      <div class="corpo">${a.texto}</div>
      <div class="aviso-acoes">
      ${(a.aulas || a.sobra) && !state.previa ? `<button class="btn sm" data-resolver="${a.idx}">${icon('wand')} Resolver</button>` : ''}
      ${a.nivel === 'pendente' && comLinks && !state.previa ? `<button class="btn sm" data-completar="${a.turma_id}">${icon('sparkles')} Completar com o gerador</button>` : ''}
      ${comLinks && a.turma_id ? `<button class="link-btn" data-ir-turma="${a.turma_id}">Ver turma</button>`
        : comLinks && a.prof_id ? `<button class="link-btn" data-ir-prof="${a.prof_id}">Ver professor</button>` : ''}
      </div>
    </div>`).join('')}</div>`;
}

// ================= Grade da turma =================
function celulaHTML(t, dia, p) {
  const { aulas, problemas, m } = state.calc;
  const a = aulas.find((x) => x.turma_id === t.id && x.dia === dia && x.periodo_id === p.id);
  const pr = problemas[`${t.id}|${dia}|${p.id}`];
  const titulo = `${DIAS[dia]}, ${p.inicio}–${p.fim}${pr ? ' — ' + pr.join('; ') : ''}`;
  if (!a) return `<button class="cel" data-cel="${t.id}|${dia}|${p.id}" title="${esc(titulo)}"><span>+ colocar aula</span></button>`;
  const disc = m.disc[a.disc_id], prof = m.prof[a.prof_id];
  const nova = state.previa?.novas.has(`${t.id}|${dia}|${p.id}`);
  return `<button class="cel cheia ${pr ? 'erro' : ''} ${nova ? 'nova' : ''}" style="--h:${hue(disc)}" data-cel="${t.id}|${dia}|${p.id}" title="${esc(titulo)}${a.fixa ? ' (fixa)' : ''}">
    <strong>${esc(disc.nome)}</strong><span>${esc(prof.nome)}</span>${a.fixa ? `<i class="cadeado">${icon('lock')}</i>` : ''}</button>`;
}

function tabelaGrade(periodos, cel) {
  const dias = state.dados.config.dias;
  let turnoAtual = null;
  const multi = new Set(periodos.map((p) => p.turno)).size > 1;
  return `<div class="grade-wrap"><table class="grade">
    <thead><tr><th class="hora">Horário</th>${dias.map((d) => `<th>${DIAS[d]}</th>`).join('')}</tr></thead>
    <tbody>${periodos.map((p) => {
      let sep = '';
      if (multi && p.turno !== turnoAtual) { turnoAtual = p.turno; sep = `<tr class="separador"><td colspan="${dias.length + 1}">${p.turno}</td></tr>`; }
      return `${sep}<tr><th class="hora"><strong>${p.inicio}</strong>${p.fim}</th>${dias.map((d) => `<td>${cel(d, p)}</td>`).join('')}</tr>`;
    }).join('')}</tbody></table></div>`;
}

function telaGrade(c) {
  const D = state.dados;
  if (!D.turmas.length || !D.periodos.length) {
    c.innerHTML = `<div class="pg-cab"><div><h1>Grade das turmas</h1></div></div>
      ${vazio('Vamos começar pelos cadastros', 'Cadastre os horários das aulas, as turmas, as disciplinas e os professores. Depois é só montar a grade aqui.',
        `<button class="btn primario" data-aba="cadastros">Ir para Cadastros</button>`)}`;
    return;
  }
  if (!D.turmas.some((t) => t.id === state.turmaId)) state.turmaId = D.turmas[0].id;
  const t = state.calc.m.turma[state.turmaId];
  const periodos = periodosDaTurma(t);
  const dist = D.distribuicao.filter((d) => d.turma_id === t.id)
    .sort((a, b) => state.calc.m.disc[a.disciplina_id].nome.localeCompare(state.calc.m.disc[b.disciplina_id].nome));
  // "Falta colocar" já aparece nas barras da Distribuição; aqui ficam só os problemas
  const avisosTurma = state.calc.avisos.filter((a) => a.nivel !== 'pendente' && (a.turma_id === t.id || a.turmas?.includes(t.id)));
  const colocadas = dist.reduce((s, d) => s + Math.min(state.calc.naGradeDist[d.id] || 0, d.aulas_semana), 0);
  const total = dist.reduce((s, d) => s + d.aulas_semana, 0);

  c.innerHTML = `
    <div class="pg-cab">
      <div><h1>Grade das turmas</h1><p>Clique num horário para colocar ou trocar a aula. Os avisos aparecem na hora.</p></div>
      <div class="acoes nao-imprimir">
        ${state.previa ? '' : `<button class="btn sm" data-acao="limpar-grade">${icon('eraser')} Limpar grade</button>`}
        <button class="btn sm" data-acao="imprimir">${icon('print')} Imprimir</button>
        ${state.previa ? '' : `<button class="btn sm primario" data-acao="gerar">${icon('sparkles')} Gerar automático</button>`}
      </div>
    </div>
    <div class="toolbar">
      <select id="sel-turma" aria-label="Turma">${D.turmas.map((x) => `<option value="${x.id}" ${x.id === t.id ? 'selected' : ''}>${esc(x.nome)} — ${x.turno}</option>`).join('')}</select>
      <span class="pill ${total && colocadas === total ? 'verde' : 'neutro'}">${colocadas} de ${plural(total, 'aula colocada', 'aulas colocadas')}</span>
    </div>
    <div class="so-impressao"><h2>${esc(D.config.escola)} — ${esc(t.nome)} (${t.turno})</h2></div>
    <div class="colunas">
      <div>
        ${periodos.length ? tabelaGrade(periodos, (d, p) => celulaHTML(t, d, p))
          : vazio('Sem horários neste turno', `Cadastre os horários das aulas do turno ${t.turno === 'Integral' ? 'da Manhã e da Tarde' : t.turno}.`, `<button class="btn primario" data-aba="cadastros" data-cad="periodos">Cadastrar horários</button>`)}
        <div class="legenda"><span><i style="outline:2px solid var(--danger)"></i>Aula com problema (passe o mouse para ver)</span></div>
      </div>
      <aside>
        <div class="card">
          <h2>Distribuição</h2>
          ${dist.length ? `<div class="lista-dist">${dist.map((d) => {
            const n = state.calc.naGradeDist[d.id] || 0, disc = state.calc.m.disc[d.disciplina_id];
            const cls = n === d.aulas_semana ? 'ok' : n > d.aulas_semana ? 'sobra' : '';
            return `<div class="dist-item">
              <div class="topo"><div><strong><span class="bolinha" style="--h:${hue(disc)}"></span>${esc(disc.nome)}</strong>
                <span class="prof">${esc(state.calc.m.prof[d.professor_id].nome)}</span></div><span class="muted">${n}/${d.aulas_semana}</span></div>
              <div class="barra ${cls}"><span style="width:${Math.min(100, (n / d.aulas_semana) * 100)}%"></span></div>
            </div>`;
          }).join('')}</div>` : '<p class="muted peq">Nenhuma disciplina distribuída para esta turma.</p>'}
          <p style="margin-top:14px"><button class="link-btn" data-acao="editar-dist" data-turma="${t.id}">Editar distribuição</button></p>
        </div>
        <div class="card">
          <h2>Avisos da turma</h2>
          ${listaAvisos(avisosTurma, false)}
        </div>
      </aside>
    </div>`;
  c.querySelector('#sel-turma').addEventListener('change', (e) => { state.turmaId = Number(e.target.value); storage.set('horario_turma', state.turmaId); render(); });
}

// Escolher o que vai numa célula
function escolherAula(turmaId, dia, periodoId) {
  const { m, aulas, indisp, naGradeDist } = state.calc;
  const t = m.turma[turmaId], p = m.per[periodoId];
  const atual = aulas.find((x) => x.turma_id === turmaId && x.dia === dia && x.periodo_id === periodoId);
  const dist = state.dados.distribuicao.filter((d) => d.turma_id === turmaId)
    .sort((a, b) => m.disc[a.disciplina_id].nome.localeCompare(m.disc[b.disciplina_id].nome));
  const ocupado = (profId) => aulas.find((x) => x.prof_id === profId && x.dia === dia && x.turma_id !== turmaId && sobrepoe(x.per, p));
  const opcoes = dist.map((d) => {
    const disc = m.disc[d.disciplina_id], prof = m.prof[d.professor_id];
    const n = naGradeDist[d.id] || 0;
    const outro = ocupado(d.professor_id);
    const alertas = [];
    if (outro) alertas.push(`já está no ${m.turma[outro.turma_id].nome} neste horário`);
    if (indisp.has(`${d.professor_id}|${dia}|${periodoId}`)) alertas.push('marcou que não pode neste horário');
    const ehAtual = atual?.distribuicao_id === d.id;
    if (!ehAtual && n >= d.aulas_semana) alertas.push(`já tem as ${d.aulas_semana} aulas da semana`);
    return `<button type="button" class="opcao ${ehAtual ? 'atual' : ''}" data-dist="${d.id}">
      <span class="bolinha" style="--h:${hue(disc)}"></span>
      <div><strong>${esc(disc.nome)}</strong><small>${esc(prof.nome)} · ${n} de ${d.aulas_semana} na semana</small>
      ${alertas.length ? `<small class="alerta">⚠ ${esc(prof.nome.split(' ')[0])} ${esc(alertas.join(' e '))}</small>` : ''}</div>
      ${ehAtual ? icon('check') : ''}
    </button>`;
  }).join('');
  const pr = state.calc.problemas[`${turmaId}|${dia}|${periodoId}`];
  // professores sem aula neste horário (ajuda a achar substituto)
  const livres = state.dados.professores.filter((q) => !indisp.has(`${q.id}|${dia}|${periodoId}`)
    && !aulas.some((x) => x.prof_id === q.id && x.dia === dia && sobrepoe(x.per, p))).map((q) => q.nome);
  modal({
    titulo: `${t.nome} — ${DIAS[dia]}, ${p.inicio}`,
    sub: atual?.fixa ? 'Esta aula está fixada: o gerador automático não mexe nela.' : 'Escolha a disciplina. Se aparecer ⚠, você ainda pode escolher; o aviso fica marcado na grade.',
    semRodape: true,
    corpo: `${pr ? `<div class="problemas"><strong>Problema nesta aula</strong>${pr.map((x) => `<span>• ${esc(x)}</span>`).join('')}
        <div><button type="button" class="btn sm" data-acao-modal="resolver">${icon('wand')} Ver opções para resolver</button></div></div>` : ''}
      <div class="opcoes">${opcoes || '<p class="muted">Esta turma ainda não tem disciplinas na distribuição.</p>'}</div>
      ${livres.length ? `<p class="livres">Professores livres neste horário: ${esc(livres.slice(0, 6).join(', '))}${livres.length > 6 ? ` e mais ${livres.length - 6}` : ''}</p>` : ''}
      <div class="modal-rodape">
        <button type="button" class="btn sm" data-acao-modal="dist">Editar distribuição</button>
        ${atual ? `<button type="button" class="btn sm" data-acao-modal="fixar">${icon(atual.fixa ? 'unlock' : 'lock')} ${atual.fixa ? 'Soltar aula' : 'Fixar aula'}</button>` : ''}
        ${atual ? `<button type="button" class="btn sm" data-dist="">${icon('eraser')} Deixar vago</button>` : ''}
      </div>`,
  });
  $modal.querySelector('[data-acao-modal="resolver"]')?.addEventListener('click', () => {
    $modal.close();
    abrirResolver([{ turma_id: turmaId, dia, periodo_id: periodoId }]);
  });
  $modal.querySelector('[data-acao-modal="fixar"]')?.addEventListener('click', async () => {
    $modal.close();
    await salvar(() => api('/aulas/fixar', { method: 'POST', body: { turma_id: turmaId, dia, periodo_id: periodoId, fixa: !atual.fixa } }),
      atual.fixa ? 'Aula solta' : 'Aula fixada').catch(() => {});
  });
  $modal.querySelectorAll('[data-dist]').forEach((b) => b.addEventListener('click', async () => {
    const distId = b.dataset.dist ? Number(b.dataset.dist) : null;
    $modal.close();
    if ((atual?.distribuicao_id ?? null) === distId) return;
    await salvar(() => api('/aulas', { method: 'PUT', body: { turma_id: turmaId, dia, periodo_id: periodoId, distribuicao_id: distId } })).catch(() => {});
  }));
  $modal.querySelector('[data-acao-modal="dist"]').addEventListener('click', () => {
    $modal.close();
    abrirDistribuicao(turmaId);
  });
}

function abrirDistribuicao(turmaId) {
  state.aba = 'cadastros'; state.cad = 'distribuicao'; state.distTurma = turmaId;
  storage.set('horario_aba', state.aba);
  render();
}

// ================= Por professor =================
function telaProfessor(c) {
  const D = state.dados;
  if (!D.professores.length) {
    c.innerHTML = `<div class="pg-cab"><div><h1>Por professor</h1></div></div>${vazio('Nenhum professor cadastrado', 'Cadastre os professores em Cadastros.', `<button class="btn primario" data-aba="cadastros" data-cad="professores">Cadastrar</button>`)}`;
    return;
  }
  if (!D.professores.some((p) => p.id === state.profId)) state.profId = D.professores[0].id;
  const { m, aulas, problemas, cargaProf, indisp } = state.calc;
  const prof = m.prof[state.profId];
  const meu = aulas.filter((a) => a.prof_id === prof.id);
  const editando = state.editandoIndisp;
  // Turnos em que o professor tem aula (ou todos, se estiver marcando indisponibilidade)
  const turnosUsados = new Set(meu.map((a) => a.per.turno));
  const periodos = D.periodos.filter((p) => editando || !turnosUsados.size || turnosUsados.has(p.turno));
  const c1 = cargaProf[prof.id];
  const n = Math.max(c1.planejadas, c1.naGrade);
  const avisosProf = state.calc.avisos.filter((a) => a.prof_id === prof.id && a.nivel !== 'pendente');

  const cel = (dia, p) => {
    const chave = `${dia}|${p.id}`;
    const bloq = editando ? editando.has(chave) : indisp.has(`${prof.id}|${dia}|${p.id}`);
    if (editando) {
      return `<button class="cel ${bloq ? 'bloqueada' : ''}" data-indisp="${chave}" title="${bloq ? 'Não pode' : 'Pode'}">
        <strong>${bloq ? 'Não pode' : ''}</strong><span>${bloq ? '' : 'pode'}</span></button>`;
    }
    const aqui = meu.filter((a) => a.dia === dia && sobrepoe(a.per, p) && a.periodo_id === p.id);
    if (!aqui.length) return `<div class="cel so-leitura ${bloq ? 'bloqueada' : ''}" title="${bloq ? 'Não pode neste horário' : 'Livre'}">${bloq ? '<span>não pode</span>' : ''}</div>`;
    const a = aqui[0], disc = m.disc[a.disc_id];
    const pr = aqui.flatMap((x) => problemas[`${x.turma_id}|${x.dia}|${x.periodo_id}`] || []);
    return `<button class="cel cheia ${pr.length ? 'erro' : ''}" style="--h:${hue(disc)}" data-ir-turma="${a.turma_id}" title="${esc(pr.join('; ') || 'Abrir a grade da turma')}">
      <strong>${esc(aqui.map((x) => m.turma[x.turma_id].nome).join(' + '))}</strong><span>${esc(disc.nome)}</span></button>`;
  };

  const regra = D.config.rede === 'publica' && prof.jornada_horas
    ? `${horas(c1.horasSala)} com alunos de ${horas(c1.maxSala)} permitidas (2/3 de ${horas(prof.jornada_horas)})`
    : prof.limite_aulas ? `limite da escola: ${prof.limite_aulas} aulas` : 'sem limite cadastrado';

  c.innerHTML = `
    <div class="pg-cab">
      <div><h1>Por professor</h1><p>Veja a semana de cada professor e marque os horários em que ele não pode.</p></div>
      <div class="acoes nao-imprimir">
        ${editando
          ? `<button class="btn sm" data-acao="indisp-cancelar">Cancelar</button><button class="btn sm primario" data-acao="indisp-salvar">${icon('check')} Salvar horários</button>`
          : `<button class="btn sm" data-acao="indisp-editar">${icon('ban')} Marcar quando não pode</button>
             <button class="btn sm" data-acao="imprimir">${icon('print')} Imprimir</button>`}
      </div>
    </div>
    <div class="toolbar">
      <select id="sel-prof" aria-label="Professor" ${editando ? 'disabled' : ''}>${D.professores.map((p) => `<option value="${p.id}" ${p.id === prof.id ? 'selected' : ''}>${esc(p.nome)}</option>`).join('')}</select>
      <span class="pill ${avisosProf.length ? 'amarelo' : 'neutro'}">${plural(n, 'aula', 'aulas')} por semana · ${regra}</span>
      <span class="pill neutro" title="Janela = horário vago entre duas aulas no mesmo dia">${plural(Gerador.janelasProfessor(state.dados, prof.id), 'janela', 'janelas')}</span>
    </div>
    ${editando ? `<div class="aviso atencao nao-imprimir" style="margin-bottom:14px">${icon('ban')}<div class="corpo">Clique nos horários em que <strong>${esc(prof.nome)}</strong> não pode dar aula. Clique de novo para liberar. Depois, salve.</div></div>` : ''}
    <div class="so-impressao"><h2>${esc(D.config.escola)} — ${esc(prof.nome)}</h2></div>
    ${D.periodos.length ? tabelaGrade(periodos, cel) : vazio('Sem horários', 'Cadastre os horários das aulas em Cadastros.')}
    <div class="legenda"><span><i class="cel bloqueada" style="min-height:0;padding:0;border-style:solid"></i>Não pode</span><span><i style="outline:2px solid var(--danger)"></i>Problema</span></div>
    ${avisosProf.length ? `<div class="card" style="margin-top:16px"><h2>Avisos</h2>${listaAvisos(avisosProf, false)}</div>` : ''}`;
  c.querySelector('#sel-prof').addEventListener('change', (e) => { state.profId = Number(e.target.value); render(); });
}

// ================= Avisos =================
function telaAvisos(c) {
  const av = state.calc.avisos;
  const grupos = [
    ['erro', 'Precisa corrigir', 'Conflitos de horário, aulas em horário proibido e turmas sem espaço.'],
    ['atencao', 'Atenção', 'Carga dos professores e outros pontos para conferir.'],
    ['pendente', 'Falta terminar', 'Aulas da distribuição que ainda não foram colocadas na grade.'],
  ];
  c.innerHTML = `
    <div class="pg-cab"><div><h1>Avisos</h1><p>Tudo o que o sistema encontrou no horário, do mais grave ao menos grave.</p></div></div>
    ${av.length ? grupos.map(([nivel, titulo, sub]) => {
      const itens = av.filter((a) => a.nivel === nivel);
      if (!itens.length) return '';
      return `<div class="card"><h2>${titulo} <span class="pill ${nivel === 'erro' ? 'vermelho' : 'amarelo'}">${itens.length}</span></h2>
        <p class="muted peq" style="margin:-6px 0 12px">${sub}</p>${listaAvisos(itens)}</div>`;
    }).join('') : `<div class="card">${listaAvisos([])}<p class="muted peq" style="margin-top:10px">Todas as aulas da distribuição estão na grade, sem conflitos.</p></div>`}`;
}

// ================= Cadastros =================
const CADS = [['turmas', 'Turmas'], ['distribuicao', 'Distribuição'], ['professores', 'Professores'], ['disciplinas', 'Disciplinas'], ['periodos', 'Horários das aulas']];

function telaCadastros(c) {
  c.innerHTML = `
    <div class="pg-cab"><div><h1>Cadastros</h1><p>Ordem sugerida: horários das aulas → turmas → disciplinas → professores → distribuição.</p></div></div>
    <div class="toolbar"><div class="segmentado">${CADS.map(([id, rot]) => `<button class="${state.cad === id ? 'ativo' : ''}" data-cad="${id}">${rot}</button>`).join('')}</div></div>
    <div id="cad"></div>`;
  const alvo = c.querySelector('#cad');
  ({ turmas: cadTurmas, distribuicao: cadDistribuicao, professores: cadProfessores, disciplinas: cadDisciplinas, periodos: cadPeriodos })[state.cad]?.(alvo);
}

const botaoNovo = (acao, rot) => `<button class="btn sm primario" data-acao="${acao}">${icon('plus')} ${rot}</button>`;
const botoesLinha = (tipo, id) => `<td class="acoes-td">
  <button class="icone-btn" data-editar="${tipo}" data-id="${id}" title="Editar">${icon('edit')}</button>
  <button class="icone-btn perigo" data-excluir="${tipo}" data-id="${id}" title="Excluir">${icon('trash')}</button></td>`;

function cadTurmas(el) {
  const D = state.dados;
  el.innerHTML = `<div class="card">
    <div class="pg-cab" style="margin-bottom:8px"><h2 style="margin:0">Turmas</h2>${botaoNovo('nova-turma', 'Nova turma')}</div>
    ${D.turmas.length ? `<div class="tabela-scroll"><table class="lista"><thead><tr><th>Turma</th><th>Turno</th><th>Aulas na semana</th><th></th></tr></thead><tbody>
      ${D.turmas.map((t) => {
        const pedidas = D.distribuicao.filter((d) => d.turma_id === t.id).reduce((s, d) => s + d.aulas_semana, 0);
        const vagas = periodosDaTurma(t).length * D.config.dias.length;
        return `<tr><td><strong>${esc(t.nome)}</strong></td><td>${t.turno}</td>
          <td><span class="pill ${pedidas > vagas ? 'vermelho' : 'neutro'}">${pedidas} de ${vagas} horários</span>
          <button class="link-btn" data-acao="editar-dist" data-turma="${t.id}" style="margin-left:8px">Distribuição</button></td>
          ${botoesLinha('turma', t.id)}</tr>`;
      }).join('')}</tbody></table></div>` : '<p class="muted">Nenhuma turma ainda.</p>'}
  </div>`;
}

function formTurma(t = {}) {
  modal({
    titulo: t.id ? 'Editar turma' : 'Nova turma',
    corpo: `<div class="grade-form">
      <label class="campo">Nome<input name="nome" value="${esc(t.nome)}" maxlength="60" placeholder="Ex.: 6º Ano A" required></label>
      <label class="campo">Turno<select name="turno">${[...TURNOS, 'Integral'].map((x) => `<option ${t.turno === x ? 'selected' : ''}>${x}</option>`).join('')}</select>
      <small>Integral usa os horários da Manhã e da Tarde.</small></label></div>`,
    onSubmit: (d) => salvar(() => api(t.id ? `/turmas/${t.id}` : '/turmas', { method: t.id ? 'PUT' : 'POST', body: d }), 'Turma salva'),
  });
}

function cadDistribuicao(el) {
  const D = state.dados;
  if (!D.turmas.length) { el.innerHTML = vazio('Cadastre uma turma primeiro', 'A distribuição diz quem dá cada disciplina em cada turma.'); return; }
  if (!D.turmas.some((t) => t.id === state.distTurma)) state.distTurma = state.turmaId && D.turmas.some((t) => t.id === state.turmaId) ? state.turmaId : D.turmas[0].id;
  const { m, naGradeDist } = state.calc;
  const t = m.turma[state.distTurma];
  const ds = D.distribuicao.filter((d) => d.turma_id === t.id).sort((a, b) => m.disc[a.disciplina_id].nome.localeCompare(m.disc[b.disciplina_id].nome));
  const pedidas = ds.reduce((s, d) => s + d.aulas_semana, 0);
  const vagas = periodosDaTurma(t).length * D.config.dias.length;
  const livres = D.disciplinas.filter((x) => !ds.some((d) => d.disciplina_id === x.id));
  const optsProf = (sel) => D.professores.map((p) => `<option value="${p.id}" ${p.id === sel ? 'selected' : ''}>${esc(p.nome)}</option>`).join('');
  el.innerHTML = `<div class="card">
    <div class="toolbar">
      <select id="sel-dist-turma" aria-label="Turma">${D.turmas.map((x) => `<option value="${x.id}" ${x.id === t.id ? 'selected' : ''}>${esc(x.nome)} — ${x.turno}</option>`).join('')}</select>
      <span class="pill ${pedidas > vagas ? 'vermelho' : pedidas === vagas ? 'verde' : 'neutro'}">${pedidas} aulas pedidas · ${vagas} horários na grade</span>
      <button class="link-btn" data-ir-turma="${t.id}">Abrir a grade</button>
    </div>
    <p class="muted peq" style="margin-bottom:12px">Para cada disciplina da turma: quem dá a aula e quantas aulas por semana. Trocar o professor aqui troca em toda a grade.</p>
    ${ds.length ? `<div class="tabela-scroll"><table class="lista"><thead><tr><th>Disciplina</th><th>Professor</th><th>Aulas/semana</th><th>Na grade</th><th></th></tr></thead><tbody>
      ${ds.map((d) => `<tr data-linha-dist="${d.id}">
        <td><span class="bolinha" style="--h:${hue(m.disc[d.disciplina_id])}"></span>${esc(m.disc[d.disciplina_id].nome)}</td>
        <td><select data-campo="professor_id" aria-label="Professor">${optsProf(d.professor_id)}</select></td>
        <td style="width:110px"><input data-campo="aulas_semana" type="number" min="1" max="40" value="${d.aulas_semana}" aria-label="Aulas por semana"></td>
        <td>${naGradeDist[d.id] || 0}</td>
        <td class="acoes-td"><button class="icone-btn perigo" data-excluir="dist" data-id="${d.id}" title="Remover">${icon('trash')}</button></td>
      </tr>`).join('')}</tbody></table></div>` : '<p class="muted">Nenhuma disciplina distribuída ainda.</p>'}
    ${livres.length && D.professores.length ? `<form id="form-dist" class="tres" style="margin-top:16px;align-items:end">
      <label class="campo">Disciplina<select name="disciplina_id">${livres.map((x) => `<option value="${x.id}">${esc(x.nome)}</option>`).join('')}</select></label>
      <label class="campo">Professor<select name="professor_id">${optsProf(0)}</select></label>
      <div style="display:flex;gap:8px;align-items:end"><label class="campo" style="flex:1">Aulas/semana<input name="aulas_semana" type="number" min="1" max="40" value="2" required></label>
      <button class="btn primario" type="submit">${icon('plus')} Adicionar</button></div>
    </form>` : !D.professores.length ? '<p class="muted peq" style="margin-top:12px">Cadastre professores para distribuir as disciplinas.</p>'
      : !D.disciplinas.length ? '<p class="muted peq" style="margin-top:12px">Cadastre as disciplinas primeiro.</p>' : '<p class="muted peq" style="margin-top:12px">Todas as disciplinas cadastradas já estão nesta turma.</p>'}
  </div>`;
  el.querySelector('#sel-dist-turma').addEventListener('change', (e) => { state.distTurma = Number(e.target.value); render(); });
  el.querySelector('#form-dist')?.addEventListener('submit', (e) => {
    e.preventDefault();
    salvar(() => api('/distribuicao', { method: 'POST', body: { ...dadosForm(e.target), turma_id: t.id } }), 'Disciplina adicionada').catch(() => {});
  });
  el.querySelectorAll('[data-linha-dist]').forEach((tr) => tr.addEventListener('change', () => {
    const body = { professor_id: tr.querySelector('[data-campo=professor_id]').value, aulas_semana: Number(tr.querySelector('[data-campo=aulas_semana]').value) };
    salvar(() => api(`/distribuicao/${tr.dataset.linhaDist}`, { method: 'PUT', body }), 'Distribuição salva').catch(() => {});
  }));
}

function cadProfessores(el) {
  const D = state.dados, { cargaProf } = state.calc;
  const publica = D.config.rede === 'publica';
  el.innerHTML = `<div class="card">
    <div class="pg-cab" style="margin-bottom:8px"><h2 style="margin:0">Professores</h2>${botaoNovo('novo-prof', 'Novo professor')}</div>
    ${D.professores.length ? `<div class="tabela-scroll"><table class="lista"><thead><tr><th>Nome</th><th>Jornada</th><th>Limite de aulas</th><th>Aulas</th><th></th></tr></thead><tbody>
      ${D.professores.map((p) => {
        const c = cargaProf[p.id];
        const n = Math.max(c.planejadas, c.naGrade);
        const passou = (p.limite_aulas && n > p.limite_aulas) || (publica && p.jornada_horas && c.horasSala > c.maxSala + 1e-9);
        return `<tr><td><button class="link-btn" data-ir-prof="${p.id}" style="font-size:.9rem">${esc(p.nome)}</button></td>
          <td>${p.jornada_horas ? horas(p.jornada_horas) + '/semana' : '<span class="muted">—</span>'}</td>
          <td>${p.limite_aulas ?? '<span class="muted">—</span>'}</td>
          <td><span class="pill ${passou ? 'amarelo' : 'neutro'}">${n}</span></td>
          ${botoesLinha('prof', p.id)}</tr>`;
      }).join('')}</tbody></table></div>` : '<p class="muted">Nenhum professor ainda.</p>'}
    <p class="muted peq" style="margin-top:12px">${publica
      ? 'Rede pública: o sistema avisa quando as aulas passam de 2/3 da jornada (Lei 11.738/2008, Lei do Piso).'
      : 'Rede particular: o sistema avisa quando o professor passa do limite de aulas que a escola definir.'} Dá para mudar em Configurações.</p>
  </div>`;
}

function formProfessor(p = {}) {
  const publica = state.dados.config.rede === 'publica';
  modal({
    titulo: p.id ? 'Editar professor' : 'Novo professor',
    corpo: `<div class="grade-form">
      <label class="campo">Nome<input name="nome" value="${esc(p.nome)}" maxlength="80" required></label>
      <div class="duas">
        <label class="campo">Jornada semanal (horas)<input name="jornada_horas" type="number" step="0.5" min="1" max="60" value="${p.jornada_horas ?? ''}">
          <small>${publica ? 'Usada na regra dos 2/3 em sala.' : 'Opcional.'}</small></label>
        <label class="campo">Limite de aulas por semana<input name="limite_aulas" type="number" min="1" max="80" value="${p.limite_aulas ?? ''}">
          <small>Opcional. Avisa se passar.</small></label>
      </div>
      <label class="campo">Máximo de aulas por dia<input name="max_aulas_dia" type="number" min="1" max="20" value="${p.max_aulas_dia ?? ''}">
        <small>Opcional. O gerador automático respeita; na montagem manual vira aviso.</small></label>
      </div>`,
    onSubmit: (d) => salvar(() => api(p.id ? `/professores/${p.id}` : '/professores', { method: p.id ? 'PUT' : 'POST', body: d }), 'Professor salvo'),
  });
}

function cadDisciplinas(el) {
  const D = state.dados;
  el.innerHTML = `<div class="card">
    <div class="pg-cab" style="margin-bottom:8px"><h2 style="margin:0">Disciplinas</h2>${botaoNovo('nova-disc', 'Nova disciplina')}</div>
    ${D.disciplinas.length ? `<table class="lista"><tbody>
      ${D.disciplinas.map((x) => `<tr><td><span class="bolinha" style="--h:${hue(x)}"></span>${esc(x.nome)}</td>${botoesLinha('disc', x.id)}</tr>`).join('')}
    </tbody></table>` : '<p class="muted">Nenhuma disciplina ainda.</p>'}
  </div>`;
}

function formDisciplina(x = {}) {
  modal({
    titulo: x.id ? 'Editar disciplina' : 'Nova disciplina',
    corpo: `<label class="campo">Nome<input name="nome" value="${esc(x.nome)}" maxlength="60" placeholder="Ex.: Matemática" required></label>`,
    onSubmit: (d) => salvar(() => api(x.id ? `/disciplinas/${x.id}` : '/disciplinas', { method: x.id ? 'PUT' : 'POST', body: d }), 'Disciplina salva'),
  });
}

function cadPeriodos(el) {
  const D = state.dados;
  el.innerHTML = `<div class="card">
    <div class="pg-cab" style="margin-bottom:8px"><h2 style="margin:0">Horários das aulas</h2>${botaoNovo('novo-per', 'Novo horário')}</div>
    <p class="muted peq" style="margin-bottom:12px">Cada linha é uma aula do turno (o intervalo fica de fora). Ex.: Manhã, 07:00 às 07:50.</p>
    ${TURNOS.map((tn) => {
      const ps = D.periodos.filter((p) => p.turno === tn);
      if (!ps.length) return '';
      return `<h3 style="font-size:.9rem;margin:14px 0 4px">${tn}</h3><table class="lista"><tbody>
        ${ps.map((p, i) => `<tr><td style="width:70px"><strong>${i + 1}ª aula</strong></td><td>${p.inicio} às ${p.fim}</td>${botoesLinha('per', p.id)}</tr>`).join('')}
      </tbody></table>`;
    }).join('') || '<p class="muted">Nenhum horário ainda.</p>'}
  </div>`;
}

function formPeriodo(p = {}) {
  const ult = state.dados.periodos.filter((x) => x.turno === (p.turno || 'Manhã')).at(-1);
  modal({
    titulo: p.id ? 'Editar horário' : 'Novo horário de aula',
    corpo: `<div class="grade-form">
      <label class="campo">Turno<select name="turno">${TURNOS.map((x) => `<option ${p.turno === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
      <div class="duas">
        <label class="campo">Início<input name="inicio" type="time" value="${p.inicio || ult?.fim || '07:00'}" required></label>
        <label class="campo">Fim<input name="fim" type="time" value="${p.fim || ''}" required></label>
      </div></div>`,
    onSubmit: (d) => salvar(() => api(p.id ? `/periodos/${p.id}` : '/periodos', { method: p.id ? 'PUT' : 'POST', body: d }), 'Horário salvo'),
  });
}

// ================= Equipe =================
async function telaEquipe(c) {
  c.innerHTML = `<div class="pg-cab"><div><h1>Equipe</h1><p>Quem pode entrar e montar o horário.</p></div>${botaoNovo('nova-pessoa', 'Nova pessoa')}</div><div class="card"><p class="muted">Carregando…</p></div>`;
  let us;
  try { us = await api('/usuarios'); } catch (e) { return toast(e.message, true); }
  if (state.aba !== 'equipe') return;
  c.querySelector('.card').innerHTML = `<div class="tabela-scroll"><table class="lista"><thead><tr><th>Nome</th><th>Login</th><th>Último acesso</th><th></th></tr></thead><tbody>
    ${us.map((u) => `<tr style="${u.arquivado_em ? 'opacity:.55' : ''}">
      <td><strong>${esc(u.nome)}</strong>${u.cargo ? `<br><span class="muted peq">${esc(u.cargo)}</span>` : ''}${u.arquivado_em ? ' <span class="pill neutro">desativado</span>' : ''}</td>
      <td>${esc(u.login)}</td>
      <td class="peq">${u.ultimo_acesso ? new Date(u.ultimo_acesso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '<span class="muted">nunca</span>'}</td>
      <td class="acoes-td">${u.id === state.user.id ? '<span class="muted peq">você</span>' : `
        <button class="icone-btn" data-acao="nova-senha" data-id="${u.id}" data-nome="${esc(u.nome)}" title="Gerar nova senha">${icon('key')}</button>
        <button class="icone-btn ${u.arquivado_em ? '' : 'perigo'}" data-acao="ativar" data-id="${u.id}" data-ativo="${u.arquivado_em ? '1' : ''}" title="${u.arquivado_em ? 'Reativar' : 'Desativar acesso'}">${icon(u.arquivado_em ? 'restore' : 'ban')}</button>`}</td>
    </tr>`).join('')}</tbody></table></div>`;
}

function mostrarSenha(titulo, r) {
  modal({
    titulo, semRodape: true,
    corpo: `<p class="muted">Passe estes dados para a pessoa. A senha não aparece de novo; ela pode trocar depois em Configurações.</p>
      <label class="campo">Login<div class="senha-box" style="font-size:1rem">${esc(r.login)}</div></label>
      <label class="campo">Senha<div class="senha-box">${esc(r.senha)}</div></label>
      <div class="modal-rodape"><button type="button" class="btn" data-copiar>Copiar</button><button type="button" class="btn primario" data-fechar>Pronto</button></div>`,
  });
  $modal.querySelector('[data-fechar]:last-child')?.addEventListener('click', () => $modal.close());
  $modal.querySelector('[data-copiar]').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(`Horário Escolar\nLogin: ${r.login}\nSenha: ${r.senha}\n${location.origin}`); toast('Copiado'); } catch { toast('Não foi possível copiar', true); }
  });
}

// ================= Configurações =================
function telaConfig(c) {
  const cf = state.dados.config;
  c.innerHTML = `
    <div class="pg-cab"><div><h1>Configurações</h1><p>Dados da escola e regras usadas nos avisos.</p></div></div>
    <form class="card grade-form" id="form-config">
      <h2>Escola</h2>
      <div class="duas">
        <label class="campo">Nome da escola<input name="escola" value="${esc(cf.escola)}" maxlength="120" required></label>
        <label class="campo">Duração de cada aula (minutos)<input name="duracao_aula" type="number" min="20" max="120" value="${cf.duracao_aula}" required>
          <small>Usada para converter aulas em horas.</small></label>
      </div>
      <div class="campo" style="display:grid;gap:6px"><span style="font-size:.86rem;font-weight:600;color:var(--text-2)">Dias de aula</span>
        <div class="dias-check">${Object.entries(DIAS).map(([n, nome]) => `<label><input type="checkbox" name="dia" value="${n}" ${cf.dias.includes(Number(n)) ? 'checked' : ''}> ${nome}</label>`).join('')}</div>
      </div>
      <div class="campo" style="display:grid;gap:6px"><span style="font-size:.86rem;font-weight:600;color:var(--text-2)">Regra de carga dos professores</span>
        <div class="radios">
          <label><input type="radio" name="rede" value="particular" ${cf.rede === 'particular' ? 'checked' : ''}>
            <div><strong>Rede particular</strong><span>Avisa quando o professor passa do limite de aulas por semana que você cadastrar para ele.</span></div></label>
          <label><input type="radio" name="rede" value="publica" ${cf.rede === 'publica' ? 'checked' : ''}>
            <div><strong>Rede pública</strong><span>Também avisa quando as aulas passam de 2/3 da jornada do professor (Lei 11.738/2008, a Lei do Piso; pelo menos 1/3 fica para planejamento).</span></div></label>
        </div>
      </div>
      <h2 style="margin-top:6px">Regras da montagem</h2>
      <div class="duas">
        <label class="campo">Máximo de aulas da mesma disciplina por dia<input name="max_disc_dia" type="number" min="1" max="10" value="${cf.max_disc_dia}" required>
          <small>Na mesma turma. Ex.: 2 = no máximo duas aulas de Matemática no mesmo dia.</small></label>
        <label class="chk" style="align-self:center"><input type="checkbox" name="preferir_duplas" ${cf.preferir_duplas ? 'checked' : ''}>
          <span><strong>Preferir aulas duplas</strong><br><span class="muted peq">Quando a disciplina tiver 2 aulas no mesmo dia, o gerador tenta deixá-las seguidas.</span></span></label>
      </div>
      <div><button class="btn primario" type="submit">Salvar configurações</button></div>
    </form>
    <form class="card grade-form" id="form-senha">
      <h2>Minha senha</h2>
      <div class="duas">
        <label class="campo">Senha atual<input name="atual" type="password" autocomplete="current-password" required></label>
        <label class="campo">Nova senha<input name="nova" type="password" minlength="6" autocomplete="new-password" required></label>
      </div>
      <div><button class="btn" type="submit">Trocar senha</button></div>
    </form>`;
  c.querySelector('#form-config').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    const body = { escola: f.escola.value, duracao_aula: Number(f.duracao_aula.value), rede: f.rede.value,
      max_disc_dia: Number(f.max_disc_dia.value), preferir_duplas: f.preferir_duplas.checked,
      dias: [...f.querySelectorAll('[name=dia]:checked')].map((x) => Number(x.value)) };
    salvar(() => api('/config', { method: 'PUT', body }), 'Configurações salvas').catch(() => {});
  });
  c.querySelector('#form-senha').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api('/me/senha', { method: 'PUT', body: dadosForm(e.target) });
      e.target.reset();
      toast('Senha trocada');
    } catch (err) { toast(err.message, true); }
  });
}

// ================= Cliques =================
const EDITORES = {
  turma: (id) => formTurma(state.calc.m.turma[id]),
  prof: (id) => formProfessor(state.calc.m.prof[id]),
  disc: (id) => formDisciplina(state.calc.m.disc[id]),
  per: (id) => formPeriodo(state.calc.m.per[id]),
};
const EXCLUSOES = {
  turma: (id) => ['Excluir turma', `A turma <strong>${esc(state.calc.m.turma[id].nome)}</strong>, a distribuição e a grade dela serão apagadas.`, `/turmas/${id}`],
  prof: (id) => ['Excluir professor', `<strong>${esc(state.calc.m.prof[id].nome)}</strong> sai da distribuição e todas as aulas dele somem da grade.`, `/professores/${id}`],
  disc: (id) => ['Excluir disciplina', `<strong>${esc(state.calc.m.disc[id].nome)}</strong> sai de todas as turmas e da grade.`, `/disciplinas/${id}`],
  per: (id) => { const p = state.calc.m.per[id]; return ['Excluir horário', `O horário <strong>${p.turno}, ${p.inicio}–${p.fim}</strong> e as aulas marcadas nele serão apagados.`, `/periodos/${id}`]; },
  dist: (id) => { const d = state.calc.m.dist[id]; return ['Remover da turma', `<strong>${esc(state.calc.m.disc[d.disciplina_id].nome)}</strong> sai desta turma e as aulas dela somem da grade.`, `/distribuicao/${id}`]; },
};

$app.addEventListener('click', async (e) => {
  const el = e.target.closest('button, [data-aba]');
  if (!el) return;
  const ds = el.dataset;
  if (ds.aba) {
    state.aba = ds.aba; state.editandoIndisp = null;
    if (ds.cad) state.cad = ds.cad;
    storage.set('horario_aba', state.aba);
    render();
    window.scrollTo(0, 0);
    return;
  }
  if (ds.cad) { state.cad = ds.cad; return render(); }
  if (ds.irTurma) { state.turmaId = Number(ds.irTurma); storage.set('horario_turma', state.turmaId); state.aba = 'grade'; state.editandoIndisp = null; storage.set('horario_aba', 'grade'); render(); return window.scrollTo(0, 0); }
  if (ds.irProf) { state.profId = Number(ds.irProf); state.aba = 'professor'; storage.set('horario_aba', 'professor'); render(); return window.scrollTo(0, 0); }
  if (state.previa && (ds.cel || ds.indisp || ds.editar || ds.excluir || ds.resolver || ds.completar
    || ['limpar-grade', 'indisp-editar', 'editar-dist', 'nova-turma', 'novo-prof', 'nova-disc', 'novo-per', 'gerar'].includes(ds.acao))) {
    return toast('Esta é uma prévia. Aplique ou descarte antes de editar.', true);
  }
  if (ds.cel) { const [t, d, p] = ds.cel.split('|').map(Number); return escolherAula(t, d, p); }
  if (ds.resolver) {
    const av = state.calc.avisos[Number(ds.resolver)];
    return av.sobra ? abrirSobra(av.sobra) : abrirResolver(av.aulas);
  }
  if (ds.completar) {
    const opts = { escopo: new Set([Number(ds.completar)]), manter: true };
    state.turmaId = Number(ds.completar);
    toast('Montando o horário…');
    await new Promise((r) => setTimeout(r, 40));
    return entrarPrevia(Gerador.gerar(state.dados, { ...opts, semente: Date.now(), tempoMs: 1200 }), opts, state.dados.aulas);
  }
  if (ds.indisp) {
    const s = state.editandoIndisp;
    s.has(ds.indisp) ? s.delete(ds.indisp) : s.add(ds.indisp);
    return render();
  }
  if (ds.editar) return EDITORES[ds.editar](Number(ds.id));
  if (ds.excluir) {
    const [titulo, texto, rota] = EXCLUSOES[ds.excluir](Number(ds.id));
    if (await confirmar(titulo, texto)) await salvar(() => api(rota, { method: 'DELETE' }), 'Excluído').catch(() => {});
    return;
  }
  switch (ds.acao) {
    case 'sair':
      try { await api('/logout', { method: 'POST' }); } catch {}
      return sairLocal();
    case 'tema': {
      const novo = tema() === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = novo;
      storage.set('horario_tema', novo);
      return render();
    }
    case 'imprimir': return window.print();
    case 'gerar': return abrirGerador();
    case 'previa-descartar': sairPrevia(); return toast('Prévia descartada');
    case 'previa-outra': {
      const { opts, original } = state.previa;
      const D = { ...state.dados, aulas: original };
      toast('Gerando outra opção…');
      await new Promise((r) => setTimeout(r, 40));
      return entrarPrevia(Gerador.gerar(D, { ...opts, semente: Date.now() + Math.floor(Math.random() * 1e6) }), opts, original);
    }
    case 'previa-aplicar': {
      const lote = state.previa.lote;
      el.disabled = true;
      try {
        await api('/aulas/lote', { method: 'POST', body: lote });
        state.previa = null;
        await carregar();
        render();
        toast('Horário salvo');
      } catch (err) {
        el.disabled = false;
        toast(err.message, true);
      }
      return;
    }
    case 'nova-turma': return formTurma();
    case 'novo-prof': return formProfessor();
    case 'nova-disc': return formDisciplina();
    case 'novo-per': return formPeriodo();
    case 'editar-dist': return abrirDistribuicao(Number(ds.turma));
    case 'limpar-grade': {
      const t = state.calc.m.turma[state.turmaId];
      if (await confirmar('Limpar a grade', `Todas as aulas do <strong>${esc(t.nome)}</strong> saem da grade. A distribuição continua.`, 'Limpar')) {
        await salvar(() => api(`/turmas/${t.id}/aulas`, { method: 'DELETE' }), 'Grade limpa').catch(() => {});
      }
      return;
    }
    case 'indisp-editar':
      state.editandoIndisp = new Set(state.dados.indisponibilidades.filter((i) => i.professor_id === state.profId).map((i) => `${i.dia}|${i.periodo_id}`));
      return render();
    case 'indisp-cancelar': state.editandoIndisp = null; return render();
    case 'indisp-salvar': {
      const itens = [...state.editandoIndisp].map((k) => { const [dia, periodo_id] = k.split('|').map(Number); return { dia, periodo_id }; });
      const id = state.profId;
      state.editandoIndisp = null;
      return salvar(() => api(`/professores/${id}/indisponibilidades`, { method: 'PUT', body: { itens } }), 'Horários salvos').catch(() => {});
    }
    case 'nova-pessoa':
      return modal({
        titulo: 'Nova pessoa na equipe',
        corpo: `<div class="grade-form">
          <label class="campo">Nome<input name="nome" maxlength="80" required></label>
          <label class="campo">Login<input name="login" maxlength="80" placeholder="e-mail ou nome.sobrenome" required><small>Sem espaços. A senha é gerada automaticamente.</small></label>
          <label class="campo">Cargo<input name="cargo" maxlength="60" placeholder="Ex.: Coordenador do Fundamental II"></label></div>`,
        onSubmit: async (d) => {
          const r = await api('/usuarios', { method: 'POST', body: d });
          $modal.close();
          if (state.aba === 'equipe') render();
          mostrarSenha('Acesso criado', r);
          return false;
        },
      });
    case 'nova-senha':
      if (await confirmar('Gerar nova senha', `A senha atual de <strong>${esc(ds.nome)}</strong> deixa de funcionar.`, 'Gerar nova senha')) {
        try { mostrarSenha('Nova senha', await api(`/usuarios/${ds.id}/nova-senha`, { method: 'POST' })); } catch (err) { toast(err.message, true); }
      }
      return;
    case 'ativar':
      try {
        await api(`/usuarios/${ds.id}/arquivar`, { method: 'POST', body: { ativo: ds.ativo === '1' } });
        toast(ds.ativo === '1' ? 'Acesso reativado' : 'Acesso desativado');
        render();
      } catch (err) { toast(err.message, true); }
      return;
  }
});

// ================= Início =================
async function iniciar() {
  if (!state.token) return render();
  try {
    state.user = await api('/me');
    await carregar();
  } catch {
    state.user = null;
  }
  render();
}
iniciar();
