// Cadastra um cliente (coordenador) no banco do .env, com uma escola própria e vazia.
// Uso: node demo/criar-usuario.mjs <login> <senha> "<nome>" "<nome da escola>"
// Se o login já existir, só troca a senha (e cria a escola, se o nome da escola for informado).
import { db, hashPassword, transacao } from '../db.js';

const [login, senha, nome = login, escola] = process.argv.slice(2);
if (!login || !senha) {
  console.error('Uso: node demo/criar-usuario.mjs <login> <senha> "<nome>" "<nome da escola>"');
  process.exit(1);
}
await transacao(async (q) => {
  let u = await q.get('SELECT id FROM hor_usuarios WHERE lower(login) = lower(?)', login);
  if (u) {
    await q.run('UPDATE hor_usuarios SET senha_hash = ?, arquivado_em = NULL WHERE id = ?', hashPassword(senha), u.id);
    console.log('Login já existia: senha atualizada.');
  } else {
    u = await q.get('INSERT INTO hor_usuarios (nome, login, senha_hash, cargo) VALUES (?, ?, ?, ?) RETURNING id',
      nome, login.toLowerCase(), hashPassword(senha), 'Coordenação');
    console.log('Login criado.');
  }
  const tem = await q.get('SELECT 1 FROM hor_usuario_escola WHERE usuario_id = ?', u.id);
  if (escola || !tem) {
    const e = await q.get('INSERT INTO hor_config (escola) VALUES (?) RETURNING id', escola || 'Minha escola');
    await q.run('INSERT INTO hor_usuario_escola (usuario_id, escola_id) VALUES (?, ?)', u.id, e.id);
    console.log(`Escola "${escola || 'Minha escola'}" criada (vazia) só para este login.`);
  }
});
console.table(await db.all(`SELECT u.id, u.login, string_agg(c.escola, ', ' ORDER BY c.id) AS escolas
  FROM hor_usuarios u LEFT JOIN hor_usuario_escola ue ON ue.usuario_id = u.id LEFT JOIN hor_config c ON c.id = ue.escola_id
  GROUP BY u.id ORDER BY u.id`));
process.exit(0);
