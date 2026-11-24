import express from 'express';
import crypto from 'node:crypto';
import path from 'node:path';
import { db, hashPassword, verifyPassword, transacao, iniciarBanco } from './db.js';

const app = express();
app.set('trust proxy', 1); // atrás do Render: req.ip é o IP real do visitante
app.use((req, res, next) => {
  res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'SAMEORIGIN', 'Referrer-Policy': 'same-origin' });
  next();
});
app.use(express.json({ limit: '200kb' }));
app.use(express.static(path.join(import.meta.dirname, 'public')));

const DIAS_SESSAO = 30;

// Limite de tentativas de login: 8 erros → espera 15 min
const tentativas = new Map();
const LIMITE_TENTATIVAS = 8;
const JANELA_MS = 15 * 60 * 1000;
const loginBloqueado = (k) => { const t = tentativas.get(k); return Boolean(t && t.ate > Date.now() && t.n >= LIMITE_TENTATIVAS); };
function registrarFalha(k) {
  const agora = Date.now();
  if (tentativas.size > 5000) for (const [c, t] of tentativas) if (t.ate < agora) tentativas.delete(c);
  const t = tentativas.get(k);
  if (!t || t.ate < agora) tentativas.set(k, { n: 1, ate: agora + JANELA_MS });
  else t.n++;
}

const erro = (res, status, msg) => res.status(status).json({ erro: msg });
const texto = (v, max = 120) => String(v ?? '').trim().slice(0, max);
const num = (v) => (Number.isInteger(Number(v)) && Number(v) > 0 && Number(v) < 2 ** 31 ? Number(v) : 0);
const opcional = (v) => (v === '' || v === null || v === undefined ? null : Number(v));
const TURNOS_PERIODO = ['Manhã', 'Tarde', 'Noite'];
const TURNOS_TURMA = [...TURNOS_PERIODO, 'Integral'];
const HORA = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
const diaValido = (d) => Number.isInteger(d) && d >= 1 && d <= 6;

// Erros de banco conhecidos viram mensagens simples
function erroBanco(res, e) {
  if (e.code === '23505') return erro(res, 409, 'Já existe um cadastro com esse nome.');
  if (e.code === '23514' || e.code === '22P02' || e.code === '22003') return erro(res, 400, 'Confira os valores preenchidos.');
  if (e.code === '23503') return erro(res, 400, 'Um dos itens escolhidos não existe mais. Atualize a página.');
  console.error(e);
  return erro(res, 500, 'Erro inesperado. Tente de novo.');
}
// Envolve as rotas para que qualquer erro do banco vire resposta, sem derrubar o servidor
const rota = (fn) => async (req, res, next) => { try { await fn(req, res, next); } catch (e) { erroBanco(res, e); } };

// ---------- Autenticação ----------
app.post('/api/login', rota(async (req, res) => {
  const login = texto(req.body?.login).toLowerCase();
  const senha = String(req.body?.senha ?? '');
  const chave = `${req.ip}|${login}`;
  if (loginBloqueado(chave)) return erro(res, 429, 'Muitas tentativas. Aguarde 15 minutos e tente de novo.');
  const u = login && await db.get('SELECT * FROM hor_usuarios WHERE lower(login) = ?', login);
  if (!u || !verifyPassword(senha, u.senha_hash)) {
    registrarFalha(chave);
    return erro(res, 401, 'Usuário ou senha inválidos');
  }
  tentativas.delete(chave);
  if (u.arquivado_em) return erro(res, 403, 'Acesso desativado. Fale com a coordenação.');
  await db.run(`DELETE FROM hor_sessoes WHERE criado_em < now() - interval '${DIAS_SESSAO} days'`);
  const token = crypto.randomBytes(32).toString('hex');
  await db.run('INSERT INTO hor_sessoes (token, usuario_id) VALUES (?, ?)', token, u.id);
  await db.run('UPDATE hor_usuarios SET ultimo_acesso = now() WHERE id = ?', u.id);
  res.json({ token, usuario: { id: u.id, nome: u.nome, login: u.login } });
}));

// Tudo abaixo exige login
app.use('/api', rota(async (req, res, next) => {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  const user = token && await db.get(
    `SELECT u.id, u.nome, u.login, u.cargo FROM hor_sessoes s JOIN hor_usuarios u ON u.id = s.usuario_id
     WHERE s.token = ? AND u.arquivado_em IS NULL AND s.criado_em > now() - interval '${DIAS_SESSAO} days'`, token);
  if (!user) return erro(res, 401, 'Sessão expirada. Entre novamente.');
  req.user = user;
  req.token = token;
  next();
}));

app.post('/api/logout', rota(async (req, res) => {
  await db.run('DELETE FROM hor_sessoes WHERE token = ?', req.token);
  res.json({ ok: true });
}));

app.get('/api/me', (req, res) => res.json(req.user));

app.put('/api/me/senha', rota(async (req, res) => {
  const atual = String(req.body?.atual ?? '');
  const nova = String(req.body?.nova ?? '');
  const u = await db.get('SELECT senha_hash FROM hor_usuarios WHERE id = ?', req.user.id);
  if (!verifyPassword(atual, u.senha_hash)) return erro(res, 400, 'A senha atual está incorreta');
  if (nova.length < 6) return erro(res, 400, 'A nova senha precisa ter pelo menos 6 caracteres');
  if (nova === atual) return erro(res, 400, 'A nova senha precisa ser diferente da atual');
  if (nova === '123456') return erro(res, 400, 'Escolha uma senha menos óbvia');
  await db.run('UPDATE hor_usuarios SET senha_hash = ? WHERE id = ?', hashPassword(nova), req.user.id);
  await db.run('DELETE FROM hor_sessoes WHERE usuario_id = ? AND token <> ?', req.user.id, req.token);
  res.json({ ok: true });
}));

// ---------- Tudo de uma vez (escolas pequenas: poucas centenas de linhas) ----------
app.get('/api/dados', rota(async (req, res) => {
  const [config, periodos, turmas, disciplinas, professores, indisponibilidades, distribuicao, aulas] = await Promise.all([
    db.get('SELECT escola, rede, dias, duracao_aula, max_disc_dia, preferir_duplas FROM hor_config WHERE id = 1'),
    db.all(`SELECT * FROM hor_periodos ORDER BY array_position(ARRAY['Manhã','Tarde','Noite'], turno), inicio`),
    db.all('SELECT * FROM hor_turmas ORDER BY nome'),
    db.all('SELECT * FROM hor_disciplinas ORDER BY nome'),
    db.all('SELECT id, nome, jornada_horas::float AS jornada_horas, limite_aulas, max_aulas_dia FROM hor_professores ORDER BY nome'),
    db.all('SELECT * FROM hor_indisponibilidades'),
    db.all('SELECT * FROM hor_distribuicao'),
    db.all('SELECT * FROM hor_aulas'),
  ]);
  res.set('Cache-Control', 'no-store').json({ config, periodos, turmas, disciplinas, professores, indisponibilidades, distribuicao, aulas });
}));

// ---------- Configurações ----------
app.put('/api/config', rota(async (req, res) => {
  const escola = texto(req.body?.escola, 120);
  const rede = req.body?.rede === 'publica' ? 'publica' : 'particular';
  const dias = [...new Set((Array.isArray(req.body?.dias) ? req.body.dias : []).map(Number))].filter(diaValido).sort();
  const duracao = Number(req.body?.duracao_aula);
  if (!escola) return erro(res, 400, 'Informe o nome da escola');
  if (!dias.length) return erro(res, 400, 'Escolha pelo menos um dia de aula');
  if (!Number.isInteger(duracao) || duracao < 20 || duracao > 120) return erro(res, 400, 'A duração da aula deve ficar entre 20 e 120 minutos');
  const maxDisc = req.body?.max_disc_dia === undefined ? 2 : Number(req.body.max_disc_dia);
  if (!Number.isInteger(maxDisc) || maxDisc < 1 || maxDisc > 10) return erro(res, 400, 'O máximo de aulas da mesma disciplina por dia deve ficar entre 1 e 10');
  const duplas = req.body?.preferir_duplas === true;
  await db.run('UPDATE hor_config SET escola = ?, rede = ?, dias = ?, duracao_aula = ?, max_disc_dia = ?, preferir_duplas = ? WHERE id = 1',
    escola, rede, dias, duracao, maxDisc, duplas);
  res.json({ ok: true });
}));

// ---------- Cadastros simples ----------
function lerPeriodo(b) {
  const turno = texto(b?.turno), inicio = texto(b?.inicio), fim = texto(b?.fim);
  if (!TURNOS_PERIODO.includes(turno)) return 'Escolha o turno';
  if (!HORA.test(inicio) || !HORA.test(fim)) return 'Use o formato de hora 07:00';
  if (fim <= inicio) return 'O fim precisa ser depois do início';
  return [turno, inicio, fim];
}
async function periodoSobreposto(turno, inicio, fim, ignorar = 0) {
  return db.get('SELECT 1 FROM hor_periodos WHERE turno = ? AND inicio < ? AND fim > ? AND id <> ?', turno, fim, inicio, ignorar);
}
app.post('/api/periodos', rota(async (req, res) => {
  const p = lerPeriodo(req.body);
  if (typeof p === 'string') return erro(res, 400, p);
  if (await periodoSobreposto(...p)) return erro(res, 400, 'Esse horário se sobrepõe a outra aula do mesmo turno');
  const r = await db.run('INSERT INTO hor_periodos (turno, inicio, fim) VALUES (?, ?, ?) RETURNING id', ...p);
  res.json({ id: r.id });
}));
app.put('/api/periodos/:id', rota(async (req, res) => {
  const id = num(req.params.id);
  const p = lerPeriodo(req.body);
  if (typeof p === 'string') return erro(res, 400, p);
  if (await periodoSobreposto(...p, id)) return erro(res, 400, 'Esse horário se sobrepõe a outra aula do mesmo turno');
  const r = await db.run('UPDATE hor_periodos SET turno = ?, inicio = ?, fim = ? WHERE id = ?', ...p, id);
  if (!r.changes) return erro(res, 404, 'Horário não encontrado');
  res.json({ ok: true });
}));

app.post('/api/turmas', rota(async (req, res) => {
  const nome = texto(req.body?.nome, 60), turno = texto(req.body?.turno);
  if (!nome) return erro(res, 400, 'Informe o nome da turma');
  if (!TURNOS_TURMA.includes(turno)) return erro(res, 400, 'Escolha o turno');
  const r = await db.run('INSERT INTO hor_turmas (nome, turno) VALUES (?, ?) RETURNING id', nome, turno);
  res.json({ id: r.id });
}));
app.put('/api/turmas/:id', rota(async (req, res) => {
  const nome = texto(req.body?.nome, 60), turno = texto(req.body?.turno);
  if (!nome) return erro(res, 400, 'Informe o nome da turma');
  if (!TURNOS_TURMA.includes(turno)) return erro(res, 400, 'Escolha o turno');
  const r = await db.run('UPDATE hor_turmas SET nome = ?, turno = ? WHERE id = ?', nome, turno, num(req.params.id));
  if (!r.changes) return erro(res, 404, 'Turma não encontrada');
  res.json({ ok: true });
}));

app.post('/api/disciplinas', rota(async (req, res) => {
  const nome = texto(req.body?.nome, 60);
  if (!nome) return erro(res, 400, 'Informe o nome da disciplina');
  const { n } = await db.get('SELECT COUNT(*)::int n FROM hor_disciplinas');
  const r = await db.run('INSERT INTO hor_disciplinas (nome, cor) VALUES (?, ?) RETURNING id', nome, n % 12);
  res.json({ id: r.id });
}));
app.put('/api/disciplinas/:id', rota(async (req, res) => {
  const nome = texto(req.body?.nome, 60);
  if (!nome) return erro(res, 400, 'Informe o nome da disciplina');
  const r = await db.run('UPDATE hor_disciplinas SET nome = ? WHERE id = ?', nome, num(req.params.id));
  if (!r.changes) return erro(res, 404, 'Disciplina não encontrada');
  res.json({ ok: true });
}));

function lerProfessor(b) {
  const nome = texto(b?.nome, 80);
  const jornada = opcional(b?.jornada_horas), limite = opcional(b?.limite_aulas), porDia = opcional(b?.max_aulas_dia);
  if (!nome) return 'Informe o nome do professor';
  if (jornada !== null && !(jornada > 0 && jornada <= 60)) return 'A jornada deve ficar entre 1 e 60 horas por semana';
  if (limite !== null && !(Number.isInteger(limite) && limite > 0 && limite <= 80)) return 'O limite de aulas deve ser um número entre 1 e 80';
  if (porDia !== null && !(Number.isInteger(porDia) && porDia > 0 && porDia <= 20)) return 'O máximo de aulas por dia deve ser um número entre 1 e 20';
  return [nome, jornada, limite, porDia];
}
app.post('/api/professores', rota(async (req, res) => {
  const p = lerProfessor(req.body);
  if (typeof p === 'string') return erro(res, 400, p);
  const r = await db.run('INSERT INTO hor_professores (nome, jornada_horas, limite_aulas, max_aulas_dia) VALUES (?, ?, ?, ?) RETURNING id', ...p);
  res.json({ id: r.id });
}));
app.put('/api/professores/:id', rota(async (req, res) => {
  const p = lerProfessor(req.body);
  if (typeof p === 'string') return erro(res, 400, p);
  const r = await db.run('UPDATE hor_professores SET nome = ?, jornada_horas = ?, limite_aulas = ?, max_aulas_dia = ? WHERE id = ?', ...p, num(req.params.id));
  if (!r.changes) return erro(res, 404, 'Professor não encontrado');
  res.json({ ok: true });
}));
// Substitui todos os horários em que o professor não pode
app.put('/api/professores/:id/indisponibilidades', rota(async (req, res) => {
  const id = num(req.params.id);
  const itens = Array.isArray(req.body?.itens) ? req.body.itens.slice(0, 500) : [];
  if (!await db.get('SELECT 1 FROM hor_professores WHERE id = ?', id)) return erro(res, 404, 'Professor não encontrado');
  await transacao(async (q) => {
    await q.run('DELETE FROM hor_indisponibilidades WHERE professor_id = ?', id);
    for (const it of itens) {
      const dia = Number(it?.dia), per = num(it?.periodo_id);
      if (!diaValido(dia) || !per) continue;
      await q.run('INSERT INTO hor_indisponibilidades (professor_id, dia, periodo_id) VALUES (?, ?, ?) ON CONFLICT DO NOTHING', id, dia, per);
    }
  });
  res.json({ ok: true });
}));

// Exclusões: apagam junto o que depende (aulas na grade etc.). O app pede confirmação antes.
for (const [rotaNome, tabela] of [['periodos', 'hor_periodos'], ['turmas', 'hor_turmas'], ['disciplinas', 'hor_disciplinas'], ['professores', 'hor_professores']]) {
  app.delete(`/api/${rotaNome}/:id`, rota(async (req, res) => {
    const r = await db.run(`DELETE FROM ${tabela} WHERE id = ?`, num(req.params.id));
    if (!r.changes) return erro(res, 404, 'Item não encontrado');
    res.json({ ok: true });
  }));
}

// ---------- Distribuição (quem dá o quê em cada turma) ----------
async function lerDistribuicao(b) {
  const turma = num(b?.turma_id), disc = num(b?.disciplina_id), prof = num(b?.professor_id), n = Number(b?.aulas_semana);
  if (!turma || !disc || !prof) return 'Escolha a turma, a disciplina e o professor';
  if (!Number.isInteger(n) || n < 1 || n > 40) return 'Informe quantas aulas por semana (1 a 40)';
  return [turma, disc, prof, n];
}
app.post('/api/distribuicao', rota(async (req, res) => {
  const d = await lerDistribuicao(req.body);
  if (typeof d === 'string') return erro(res, 400, d);
  try {
    const r = await db.run('INSERT INTO hor_distribuicao (turma_id, disciplina_id, professor_id, aulas_semana) VALUES (?, ?, ?, ?) RETURNING id', ...d);
    res.json({ id: r.id });
  } catch (e) {
    if (e.code === '23505') return erro(res, 409, 'Essa disciplina já está na distribuição desta turma');
    throw e;
  }
}));
app.put('/api/distribuicao/:id', rota(async (req, res) => {
  // a turma e a disciplina não mudam; só professor e quantidade
  const prof = num(req.body?.professor_id), n = Number(req.body?.aulas_semana);
  if (!prof) return erro(res, 400, 'Escolha o professor');
  if (!Number.isInteger(n) || n < 1 || n > 40) return erro(res, 400, 'Informe quantas aulas por semana (1 a 40)');
  const r = await db.run('UPDATE hor_distribuicao SET professor_id = ?, aulas_semana = ? WHERE id = ?', prof, n, num(req.params.id));
  if (!r.changes) return erro(res, 404, 'Item não encontrado');
  res.json({ ok: true });
}));
app.delete('/api/distribuicao/:id', rota(async (req, res) => {
  const r = await db.run('DELETE FROM hor_distribuicao WHERE id = ?', num(req.params.id));
  if (!r.changes) return erro(res, 404, 'Item não encontrado');
  res.json({ ok: true });
}));

// ---------- Grade ----------
// Horários válidos para a turma: os do turno dela (Integral = Manhã + Tarde)
const periodoDaTurma = (turmaId, periodoId) => db.get(
  `SELECT 1 FROM hor_turmas t JOIN hor_periodos p ON p.id = ?
   WHERE t.id = ? AND (p.turno = t.turno OR (t.turno = 'Integral' AND p.turno IN ('Manhã', 'Tarde')))`, periodoId, turmaId);

app.put('/api/aulas', rota(async (req, res) => {
  const turma = num(req.body?.turma_id), per = num(req.body?.periodo_id), dia = Number(req.body?.dia);
  const dist = req.body?.distribuicao_id ? num(req.body.distribuicao_id) : null;
  if (!turma || !per || !diaValido(dia)) return erro(res, 400, 'Célula da grade inválida');
  if (!await periodoDaTurma(turma, per)) return erro(res, 400, 'Esse horário não é do turno desta turma');
  if (dist === null) {
    await db.run('DELETE FROM hor_aulas WHERE turma_id = ? AND dia = ? AND periodo_id = ?', turma, dia, per);
    return res.json({ ok: true });
  }
  if (!await db.get('SELECT 1 FROM hor_distribuicao WHERE id = ? AND turma_id = ?', dist, turma)) {
    return erro(res, 400, 'Essa disciplina não está na distribuição desta turma');
  }
  await db.run(`INSERT INTO hor_aulas (turma_id, dia, periodo_id, distribuicao_id) VALUES (?, ?, ?, ?)
    ON CONFLICT (turma_id, dia, periodo_id) DO UPDATE SET distribuicao_id = EXCLUDED.distribuicao_id, fixa = false`, turma, dia, per, dist);
  res.json({ ok: true });
}));

// Trava/destrava uma aula (o gerador e as sugestões não mexem em aula fixa)
app.post('/api/aulas/fixar', rota(async (req, res) => {
  const turma = num(req.body?.turma_id), per = num(req.body?.periodo_id), dia = Number(req.body?.dia);
  const r = await db.run('UPDATE hor_aulas SET fixa = ? WHERE turma_id = ? AND dia = ? AND periodo_id = ?', req.body?.fixa === true, turma, dia, per);
  if (!r.changes) return erro(res, 404, 'Aula não encontrada');
  res.json({ ok: true });
}));
// Várias mudanças de uma vez, tudo ou nada (gerador automático e "Resolver").
// limpar_turmas: apaga antes as aulas NÃO fixas dessas turmas nos dias letivos.
// alteracoes: [{turma_id, dia, periodo_id, distribuicao_id}] (distribuicao_id vazio = deixar vago).
// Aulas fixas nunca são alteradas por aqui.
class ErroLote extends Error {}
app.post('/api/aulas/lote', rota(async (req, res) => {
  const lista = req.body?.alteracoes;
  if (!Array.isArray(lista) || lista.length > 5000) return erro(res, 400, 'Lista de alterações inválida');
  const limpar = Array.isArray(req.body?.limpar_turmas) ? [...new Set(req.body.limpar_turmas.map(num).filter(Boolean))] : [];
  try {
    const r = await transacao(async (q) => {
      const turmas = new Map((await q.all('SELECT id, turno FROM hor_turmas')).map((t) => [t.id, t.turno]));
      const pers = new Map((await q.all('SELECT id, turno FROM hor_periodos')).map((p) => [p.id, p.turno]));
      const dists = new Map((await q.all('SELECT id, turma_id FROM hor_distribuicao')).map((d) => [d.id, d.turma_id]));
      const { dias } = await q.get('SELECT dias FROM hor_config WHERE id = 1');
      // a última mudança de cada célula é a que vale
      const final = new Map();
      for (const a of lista) {
        const t = num(a?.turma_id), p = num(a?.periodo_id), dia = Number(a?.dia);
        const d = a?.distribuicao_id ? num(a.distribuicao_id) : null;
        const turno = turmas.get(t), pt = pers.get(p);
        if (!turno || !pt || !diaValido(dia)) throw new ErroLote('Uma das aulas aponta para turma, horário ou dia que não existe mais. Atualize a página.');
        if (!(pt === turno || (turno === 'Integral' && (pt === 'Manhã' || pt === 'Tarde')))) throw new ErroLote('Uma das aulas está fora do turno da turma.');
        if (d !== null && dists.get(d) !== t) throw new ErroLote('Uma das disciplinas não está mais na distribuição da turma. Atualize a página.');
        final.set(`${t}|${dia}|${p}`, [t, dia, p, d]);
      }
      if (limpar.length) await q.run('DELETE FROM hor_aulas WHERE turma_id = ANY(?::int[]) AND dia = ANY(?::int[]) AND NOT fixa', limpar, dias);
      const vagos = [...final.values()].filter((x) => x[3] === null);
      const cheios = [...final.values()].filter((x) => x[3] !== null);
      const col = (arr, i) => arr.map((x) => x[i]);
      if (vagos.length) {
        await q.run(`DELETE FROM hor_aulas a USING unnest(?::int[], ?::int[], ?::int[]) AS v(t, d, p)
          WHERE a.turma_id = v.t AND a.dia = v.d AND a.periodo_id = v.p AND NOT a.fixa`, col(vagos, 0), col(vagos, 1), col(vagos, 2));
      }
      if (cheios.length) {
        await q.run(`INSERT INTO hor_aulas (turma_id, dia, periodo_id, distribuicao_id)
          SELECT * FROM unnest(?::int[], ?::int[], ?::int[], ?::int[])
          ON CONFLICT (turma_id, dia, periodo_id) DO UPDATE SET distribuicao_id = EXCLUDED.distribuicao_id WHERE NOT hor_aulas.fixa`,
          col(cheios, 0), col(cheios, 1), col(cheios, 2), col(cheios, 3));
      }
      return final.size;
    });
    res.json({ ok: true, alteradas: r });
  } catch (e) {
    if (e instanceof ErroLote) return erro(res, 400, e.message);
    throw e;
  }
}));

// Limpa toda a grade de uma turma
app.delete('/api/turmas/:id/aulas', rota(async (req, res) => {
  const r = await db.run('DELETE FROM hor_aulas WHERE turma_id = ? AND NOT fixa', num(req.params.id));
  res.json({ ok: true, apagadas: r.changes });
}));

// ---------- Equipe da coordenação (logins) ----------
const gerarSenha = () => {
  const c = 'abcdefghjkmnpqrstuvwxyz23456789';
  return Array.from(crypto.randomBytes(8), (b) => c[b % c.length]).join('');
};
app.get('/api/usuarios', rota(async (req, res) => {
  res.json(await db.all('SELECT id, nome, login, cargo, ultimo_acesso, arquivado_em FROM hor_usuarios ORDER BY arquivado_em NULLS FIRST, nome'));
}));
app.post('/api/usuarios', rota(async (req, res) => {
  const nome = texto(req.body?.nome, 80), login = texto(req.body?.login, 80).toLowerCase(), cargo = texto(req.body?.cargo, 60) || null;
  if (!nome) return erro(res, 400, 'Informe o nome');
  if (!/^[a-z0-9._@-]{3,80}$/.test(login)) return erro(res, 400, 'O login deve ter pelo menos 3 letras ou números, sem espaços (pode ser o e-mail)');
  const senha = gerarSenha();
  try {
    await db.run('INSERT INTO hor_usuarios (nome, login, senha_hash, cargo) VALUES (?, ?, ?, ?)', nome, login, hashPassword(senha), cargo);
  } catch (e) {
    if (e.code === '23505') return erro(res, 409, 'Esse login já está em uso');
    throw e;
  }
  res.json({ login, senha });
}));
app.post('/api/usuarios/:id/nova-senha', rota(async (req, res) => {
  const id = num(req.params.id);
  const senha = gerarSenha();
  const u = await db.get('UPDATE hor_usuarios SET senha_hash = ? WHERE id = ? RETURNING login', hashPassword(senha), id);
  if (!u) return erro(res, 404, 'Pessoa não encontrada');
  await db.run('DELETE FROM hor_sessoes WHERE usuario_id = ?', id);
  res.json({ login: u.login, senha });
}));
app.post('/api/usuarios/:id/arquivar', rota(async (req, res) => {
  const id = num(req.params.id);
  if (id === req.user.id) return erro(res, 400, 'Você não pode desativar o próprio acesso');
  const ativo = req.body?.ativo === true;
  if (!ativo) {
    const { n } = await db.get('SELECT COUNT(*)::int n FROM hor_usuarios WHERE arquivado_em IS NULL AND id <> ?', id);
    if (n === 0) return erro(res, 400, 'Precisa ficar pelo menos uma pessoa com acesso');
  }
  const r = await db.run(`UPDATE hor_usuarios SET arquivado_em = ${ativo ? 'NULL' : 'now()'} WHERE id = ?`, id);
  if (!r.changes) return erro(res, 404, 'Pessoa não encontrada');
  if (!ativo) await db.run('DELETE FROM hor_sessoes WHERE usuario_id = ?', id);
  res.json({ ok: true });
}));

app.use('/api', (req, res) => erro(res, 404, 'Rota não encontrada'));

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
await iniciarBanco();
app.listen(PORT, HOST, () => console.log(`Horário Escolar rodando em http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`));
