# Horário Escolar

Sistema para a **coordenação** montar o horário das turmas, com avisos na hora.
Separado do Beca, mas com a mesma tecnologia (Node 22 + Express 5 + PostgreSQL, telas em JavaScript puro).

## Como rodar

1. Crie o arquivo `.env` (modelo em `.env.example`) com a "connection string" do banco PostgreSQL (Supabase → Connect → Session pooler).
2. Rode:
   ```bash
   npm install
   npm start        # http://localhost:3000
   ```
Na primeira execução as tabelas (todas com prefixo `hor_`) são criadas sozinhas. Se o banco estiver vazio, entram dados de exemplo.
As tabelas ficam com RLS ligado e sem políticas: a API pública do Supabase não lê nada, só este servidor.

Acesso de teste: `coordenacao@escola.com`, senha `123456`. **Troque a senha (ou desative esse acesso) antes de usar de verdade.**

## Como funciona

1. **Cadastros**: horários das aulas por turno → turmas (Manhã, Tarde, Noite ou Integral) → disciplinas → professores (jornada, limite de aulas).
2. **Distribuição**: em cada turma, quem dá cada disciplina e quantas aulas por semana. Trocar o professor aqui troca em toda a grade.
3. **Grade das turmas**: clique num horário e escolha a disciplina. A lista já avisa se o professor está em outra turma naquele horário, se marcou que não pode ou se a disciplina já completou as aulas da semana. Dá para colocar mesmo assim; a aula fica marcada em vermelho.
4. **Por professor**: semana de cada professor e o botão "Marcar quando não pode".
5. **Avisos**: conflitos (professor em duas turmas ao mesmo tempo), aula em horário proibido, turma sem espaço, aula a mais, carga acima do limite e aulas que faltam colocar.
6. **Gerar automático** (botão na Grade): monta o horário sozinho seguindo as regras e mostra uma **prévia** antes de salvar.
   - Escolhe: todas as turmas ou só uma; "manter e completar" ou "refazer do zero" (aulas **fixadas** com o cadeado nunca mudam).
   - Regras obrigatórias: professor nunca em duas turmas ao mesmo tempo, respeita "não pode", máximo da mesma disciplina por dia, máximo de aulas por dia do professor.
   - Preferências: menos janelas e menos dias na escola para o professor; espalhar a disciplina na semana ou aulas duplas (Configurações).
   - Testa várias combinações por ~2 segundos e fica com a melhor. "Gerar outra opção" dá uma alternativa; "Aplicar e salvar" grava tudo de uma vez.
   - O que não couber aparece com o motivo em português simples.
   - O cálculo roda no navegador (`public/gerador.js`); o servidor só valida e grava (`POST /api/aulas/lote`, tudo ou nada).
7. **Resolver choques**: em cada aviso de choque (e na célula vermelha) o botão **Resolver** mostra opções prontas que não criam choque novo:
   mover para um horário vago, trocar com outra aula da turma, ou passar a disciplina para outro professor livre. Também lista os professores livres naquele horário.
   "Aula a mais" oferece qual aula tirar; "Falta colocar" tem **Completar com o gerador**.
8. **Impressão**: botão "Imprimir" (A4 deitado) na grade da turma e na do professor.
9. **Equipe**: logins da coordenação (senha gerada sozinha, nova senha, desativar).
10. **Configurações**: nome da escola, dias de aula, duração da aula e a regra de carga:
   - *Particular*: avisa quando passa do limite de aulas do professor.
   - *Pública*: também avisa quando as aulas passam de 2/3 da jornada (Lei 11.738/2008, Lei do Piso).
