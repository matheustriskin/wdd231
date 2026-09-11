/**
 * CÂMARA DE COMÉRCIO DE SALVADOR - DIRETÓRIO DE MEMBROS
 * JavaScript Vanilla Moderno com async/await e fetch | WDD 231 - Matheus Santana
 */

document.addEventListener('DOMContentLoaded', () => {
  inicializarMenuMobile();
  inicializarRodape();
  inicializarDiretorio();
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

  // Fechar menu ao pressionar Escape
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
   3. DIRETÓRIO DE MEMBROS (FETCH, RENDERIZAÇÃO E ALTERNÂNCIA GRADE / LISTA)
   ========================================================================== */
let membrosCache = [];

async function inicializarDiretorio() {
  const container = document.getElementById('membros-container');
  const botaoGrade = document.getElementById('botao-grade');
  const botaoLista = document.getElementById('botao-lista');

  if (!container || !botaoGrade || !botaoLista) return;

  // Configurar alternância de modos de exibição
  configurarControlesExibicao(container, botaoGrade, botaoLista);

  // Carregar e exibir dados JSON
  try {
    container.innerHTML = '<p class="carregando">Carregando membros do diretório...</p>';
    const dados = await buscarMembros();
    membrosCache = dados;
    renderizarMembros(membrosCache, container);
  } catch (erro) {
    console.error('Erro ao carregar dados dos membros:', erro);
    container.innerHTML = `
      <div class="mensagem-erro">
        <p><strong>Não foi possível carregar a lista de empresas associadas no momento.</strong></p>
        <p>Por favor, tente recarregar a página mais tarde.</p>
      </div>
    `;
  }
}

/**
 * Busca a lista de membros no arquivo JSON local via fetch com async/await
 */
async function buscarMembros() {
  const resposta = await fetch('dados/membros.json');
  if (!resposta.ok) {
    throw new Error(`Falha HTTP ao buscar membros: status ${resposta.status}`);
  }
  return await resposta.json();
}

/**
 * Retorna texto e classe CSS associados ao nível de associação
 * (1 = Membro, 2 = Prata, 3 = Ouro)
 */
function obterDetalhesNivel(nivel) {
  switch (Number(nivel)) {
    case 3:
      return { rotulo: 'Membro Ouro', classe: 'ouro' };
    case 2:
      return { rotulo: 'Membro Prata', classe: 'prata' };
    case 1:
    default:
      return { rotulo: 'Membro Associado', classe: 'membro' };
  }
}

/**
 * Renderiza os cartões de membros dentro do contêiner HTML
 */
function renderizarMembros(membros, container) {
  container.innerHTML = '';

  if (!membros || membros.length === 0) {
    container.innerHTML = '<p>Nenhum membro encontrado.</p>';
    return;
  }

  membros.forEach((membro) => {
    const nivel = obterDetalhesNivel(membro.nivelAssociacao);

    const cartao = document.createElement('article');
    cartao.classList.add('cartao-membro', nivel.classe);

    // Formatar telefone limpo para link href tel:
    const telefoneHref = membro.telefone.replace(/\D/g, '');

    cartao.innerHTML = `
      <div class="logo-empresa-wrapper">
        <img 
          src="${membro.imagem}" 
          alt="Logotipo de ${membro.nome}" 
          class="logo-empresa" 
          width="160" 
          height="90" 
          loading="lazy"
        >
      </div>

      <div class="cabecalho-lista-item">
        <h2 class="nome-empresa">${membro.nome}</h2>
        <span class="badge-nivel ${nivel.classe}">${nivel.rotulo}</span>
      </div>

      <p class="categoria-empresa">${membro.categoria || ''}</p>
      <p class="descricao-empresa">${membro.descricao || ''}</p>

      <div class="detalhes-contato">
        <p class="item-contato item-endereco">
          <span class="icone-endereco" aria-hidden="true">📍</span>
          <span>${membro.endereco}</span>
        </p>
        <p class="item-contato item-telefone">
          <span class="icone-telefone" aria-hidden="true">📞</span>
          <a href="tel:+55${telefoneHref}">${membro.telefone}</a>
        </p>
        <p class="item-contato item-site">
          <a href="${membro.site}" target="_blank" rel="noopener noreferrer" class="link-site-btn" aria-label="Visitar website de ${membro.nome}">
            Visitar Website &rarr;
          </a>
        </p>
      </div>
    `;

    container.appendChild(cartao);
  });
}

/**
 * Configura os listeners dos botões de alternância e recupera preferência do localStorage
 */
function configurarControlesExibicao(container, botaoGrade, botaoLista) {
  function definirModo(modo) {
    if (modo === 'lista') {
      container.classList.remove('grade');
      container.classList.add('lista');
      botaoLista.classList.add('ativo');
      botaoLista.setAttribute('aria-pressed', 'true');
      botaoGrade.classList.remove('ativo');
      botaoGrade.setAttribute('aria-pressed', 'false');
      localStorage.setItem('diretorio-modo-exibicao', 'lista');
    } else {
      container.classList.remove('lista');
      container.classList.add('grade');
      botaoGrade.classList.add('ativo');
      botaoGrade.setAttribute('aria-pressed', 'true');
      botaoLista.classList.remove('ativo');
      botaoLista.setAttribute('aria-pressed', 'false');
      localStorage.setItem('diretorio-modo-exibicao', 'grade');
    }
  }

  botaoGrade.addEventListener('click', () => definirModo('grade'));
  botaoLista.addEventListener('click', () => definirModo('lista'));

  // Restaurar modo salvo pelo usuário no localStorage (ou padrão 'grade')
  const modoSalvo = localStorage.getItem('diretorio-modo-exibicao') || 'grade';
  definirModo(modoSalvo);
}
