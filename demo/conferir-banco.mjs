// Cria as tabelas no banco do .env (se ainda não existirem) e mostra um resumo.
// Uso: node demo/conferir-banco.mjs
import { db, iniciarBanco } from '../db.js';

await iniciarBanco();
const tabelas = await db.all(`SELECT c.relname AS tabela, c.relrowsecurity AS protegida,
  (SELECT COUNT(*) FROM pg_policies p WHERE p.tablename = c.relname)::int AS politicas
  FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind = 'r' AND c.relname LIKE 'hor\\_%' ORDER BY 1`);
console.table(tabelas);
const r = await db.get(`SELECT (SELECT COUNT(*) FROM hor_usuarios)::int usuarios, (SELECT COUNT(*) FROM hor_turmas)::int turmas,
  (SELECT COUNT(*) FROM hor_professores)::int professores, (SELECT COUNT(*) FROM hor_aulas)::int aulas`);
console.log('Conteúdo:', r);
const outras = await db.all(`SELECT relname FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind = 'r' AND c.relname NOT LIKE 'hor\\_%'`);
console.log('Outras tabelas no banco:', outras.map((x) => x.relname).join(', ') || 'nenhuma');
process.exit(0);
