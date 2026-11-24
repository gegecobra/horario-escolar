// Cópia de segurança (só leitura) de todas as tabelas hor_* do banco do .env para backups/AAAA-MM-DD-HHMM.json
import fs from 'node:fs';
import { db } from '../db.js';
const tabelas = (await db.all(`SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'hor\_%' ORDER BY 1`)).map((t) => t.tablename);
const copia = { criado_em: new Date().toISOString(), tabelas: {} };
for (const t of tabelas) copia.tabelas[t] = await db.all(`SELECT * FROM ${t}`);
const nome = `backups/${new Date().toISOString().slice(0, 16).replace(/[T:]/g, '-')}.json`;
fs.writeFileSync(new URL('../' + nome, import.meta.url), JSON.stringify(copia, null, 1));
console.log(nome, Object.fromEntries(Object.entries(copia.tabelas).map(([t, l]) => [t, l.length])));
process.exit(0);
