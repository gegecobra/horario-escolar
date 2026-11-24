// =====================================================================
// Servidor de mentira para a DEMONSTRAÇÃO (sem banco de dados).
// Responde às mesmas rotas /api do server.js, guardando tudo no navegador.
// Só é usado na página de demonstração; o sistema real usa server.js + PostgreSQL.
// =====================================================================
(() => {
  const CHAVE = 'horario_demo_db_v2';
  const TURNOS_P = ['Manhã', 'Tarde', 'Noite'];
  const TURNOS_T = [...TURNOS_P, 'Integral'];
  const HORA = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;

  function exemplo() {
    const d = { seq: {}, config: null, periodos: [], turmas: [], disciplinas: [], professores: [], indisponibilidades: [], distribuicao: [], aulas: [] };
    const novo = (tab, obj) => { d.seq[tab] = (d.seq[tab] || 0) + 1; const o = { id: d.seq[tab], ...obj }; d[tab].push(o); return o; };
    d.config = { escola: 'Escola Exemplo', rede: 'particular', dias: [1, 2, 3, 4, 5], duracao_aula: 50, max_disc_dia: 2, preferir_duplas: false };
    const manha = [['07:00', '07:50'], ['07:50', '08:40'], ['08:40', '09:30'], ['09:50', '10:40'], ['10:40', '11:30']].map(([i, f]) => novo('periodos', { turno: 'Manhã', inicio: i, fim: f }).id);
    [['13:00', '13:50'], ['13:50', '14:40'], ['14:40', '15:30'], ['15:50', '16:40'], ['16:40', '17:30']].forEach(([i, f]) => novo('periodos', { turno: 'Tarde', inicio: i, fim: f }));
    const T = {};
    for (const [n, t] of [['6º Ano A', 'Manhã'], ['7º Ano A', 'Manhã'], ['8º Ano A', 'Manhã'], ['9º Ano A', 'Manhã'], ['6º Ano B', 'Tarde'], ['7º Ano B', 'Tarde']]) T[n] = novo('turmas', { nome: n, turno: t }).id;
    const X = {};
    ['Português', 'Matemática', 'Ciências', 'História', 'Geografia', 'Inglês', 'Arte', 'Educação Física'].forEach((n, i) => { X[n] = novo('disciplinas', { nome: n, cor: i }).id; });
    const P = {};
    for (const [n, j, l, md] of [['Ana Ribeiro', 20, 16, null], ['Lucas Martins', 20, 16, null], ['Bruno Costa', 20, 16, null], ['Fernanda Alves', 20, 16, null],
      ['Carla Mendes', 30, 22, null], ['Rafael Souza', 20, 12, null], ['Davi Nunes', 30, 20, null], ['Paula Lima', 20, 14, null],
      ['Elisa Prado', 20, 14, null], ['Marcos Dias', 20, 14, 5]]) {
      P[n] = novo('professores', { nome: n, jornada_horas: j, limite_aulas: l, max_aulas_dia: md }).id;
    }
    // Elisa não pode na sexta nas duas últimas aulas da manhã
    d.indisponibilidades.push({ professor_id: P['Elisa Prado'], dia: 5, periodo_id: manha[3] }, { professor_id: P['Elisa Prado'], dia: 5, periodo_id: manha[4] });
    const quem = {
      'Português': (t) => (['6º Ano A', '7º Ano A', '8º Ano A'].includes(t) ? 'Ana Ribeiro' : 'Lucas Martins'),
      'Matemática': (t) => (['6º Ano A', '7º Ano A', '8º Ano A'].includes(t) ? 'Bruno Costa' : 'Fernanda Alves'),
      'Ciências': (t) => (t.endsWith('B') ? 'Rafael Souza' : 'Carla Mendes'),
      'Arte': (t) => (t.endsWith('B') ? 'Rafael Souza' : 'Carla Mendes'),
      'História': () => 'Davi Nunes',
      'Geografia': () => 'Paula Lima',
      'Inglês': () => 'Elisa Prado',
      'Educação Física': () => 'Marcos Dias',
    };
    const carga = { 'Português': 5, 'Matemática': 5, 'Ciências': 3, 'História': 3, 'Geografia': 2, 'Inglês': 2, 'Arte': 2, 'Educação Física': 2 };
    const D = {};
    for (const t of Object.keys(T)) {
      for (const [disc, n] of Object.entries(carga)) {
        D[`${t}|${disc}`] = novo('distribuicao', { turma_id: T[t], disciplina_id: X[disc], professor_id: P[quem[disc](t)], aulas_semana: n }).id;
      }
    }
    // Segunda-feira do 6º A já montada e um choque de propósito no 7º A (Ana nas duas turmas às 07:00)
    ['Português', 'Português', 'Matemática', 'Ciências', 'História'].forEach((disc, i) => {
      d.aulas.push({ turma_id: T['6º Ano A'], dia: 1, periodo_id: manha[i], distribuicao_id: D[`6º Ano A|${disc}`], fixa: false });
    });
    d.aulas.push({ turma_id: T['7º Ano A'], dia: 1, periodo_id: manha[0], distribuicao_id: D['7º Ano A|Português'], fixa: false });
    d.aulas.push({ turma_id: T['7º Ano A'], dia: 1, periodo_id: manha[1], distribuicao_id: D['7º Ano A|Matemática'], fixa: false });
    return d;
  }
  // Tudo da demonstração: logins e várias escolas (cada escola com os próprios dados)
  function inicial() {
    const um = exemplo();
    const dois = { seq: { periodos: um.periodos.length }, config: { ...um.config, escola: 'Colégio Modelo — Unidade 2' },
      periodos: um.periodos.map((p) => ({ ...p })), turmas: [], disciplinas: [], professores: [], indisponibilidades: [], distribuicao: [], aulas: [] };
    return { v: 2, seqEscola: 2, sessoes: {}, escolaDe: {},
      usuarios: [{ id: 1, nome: 'Coordenação Pedagógica', login: 'coordenacao@escola.com', senha: '123456', cargo: 'Coordenadora', escolas: [1, 2] }],
      escolas: { 1: um, 2: dois } };
  }

  let raiz = null;
  try { raiz = JSON.parse(localStorage.getItem(CHAVE)); } catch { raiz = null; }
  if (!raiz || raiz.v !== 2) raiz = inicial();
  let db = null; // a escola atual de cada pedido
  const gravar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(raiz)); } catch { /* sem armazenamento: só nesta aba */ } };
  window.__restaurarDemo = () => {
    try { localStorage.removeItem(CHAVE); localStorage.removeItem('horario_token'); localStorage.removeItem('horario_aba'); localStorage.removeItem('horario_turma'); localStorage.removeItem('horario_escola'); } catch { /* ignora */ }
    raiz = inicial();
    location.reload();
  };

  class Erro extends Error { constructor(s, m) { super(m); this.status = s; } }
  const falha = (s, m) => { throw new Erro(s, m); };
  const num = (v) => (Number.isInteger(Number(v)) && Number(v) > 0 ? Number(v) : 0);
  const texto = (v, max = 120) => String(v ?? '').trim().slice(0, max);
  const opcional = (v) => (v === '' || v === null || v === undefined ? null : Number(v));
  const diaOk = (d) => Number.isInteger(d) && d >= 1 && d <= 6;
  const novoId = (tab) => { db.seq[tab] = (db.seq[tab] || 0) + 1; return db.seq[tab]; };
  const achar = (tab, id) => db[tab].find((x) => x.id === id) || falha(404, 'Item não encontrado');
  const nomeUnico = (tab, nome, ignorar = 0) => {
    if (db[tab].some((x) => x.id !== ignorar && x.nome.toLowerCase() === nome.toLowerCase())) falha(409, 'Já existe um cadastro com esse nome.');
  };
  const turnoCabe = (turmaTurno, perTurno) => perTurno === turmaTurno || (turmaTurno === 'Integral' && (perTurno === 'Manhã' || perTurno === 'Tarde'));
  const ordemTurno = (t) => TURNOS_P.indexOf(t);

  // exclusões em cascata (como no banco real)
  function apagarDist(ids) {
    const s = new Set(ids);
    db.distribuicao = db.distribuicao.filter((d) => !s.has(d.id));
    db.aulas = db.aulas.filter((a) => !s.has(a.distribuicao_id));
  }

  function lerPeriodo(b) {
    const turno = texto(b.turno), inicio = texto(b.inicio), fim = texto(b.fim);
    if (!TURNOS_P.includes(turno)) falha(400, 'Escolha o turno');
    if (!HORA.test(inicio) || !HORA.test(fim)) falha(400, 'Use o formato de hora 07:00');
    if (fim <= inicio) falha(400, 'O fim precisa ser depois do início');
    return { turno, inicio, fim };
  }
  function lerProfessor(b) {
    const nome = texto(b.nome, 80), j = opcional(b.jornada_horas), l = opcional(b.limite_aulas), md = opcional(b.max_aulas_dia);
    if (!nome) falha(400, 'Informe o nome do professor');
    if (j !== null && !(j > 0 && j <= 60)) falha(400, 'A jornada deve ficar entre 1 e 60 horas por semana');
    if (l !== null && !(Number.isInteger(l) && l > 0 && l <= 80)) falha(400, 'O limite de aulas deve ser um número entre 1 e 80');
    if (md !== null && !(Number.isInteger(md) && md > 0 && md <= 20)) falha(400, 'O máximo de aulas por dia deve ser um número entre 1 e 20');
    return { nome, jornada_horas: j, limite_aulas: l, max_aulas_dia: md };
  }

  function rotear(metodo, caminho, b, token, pedida) {
    const r = (re) => caminho.match(re);
    if (metodo === 'POST' && caminho === '/login') {
      const login = texto(b.login).toLowerCase();
      const u = raiz.usuarios.find((x) => x.login.toLowerCase() === login);
      if (!u || u.senha !== String(b.senha ?? '')) falha(401, 'Usuário ou senha inválidos');
      const tk = Math.random().toString(36).slice(2) + Date.now().toString(36);
      raiz.sessoes[tk] = u.id;
      return { token: tk, usuario: { id: u.id, nome: u.nome, login: u.login } };
    }
    const eu = raiz.usuarios.find((x) => x.id === raiz.sessoes[token]);
    if (!eu) falha(401, 'Sessão expirada. Entre novamente.');
    // escola do pedido: a escolhida, se a pessoa tiver acesso; senão a mais antiga
    const E = eu.escolas.includes(pedida) ? pedida : Math.min(...eu.escolas);
    db = raiz.escolas[E];
    const escolas = eu.escolas.map((id) => ({ id, nome: raiz.escolas[id].config.escola }))
      .sort((a, b2) => a.nome.localeCompare(b2.nome) || a.id - b2.id);

    if (metodo === 'POST' && caminho === '/logout') { delete raiz.sessoes[token]; return { ok: true }; }
    if (metodo === 'POST' && caminho === '/escolas') {
      const nome = texto(b.nome);
      if (!nome) falha(400, 'Informe o nome da escola');
      const id = ++raiz.seqEscola;
      const copiar = b.copiar === true;
      raiz.escolas[id] = { seq: { periodos: copiar ? db.periodos.length : 0 },
        config: copiar ? { ...db.config, escola: nome } : { escola: nome, rede: 'particular', dias: [1, 2, 3, 4, 5], duracao_aula: 50, max_disc_dia: 2, preferir_duplas: false },
        periodos: copiar ? db.periodos.map((p, i) => ({ ...p, id: i + 1 })) : [], turmas: [], disciplinas: [], professores: [], indisponibilidades: [], distribuicao: [], aulas: [] };
      eu.escolas.push(id);
      return { id };
    }
    if (metodo === 'GET' && caminho === '/me') return { id: eu.id, nome: eu.nome, login: eu.login, cargo: eu.cargo };
    if (metodo === 'PUT' && caminho === '/me/senha') {
      if (String(b.atual) !== eu.senha) falha(400, 'A senha atual está incorreta');
      const nova = String(b.nova ?? '');
      if (nova.length < 6) falha(400, 'A nova senha precisa ter pelo menos 6 caracteres');
      if (nova === eu.senha) falha(400, 'A nova senha precisa ser diferente da atual');
      eu.senha = nova;
      return { ok: true };
    }
    if (metodo === 'GET' && caminho === '/dados') {
      const c = JSON.parse(JSON.stringify(db));
      return {
        escola_id: E, escolas,
        config: c.config,
        periodos: c.periodos.sort((a, b2) => ordemTurno(a.turno) - ordemTurno(b2.turno) || (a.inicio < b2.inicio ? -1 : 1)),
        turmas: c.turmas.sort((a, b2) => a.nome.localeCompare(b2.nome)),
        disciplinas: c.disciplinas.sort((a, b2) => a.nome.localeCompare(b2.nome)),
        professores: c.professores.sort((a, b2) => a.nome.localeCompare(b2.nome)),
        indisponibilidades: c.indisponibilidades, distribuicao: c.distribuicao, aulas: c.aulas,
      };
    }
    if (metodo === 'PUT' && caminho === '/config') {
      const escola = texto(b.escola), dias = [...new Set((b.dias || []).map(Number))].filter(diaOk).sort();
      const dur = Number(b.duracao_aula), md = b.max_disc_dia === undefined ? 2 : Number(b.max_disc_dia);
      if (!escola) falha(400, 'Informe o nome da escola');
      if (!dias.length) falha(400, 'Escolha pelo menos um dia de aula');
      if (!Number.isInteger(dur) || dur < 20 || dur > 120) falha(400, 'A duração da aula deve ficar entre 20 e 120 minutos');
      if (!Number.isInteger(md) || md < 1 || md > 10) falha(400, 'O máximo de aulas da mesma disciplina por dia deve ficar entre 1 e 10');
      db.config = { escola, rede: b.rede === 'publica' ? 'publica' : 'particular', dias, duracao_aula: dur, max_disc_dia: md, preferir_duplas: b.preferir_duplas === true };
      return { ok: true };
    }
    // ---- horários das aulas
    if (caminho === '/periodos' && metodo === 'POST') {
      const p = lerPeriodo(b);
      if (db.periodos.some((x) => x.turno === p.turno && x.inicio < p.fim && x.fim > p.inicio)) falha(400, 'Esse horário se sobrepõe a outra aula do mesmo turno');
      const id = novoId('periodos'); db.periodos.push({ id, ...p }); return { id };
    }
    let m = r(/^\/periodos\/(\d+)$/);
    if (m && metodo === 'PUT') {
      const x = achar('periodos', num(m[1])), p = lerPeriodo(b);
      if (db.periodos.some((y) => y.id !== x.id && y.turno === p.turno && y.inicio < p.fim && y.fim > p.inicio)) falha(400, 'Esse horário se sobrepõe a outra aula do mesmo turno');
      Object.assign(x, p); return { ok: true };
    }
    if (m && metodo === 'DELETE') {
      const id = achar('periodos', num(m[1])).id;
      db.periodos = db.periodos.filter((x) => x.id !== id);
      db.indisponibilidades = db.indisponibilidades.filter((x) => x.periodo_id !== id);
      db.aulas = db.aulas.filter((x) => x.periodo_id !== id);
      return { ok: true };
    }
    // ---- turmas
    if (caminho === '/turmas' && metodo === 'POST') {
      const nome = texto(b.nome, 60), turno = texto(b.turno);
      if (!nome) falha(400, 'Informe o nome da turma');
      if (!TURNOS_T.includes(turno)) falha(400, 'Escolha o turno');
      nomeUnico('turmas', nome);
      const id = novoId('turmas'); db.turmas.push({ id, nome, turno }); return { id };
    }
    m = r(/^\/turmas\/(\d+)\/aulas$/);
    if (m && metodo === 'DELETE') {
      const id = num(m[1]), antes = db.aulas.length;
      db.aulas = db.aulas.filter((a) => a.turma_id !== id || a.fixa);
      return { ok: true, apagadas: antes - db.aulas.length };
    }
    m = r(/^\/turmas\/(\d+)$/);
    if (m && metodo === 'PUT') {
      const x = achar('turmas', num(m[1])), nome = texto(b.nome, 60), turno = texto(b.turno);
      if (!nome) falha(400, 'Informe o nome da turma');
      if (!TURNOS_T.includes(turno)) falha(400, 'Escolha o turno');
      nomeUnico('turmas', nome, x.id);
      Object.assign(x, { nome, turno }); return { ok: true };
    }
    if (m && metodo === 'DELETE') {
      const id = achar('turmas', num(m[1])).id;
      db.turmas = db.turmas.filter((x) => x.id !== id);
      apagarDist(db.distribuicao.filter((d) => d.turma_id === id).map((d) => d.id));
      db.aulas = db.aulas.filter((a) => a.turma_id !== id);
      return { ok: true };
    }
    // ---- disciplinas
    if (caminho === '/disciplinas' && metodo === 'POST') {
      const nome = texto(b.nome, 60);
      if (!nome) falha(400, 'Informe o nome da disciplina');
      nomeUnico('disciplinas', nome);
      const id = novoId('disciplinas'); db.disciplinas.push({ id, nome, cor: db.disciplinas.length % 12 }); return { id };
    }
    m = r(/^\/disciplinas\/(\d+)$/);
    if (m && metodo === 'PUT') {
      const x = achar('disciplinas', num(m[1])), nome = texto(b.nome, 60);
      if (!nome) falha(400, 'Informe o nome da disciplina');
      nomeUnico('disciplinas', nome, x.id);
      x.nome = nome; return { ok: true };
    }
    if (m && metodo === 'DELETE') {
      const id = achar('disciplinas', num(m[1])).id;
      db.disciplinas = db.disciplinas.filter((x) => x.id !== id);
      apagarDist(db.distribuicao.filter((d) => d.disciplina_id === id).map((d) => d.id));
      return { ok: true };
    }
    // ---- professores
    if (caminho === '/professores' && metodo === 'POST') {
      const id = novoId('professores'); db.professores.push({ id, ...lerProfessor(b) }); return { id };
    }
    m = r(/^\/professores\/(\d+)\/indisponibilidades$/);
    if (m && metodo === 'PUT') {
      const id = achar('professores', num(m[1])).id;
      const ok = new Set(db.periodos.map((p) => p.id));
      const itens = (Array.isArray(b.itens) ? b.itens : []).map((i) => ({ professor_id: id, dia: Number(i?.dia), periodo_id: num(i?.periodo_id) }))
        .filter((i) => diaOk(i.dia) && i.periodo_id);
      if (itens.some((i) => !ok.has(i.periodo_id))) falha(400, 'Um dos itens escolhidos não existe mais. Atualize a página.');
      db.indisponibilidades = db.indisponibilidades.filter((i) => i.professor_id !== id).concat(itens);
      return { ok: true };
    }
    m = r(/^\/professores\/(\d+)$/);
    if (m && metodo === 'PUT') { Object.assign(achar('professores', num(m[1])), lerProfessor(b)); return { ok: true }; }
    if (m && metodo === 'DELETE') {
      const id = achar('professores', num(m[1])).id;
      db.professores = db.professores.filter((x) => x.id !== id);
      db.indisponibilidades = db.indisponibilidades.filter((x) => x.professor_id !== id);
      apagarDist(db.distribuicao.filter((d) => d.professor_id === id).map((d) => d.id));
      return { ok: true };
    }
    // ---- distribuição
    if (caminho === '/distribuicao' && metodo === 'POST') {
      const t = num(b.turma_id), x = num(b.disciplina_id), p = num(b.professor_id), n = Number(b.aulas_semana);
      if (!t || !x || !p) falha(400, 'Escolha a turma, a disciplina e o professor');
      if (!Number.isInteger(n) || n < 1 || n > 40) falha(400, 'Informe quantas aulas por semana (1 a 40)');
      achar('turmas', t); achar('disciplinas', x); achar('professores', p);
      if (db.distribuicao.some((d) => d.turma_id === t && d.disciplina_id === x)) falha(409, 'Essa disciplina já está na distribuição desta turma');
      const id = novoId('distribuicao'); db.distribuicao.push({ id, turma_id: t, disciplina_id: x, professor_id: p, aulas_semana: n }); return { id };
    }
    m = r(/^\/distribuicao\/(\d+)$/);
    if (m && metodo === 'PUT') {
      const d = achar('distribuicao', num(m[1])), p = num(b.professor_id), n = Number(b.aulas_semana);
      if (!p) falha(400, 'Escolha o professor');
      if (!Number.isInteger(n) || n < 1 || n > 40) falha(400, 'Informe quantas aulas por semana (1 a 40)');
      achar('professores', p);
      Object.assign(d, { professor_id: p, aulas_semana: n }); return { ok: true };
    }
    if (m && metodo === 'DELETE') { apagarDist([achar('distribuicao', num(m[1])).id]); return { ok: true }; }
    // ---- grade
    const validarCel = (a) => {
      const t = db.turmas.find((x) => x.id === num(a.turma_id)), p = db.periodos.find((x) => x.id === num(a.periodo_id)), dia = Number(a.dia);
      if (!t || !p || !diaOk(dia)) falha(400, 'Uma das aulas aponta para turma, horário ou dia que não existe mais. Atualize a página.');
      if (!turnoCabe(t.turno, p.turno)) falha(400, 'Esse horário não é do turno desta turma');
      const dist = a.distribuicao_id ? num(a.distribuicao_id) : null;
      if (dist !== null && !db.distribuicao.some((d) => d.id === dist && d.turma_id === t.id)) falha(400, 'Essa disciplina não está na distribuição desta turma');
      return { turma_id: t.id, dia, periodo_id: p.id, dist };
    };
    const celIdx = (c) => db.aulas.findIndex((a) => a.turma_id === c.turma_id && a.dia === c.dia && a.periodo_id === c.periodo_id);
    if (caminho === '/aulas' && metodo === 'PUT') {
      const c = validarCel(b), i = celIdx(c);
      if (c.dist === null) { if (i >= 0) db.aulas.splice(i, 1); return { ok: true }; }
      if (i >= 0) Object.assign(db.aulas[i], { distribuicao_id: c.dist, fixa: false });
      else db.aulas.push({ turma_id: c.turma_id, dia: c.dia, periodo_id: c.periodo_id, distribuicao_id: c.dist, fixa: false });
      return { ok: true };
    }
    if (caminho === '/aulas/fixar' && metodo === 'POST') {
      const i = celIdx({ turma_id: num(b.turma_id), dia: Number(b.dia), periodo_id: num(b.periodo_id) });
      if (i < 0) falha(404, 'Aula não encontrada');
      db.aulas[i].fixa = b.fixa === true; return { ok: true };
    }
    if (caminho === '/aulas/lote' && metodo === 'POST') {
      if (!Array.isArray(b.alteracoes) || b.alteracoes.length > 5000) falha(400, 'Lista de alterações inválida');
      const finais = new Map();
      for (const a of b.alteracoes) { const c = validarCel(a); finais.set(`${c.turma_id}|${c.dia}|${c.periodo_id}`, c); }
      // tudo validado: agora aplica (tudo ou nada)
      const limpar = new Set((b.limpar_turmas || []).map(num));
      if (limpar.size) db.aulas = db.aulas.filter((a) => !limpar.has(a.turma_id) || a.fixa || !db.config.dias.includes(a.dia));
      for (const c of finais.values()) {
        const i = celIdx(c);
        if (i >= 0 && db.aulas[i].fixa) continue;
        if (c.dist === null) { if (i >= 0) db.aulas.splice(i, 1); continue; }
        if (i >= 0) db.aulas[i].distribuicao_id = c.dist;
        else db.aulas.push({ turma_id: c.turma_id, dia: c.dia, periodo_id: c.periodo_id, distribuicao_id: c.dist, fixa: false });
      }
      return { ok: true, alteradas: finais.size };
    }
    falha(404, 'Rota não encontrada');
  }

  const fetchOriginal = window.fetch.bind(window);
  window.fetch = async (url, opts = {}) => {
    const u = String(url);
    if (!u.startsWith('/api')) return fetchOriginal(url, opts);
    const metodo = (opts.method || 'GET').toUpperCase();
    const token = String(opts.headers?.Authorization || '').replace(/^Bearer /, '');
    let corpo = {};
    try { corpo = opts.body ? JSON.parse(opts.body) : {}; } catch { corpo = {}; }
    const copia = JSON.stringify(raiz);
    const pedida = Number(opts.headers?.['X-Escola']) || 0;
    try {
      const r = rotear(metodo, u.slice(4), corpo, token, pedida);
      gravar();
      return new Response(JSON.stringify(r), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (e) {
      raiz = JSON.parse(copia); // tudo ou nada, como a transação do banco
      const status = e instanceof Erro ? e.status : 500;
      return new Response(JSON.stringify({ erro: e instanceof Erro ? e.message : 'Erro inesperado. Tente de novo.' }), { status, headers: { 'Content-Type': 'application/json' } });
    }
  };
})();
