/**
 * CÂMARA DE COMÉRCIO DE SALVADOR - PÁGINA SOBRE
 * Módulo JavaScript com type="module" | WDD 231 - Matheus Santana
 */

import { lugares } from '../data/lugares.mjs';

document.addEventListener('DOMContentLoaded', () => {
  inicializarMenuMobile();
  inicializarRodape();
  inicializarMensagemVisita();
  inicializarGaleriaInteresse();
  inicializarModalDetalhes();
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
   3. MENSAGEM DE VISITA COM LOCALSTORAGE
   ========================================================================== */
function inicializarMensagemVisita() {
  const containerMensagem = document.getElementById('mensagem-visita');
  const textoMensagem = document.getElementById('texto-visita');
  const botaoFechar = document.getElementById('fechar-mensagem-visita');

  if (!containerMensagem || !textoMensagem) return;

  const CHAVE_STORAGE = 'salvadorChamber_ultimaVisita';
  const ultimaVisitaArmazenada = localStorage.getItem(CHAVE_STORAGE);
  const agora = Date.now();
  const UM_DIA_MS = 1000 * 60 * 60 * 24;

  let mensagem = '';

  if (!ultimaVisitaArmazenada) {
    // Primeiro acesso
    mensagem = 'Boas-vindas! Entre em contato conosco caso tenha alguma dúvida.';
  } else {
    const timestampAnterior = Number(ultimaVisitaArmazenada);
    const diferencaMs = agora - timestampAnterior;

    if (diferencaMs < UM_DIA_MS) {
      // Menos de 1 dia
      mensagem = 'Já voltou? Que legal!';
    } else {
      // 1 ou mais dias
      const dias = Math.floor(diferencaMs / UM_DIA_MS);
      if (dias === 1) {
        mensagem = 'Seu último acesso foi há 1 dia.';
      } else {
        mensagem = `Seu último acesso foi há ${dias} dias.`;
      }
    }
  }

  // Atualiza o localStorage com o acesso atual
  localStorage.setItem(CHAVE_STORAGE, String(agora));

  // Renderiza a mensagem na interface
  textoMensagem.textContent = mensagem;
  containerMensagem.hidden = false;

  // Botão para fechar a mensagem
  if (botaoFechar) {
    botaoFechar.addEventListener('click', () => {
      containerMensagem.style.opacity = '0';
      containerMensagem.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        containerMensagem.hidden = true;
      }, 300);
    });
  }
}

/* ==========================================================================
   4. GALERIA DE INTERESSES (INTERATIVIDADE DOS 8 CARTÕES)
   ========================================================================== */
function inicializarGaleriaInteresse() {
  const containerGaleria = document.getElementById('galeria-interesses');
  if (!containerGaleria) return;

  // Se o container estiver vazio ou necessitar hidratação a partir dos dados do módulo .mjs:
  if (containerGaleria.children.length === 0) {
    containerGaleria.innerHTML = lugares.map((lugar) => `
      <article class="cartao-interesse" data-id="${lugar.id}">
        <h2>${lugar.nome}</h2>
        <figure>
          <img 
            src="${lugar.imagem}" 
            alt="${lugar.alt}" 
            width="${lugar.largura}" 
            height="${lugar.altura}" 
            loading="lazy"
          >
        </figure>
        <p>${lugar.descricao}</p>
        <address>${lugar.endereco}</address>
        <button type="button" class="btn-saiba-mais" data-id="${lugar.id}">Saiba mais</button>
      </article>
    `).join('');
  }

  // Adiciona ouvintes de evento aos botões "Saiba mais"
  const botoesSaibaMais = containerGaleria.querySelectorAll('.btn-saiba-mais');
  botoesSaibaMais.forEach((botao) => {
    botao.addEventListener('click', () => {
      const id = botao.getAttribute('data-id');
      const itemEncontrado = lugares.find((item) => item.id === id);
      if (itemEncontrado) {
        abrirModal(itemEncontrado);
      }
    });
  });
}

/* ==========================================================================
   5. MODAL DE DETALHES ACESSÍVEL (<dialog>)
   ========================================================================== */
let dialogElemento = null;

function inicializarModalDetalhes() {
  dialogElemento = document.getElementById('dialog-detalhes');
  if (!dialogElemento) return;

  const botaoFecharModal = document.getElementById('fechar-modal-detalhes');
  if (botaoFecharModal) {
    botaoFecharModal.addEventListener('click', () => {
      dialogElemento.close();
    });
  }

  const botaoAcaoFecharModal = document.getElementById('btn-acao-modal-fechar');
  if (botaoAcaoFecharModal) {
    botaoAcaoFecharModal.addEventListener('click', () => {
      dialogElemento.close();
    });
  }

  // Fechar ao clicar no backdrop (fora do diálogo)
  dialogElemento.addEventListener('click', (evento) => {
    const rect = dialogElemento.getBoundingClientRect();
    const clicouFora = (
      evento.clientX < rect.left ||
      evento.clientX > rect.right ||
      evento.clientY < rect.top ||
      evento.clientY > rect.bottom
    );
    if (clicouFora) {
      dialogElemento.close();
    }
  });
}

function abrirModal(item) {
  if (!dialogElemento) return;

  const tituloModal = document.getElementById('modal-titulo');
  const categoriaModal = document.getElementById('modal-categoria');
  const descricaoModal = document.getElementById('modal-descricao');
  const detalhesModal = document.getElementById('modal-detalhes');
  const horarioModal = document.getElementById('modal-horario');
  const enderecoModal = document.getElementById('modal-endereco');
  const imagemModal = document.getElementById('modal-imagem');

  if (tituloModal) tituloModal.textContent = item.nome;
  if (categoriaModal) categoriaModal.textContent = item.categoria;
  if (descricaoModal) descricaoModal.textContent = item.descricao;
  if (detalhesModal) detalhesModal.textContent = item.detalhes;
  if (horarioModal) horarioModal.textContent = item.horario;
  if (enderecoModal) enderecoModal.textContent = item.endereco;

  if (imagemModal) {
    imagemModal.src = item.imagem;
    imagemModal.alt = item.alt;
  }

  dialogElemento.showModal();
}
