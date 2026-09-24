/**
 * CÂMARA DE COMÉRCIO DE SALVADOR - PÁGINA ASSOCIE-SE
 * Script Vanilla JS para manipulação de formulário, modais <dialog> e metadados
 * WDD 231 - Matheus Santana
 */

document.addEventListener('DOMContentLoaded', () => {
  inicializarMenuMobile();
  inicializarRodape();
  inicializarTimestamp();
  inicializarModais();
});

/* ==========================================================================
   1. MENU MOBILE RESPONSIVO
   ========================================================================== */
function inicializarMenuMobile() {
  const botaoHamburguer = document.getElementById('botao-menu-hamburguer');
  const menuNavegacao = document.getElementById('menu-navegacao');

  if (!botaoHamburguer || !menuNavegacao) return;

  botaoHamburguer.addEventListener('click', () => {
    const estaAberto = botaoHamburguer.classList.toggle('aberto');
    menuNavegacao.classList.toggle('ativo', estaAberto);
    botaoHamburguer.setAttribute('aria-expanded', String(estaAberto));
    botaoHamburguer.setAttribute(
      'aria-label',
      estaAberto ? 'Fechar Menu de Navegação' : 'Abrir Menu de Navegação'
    );
  });

  // Fechar menu ao pressionar a tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuNavegacao.classList.contains('ativo')) {
      botaoHamburguer.classList.remove('aberto');
      menuNavegacao.classList.remove('ativo');
      botaoHamburguer.setAttribute('aria-expanded', 'false');
      botaoHamburguer.focus();
    }
  });
}

/* ==========================================================================
   2. INFORMAÇÕES DINÂMICAS DO RODAPÉ (ANO E ÚLTIMA MODIFICAÇÃO)
   ========================================================================== */
function inicializarRodape() {
  const elementoAnoAtual = document.getElementById('anoAtual');
  const elementoModificacao = document.getElementById('ultimaModificacao');

  if (elementoAnoAtual) {
    elementoAnoAtual.textContent = new Date().getFullYear();
  }

  if (elementoModificacao) {
    elementoModificacao.textContent = `Última modificação: ${document.lastModified}`;
  }
}

/* ==========================================================================
   3. TIMESTAMP OCULTO NO FORMULÁRIO (DATA E HORA DO CARREGAMENTO)
   ========================================================================== */
function inicializarTimestamp() {
  const campoTimestamp = document.getElementById('timestamp');
  if (campoTimestamp) {
    // Grava timestamp atual no formato ISO 8601 (aceito por Date.parse)
    const agora = new Date();
    campoTimestamp.value = agora.toISOString();
  }
}

/* ==========================================================================
   4. CONTROLE DE MODAIS NATIVOS (<dialog>) DOS NÍVEIS DE ASSOCIAÇÃO
   ========================================================================== */
function inicializarModais() {
  const botoesAbrir = document.querySelectorAll('.btn-abrir-modal');
  const botoesFechar = document.querySelectorAll('.btn-fechar-modal, .btn-fechar-rodape');
  const modais = document.querySelectorAll('dialog.modal-beneficios');

  // Abrir o modal correspondente ao clicar no botão/link do cartão
  botoesAbrir.forEach((botao) => {
    botao.addEventListener('click', () => {
      const modalId = botao.getAttribute('data-modal');
      if (!modalId) return;

      const modalAlvo = document.getElementById(modalId);
      if (modalAlvo && typeof modalAlvo.showModal === 'function') {
        modalAlvo.showModal();
      }
    });
  });

  // Fechar o modal ao clicar no botão de fechar
  botoesFechar.forEach((botao) => {
    botao.addEventListener('click', () => {
      const modalAlvo = botao.closest('dialog');
      if (modalAlvo && typeof modalAlvo.close === 'function') {
        modalAlvo.close();
      }
    });
  });

  // Fechar modal ao clicar fora do conteúdo (no backdrop)
  modais.forEach((modal) => {
    modal.addEventListener('click', (evento) => {
      const retangulo = modal.getBoundingClientRect();
      const clicouDentro = (
        retangulo.top <= evento.clientY &&
        evento.clientY <= retangulo.top + retangulo.height &&
        retangulo.left <= evento.clientX &&
        evento.clientX <= retangulo.left + retangulo.width
      );

      if (!clicouDentro && typeof modal.close === 'function') {
        modal.close();
      }
    });
  });
}
