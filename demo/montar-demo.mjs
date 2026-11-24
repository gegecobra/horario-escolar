// Monta a página de demonstração (um arquivo só) a partir do código real em public/.
// Uso: node demo/montar-demo.mjs   → gera demo/horario-escolar-demo.html
import fs from 'node:fs';
import path from 'node:path';

const raiz = path.join(import.meta.dirname, '..');
const ler = (f) => fs.readFileSync(path.join(raiz, f), 'utf8');
const trocar = (s, a, b) => {
  if (!s.includes(a)) throw new Error('Trecho não encontrado: ' + a.slice(0, 60));
  return s.replace(a, b);
};

let css = ler('public/styles.css');
// Tema do sistema (claro/escuro) também vale quando a pessoa não escolheu no botão
const escuro = css.match(/:root\[data-theme="dark"\] \{([\s\S]*?)\n\}/)[1];
css += `
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {${escuro}
} }
/* Demonstração: a moldura não permite imprimir */
[data-acao="imprimir"] { display: none !important; }
.sidebar { top: env(safe-area-inset-top, 0px); }
.demo-nota { font-size: .82rem; color: var(--muted); background: var(--surface-2); border-radius: 12px; padding: 10px 12px; line-height: 1.45; }
.demo-nota button { margin-top: 6px; }
`;

let app = ler('public/app.js');
app = trocar(app, "function tema() { return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'; }",
  `function tema() {
  const t = document.documentElement.dataset.theme;
  if (t) return t === 'dark' ? 'dark' : 'light';
  try { return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; } catch { return 'light'; }
}`);
app = trocar(app, '<label class="campo">Usuário ou e-mail<input name="login" autocomplete="username" required></label>',
  '<label class="campo">Usuário ou e-mail<input id="login" name="login" autocomplete="username" value="coordenacao@escola.com" required></label>');
app = trocar(app, '<label class="campo">Senha<input name="senha" type="password" autocomplete="current-password" required></label>',
  '<label class="campo">Senha<input id="senha" name="senha" type="password" autocomplete="current-password" value="123456" required></label>');
app = trocar(app, `<button class="btn primario" type="submit">Entrar</button>`,
  `<button class="btn primario" type="submit">Entrar</button>
        <div class="demo-nota"><strong>Versão de demonstração.</strong> Login já preenchido (senha 123456). A escola é de exemplo e o que você mudar fica só neste navegador.
          <br><button type="button" class="link-btn" onclick="window.__restaurarDemo()">Recomeçar com o exemplo</button></div>`);
app = trocar(app, `<h2>Minha senha</h2>`,
  `<h2>Minha senha</h2>
      <div class="demo-nota">Demonstração: para voltar à escola de exemplo do começo, <button type="button" class="link-btn" onclick="window.__restaurarDemo()">recomece aqui</button>.</div>`);

const html = `<title>Horário Escolar</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
${css}
</style>
<script>
  try { var t = localStorage.getItem('horario_tema'); if (t) document.documentElement.dataset.theme = t; } catch (e) {}
</script>
<div id="app"></div>
<dialog id="modal"></dialog>
<div id="toast" role="status" aria-live="polite"></div>
<script>
${ler('demo/demo-api.js')}
</script>
<script>
${ler('public/gerador.js')}
</script>
<script>
${app}
</script>
`;
fs.writeFileSync(path.join(raiz, 'demo/horario-escolar-demo.html'), html);
console.log('demo/horario-escolar-demo.html', Math.round(html.length / 1024), 'KB');
