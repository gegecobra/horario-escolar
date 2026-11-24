// Cria (ou atualiza a senha de) um usuário no banco do .env.
// Uso: node demo/criar-usuario.mjs <login> <senha> "<nome>" "<cargo>"
import { db, hashPassword } from '../db.js';
const [login, senha, nome = login, cargo = 'Coordenação'] = process.argv.slice(2);
if (!login || !senha) { console.error('Uso: node demo/criar-usuario.mjs <login> <senha> "<nome>" "<cargo>"'); process.exit(1); }
const ja = await db.get('SELECT id FROM hor_usuarios WHERE lower(login) = lower(?)', login);
if (ja) {
  await db.run('UPDATE hor_usuarios SET senha_hash = ?, arquivado_em = NULL WHERE id = ?', hashPassword(senha), ja.id);
  console.log('Usuário já existia: senha atualizada.');
} else {
  await db.run('INSERT INTO hor_usuarios (nome, login, senha_hash, cargo) VALUES (?, ?, ?, ?)', nome, login.toLowerCase(), hashPassword(senha), cargo);
  console.log('Usuário criado.');
}
console.table(await db.all('SELECT id, nome, login, cargo, arquivado_em FROM hor_usuarios ORDER BY id'));
process.exit(0);
