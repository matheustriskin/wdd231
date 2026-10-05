/**
 * APEX ENERGY - MÓDULO JS COMUM (ES MODULE)
 * Funções compartilhadas entre todas as páginas
 * WDD 231 - Matheus Santana
 */

export function inicializarCabecalhoERodape() {
  inicializarMenuMobile();
  inicializarRodape();
  atualizarBadgeFavoritosGlobal();
}

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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuNavegacao.classList.contains('ativo')) {
      botaoHamburguer.classList.remove('aberto');
      menuNavegacao.classList.remove('ativo');
      botaoHamburguer.setAttribute('aria-expanded', 'false');
      botaoHamburguer.focus();
    }
  });
}

function inicializarRodape() {
  const anoAtualEl = document.getElementById('anoAtual');
  const modificacaoEl = document.getElementById('ultimaModificacao');

  if (anoAtualEl) {
    anoAtualEl.textContent = new Date().getFullYear();
  }

  if (modificacaoEl) {
    modificacaoEl.textContent = `Última modificação: ${document.lastModified}`;
  }
}

const STORAGE_KEY_FAVORITOS = 'apex_favoritos_v1';

export function obterFavoritos() {
  try {
    const salvos = localStorage.getItem(STORAGE_KEY_FAVORITOS);
    return salvos ? JSON.parse(salvos) : [];
  } catch (e) {
    console.error('Erro ao ler favoritos do localStorage:', e);
    return [];
  }
}

export function alternarFavorito(idBebida) {
  const favoritos = obterFavoritos();
  const index = favoritos.indexOf(idBebida);
  let agoraEhFavorito = false;

  if (index >= 0) {
    favoritos.splice(index, 1);
    agoraEhFavorito = false;
  } else {
    favoritos.push(idBebida);
    agoraEhFavorito = true;
  }

  try {
    localStorage.setItem(STORAGE_KEY_FAVORITOS, JSON.stringify(favoritos));
  } catch (e) {
    console.error('Erro ao salvar favoritos no localStorage:', e);
  }

  atualizarBadgeFavoritosGlobal();
  return agoraEhFavorito;
}

export function ehFavorito(idBebida) {
  const favoritos = obterFavoritos();
  return favoritos.includes(idBebida);
}

export function atualizarBadgeFavoritosGlobal() {
  const badges = document.querySelectorAll('.badge-favoritos-contador');
  const total = obterFavoritos().length;
  badges.forEach((b) => {
    b.textContent = total;
  });
}
