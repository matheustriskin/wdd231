// Controle do Menu de Navegação Responsivo (Hambúrguer)
const botaoMenu = document.getElementById('botao-menu');
const navegacaoPrincipal = document.getElementById('navegacao-principal');

if (botaoMenu && navegacaoPrincipal) {
  botaoMenu.addEventListener('click', () => {
    navegacaoPrincipal.classList.toggle('aberto');
    const estaAberto = navegacaoPrincipal.classList.contains('aberto');
    botaoMenu.setAttribute('aria-expanded', estaAberto);
    botaoMenu.innerHTML = estaAberto ? '&times;' : '&#9776;';
  });
}
