/**
 * APEX ENERGY - CATÁLOGO DINÂMICO DE PRODUTOS
 * Fetch API com async/await, try...catch, filter, sort, map, dialog e localStorage
 * ES Module | WDD 231 - Matheus Santana
 */
import {
  inicializarCabecalhoERodape,
  obterFavoritos,
  alternarFavorito,
  ehFavorito
} from './comum.js';

let todasBebidasCache = [];
let filtroCategoriaAtivo = 'todos';
let apenasFavoritosAtivo = false;
let termoBuscaAtivo = '';
let ordenacaoAtiva = 'padrao';
let modoVisualizacao = 'grade';

document.addEventListener('DOMContentLoaded', () => {
  inicializarCabecalhoERodape();
  inicializarCatalogo();
  inicializarModalDialog();
});

async function inicializarCatalogo() {
  const container = document.getElementById('produtos-container');
  if (!container) return;

  configurarControlesFiltro();
  configurarControlesOrdenacao();
  configurarBusca();
  configurarAlternanciaModo();

  try {
    container.innerHTML = '<p class="carregando">Carregando catálogo de bebidas...</p>';
    todasBebidasCache = await buscarDadosBebidas();
    aplicarFiltrosERenderizar();
  } catch (erro) {
    console.error('Erro ao carregar dados do catálogo:', erro);
    container.innerHTML = `
      <div class="mensagem-erro" >
        <p><strong>Não foi possível carregar o catálogo de bebidas no momento.</strong></p>
        <p class="mensagem-erro-sub">Verifique sua conexão ou tente novamente mais tarde.</p>
      </div>
    `;
  }
}

async function buscarDadosBebidas() {
  const resposta = await fetch('dados/bebidas.json');
  if (!resposta.ok) {
    throw new Error(`Falha HTTP ao buscar bebidas: status ${resposta.status}`);
  }
  return await resposta.json();
}

function configurarControlesFiltro() {
  const botoesCategoria = document.querySelectorAll('.btn-categoria');
  botoesCategoria.forEach((btn) => {
    btn.addEventListener('click', () => {
      botoesCategoria.forEach((b) => b.classList.remove('ativo'));
      btn.classList.add('ativo');
      filtroCategoriaAtivo = btn.dataset.categoria;
      aplicarFiltrosERenderizar();
    });
  });

  const btnFavFiltro = document.getElementById('btn-filtro-favoritos');
  if (btnFavFiltro) {
    btnFavFiltro.addEventListener('click', () => {
      apenasFavoritosAtivo = !apenasFavoritosAtivo;
      btnFavFiltro.classList.toggle('ativo', apenasFavoritosAtivo);
      aplicarFiltrosERenderizar();
    });
  }
}

function configurarControlesOrdenacao() {
  const select = document.getElementById('select-ordenacao');
  if (!select) return;

  select.addEventListener('change', (e) => {
    ordenacaoAtiva = e.target.value;
    aplicarFiltrosERenderizar();
  });
}

function configurarBusca() {
  const inputBusca = document.getElementById('campo-busca-bebidas');
  if (!inputBusca) return;

  inputBusca.addEventListener('input', (e) => {
    termoBuscaAtivo = e.target.value.trim().toLowerCase();
    aplicarFiltrosERenderizar();
  });
}

function configurarAlternanciaModo() {
  const btnGrade = document.getElementById('btn-vista-grade');
  const btnLista = document.getElementById('btn-vista-lista');
  const container = document.getElementById('produtos-container');

  if (!btnGrade || !btnLista || !container) return;

  btnGrade.addEventListener('click', () => {
    modoVisualizacao = 'grade';
    btnGrade.classList.add('ativo');
    btnLista.classList.remove('ativo');
    container.classList.remove('modo-lista');
  });

  btnLista.addEventListener('click', () => {
    modoVisualizacao = 'lista';
    btnLista.classList.add('ativo');
    btnGrade.classList.remove('ativo');
    container.classList.add('modo-lista');
  });
}

function aplicarFiltrosERenderizar() {
  const container = document.getElementById('produtos-container');
  const contadorEl = document.getElementById('contador-resultados');
  if (!container) return;

  let filtradas = todasBebidasCache.filter((b) => {
    if (filtroCategoriaAtivo !== 'todos' && b.categoria !== filtroCategoriaAtivo) {
      return false;
    }
    if (apenasFavoritosAtivo && !ehFavorito(b.id)) {
      return false;
    }
    if (termoBuscaAtivo) {
      const termo = termoBuscaAtivo;
      const matchNome = b.nome.toLowerCase().includes(termo);
      const matchMarca = b.marca.toLowerCase().includes(termo);
      const matchSabor = b.perfilSabor.toLowerCase().includes(termo);
      const matchIngr = b.ingredientesChave.some((i) => i.toLowerCase().includes(termo));
      if (!matchNome && !matchMarca && !matchSabor && !matchIngr) {
        return false;
      }
    }
    return true;
  });

  if (ordenacaoAtiva === 'cafeina-desc') {
    filtradas.sort((a, b) => b.cafeina - a.cafeina);
  } else if (ordenacaoAtiva === 'cafeina-asc') {
    filtradas.sort((a, b) => a.cafeina - b.cafeina);
  } else if (ordenacaoAtiva === 'nome-asc') {
    filtradas.sort((a, b) => a.nome.localeCompare(b.nome));
  } else if (ordenacaoAtiva === 'calorias-asc') {
    filtradas.sort((a, b) => a.calorias - b.calorias);
  }

  if (contadorEl) {
    contadorEl.textContent = `Exibindo ${filtradas.length} de ${todasBebidasCache.length} bebidas`;
  }

  if (filtradas.length === 0) {
    container.innerHTML = `
      <div class="sem-resultados">
        <p class="sem-resultados-titulo">Nenhuma bebida encontrada para os filtros selecionados.</p>
        <p class="mensagem-erro-sub">Tente limpar os termos da busca ou selecionar outra categoria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtradas.map((b) => criarCardBebidaHTML(b)).join('');
  vincularEventosCards(container);
}

function criarCardBebidaHTML(b) {
  const favoritado = ehFavorito(b.id);
  const classeBadge = obterClasseBadgeCategoria(b.categoria);

  return `
    <article class="card-produto" data-id="${b.id}">
      <button class="btn-favoritar-card ${favoritado ? 'favoritado' : ''}" 
              data-id="${b.id}" 
              aria-label="${favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}" 
              title="${favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
        ${favoritado ? '&#9733;' : '&#9734;'}
      </button>

      <div class="produto-topo">
        <img src="${b.imagem}" alt="Lata da bebida ${b.nome}" class="produto-imagem" width="120" height="195" loading="lazy">
        <span class="badge-categoria ${classeBadge}">${b.categoria}</span>
        <span class="produto-marca modal-marca">${b.marca}</span>
        <h3 class="produto-nome">${b.nome}</h3>
      </div>

      <div class="produto-propriedades">
        <div class="propriedade-item">
          <span class="prop-valor">${b.cafeina} mg</span>
          <span class="prop-rotulo">Cafeína</span>
        </div>
        <div class="propriedade-item">
          <span class="prop-valor">${b.volume}</span>
          <span class="prop-rotulo">Volume</span>
        </div>
        <div class="propriedade-item">
          <span class="prop-valor">${b.calorias} kcal</span>
          <span class="prop-rotulo">Calorias</span>
        </div>
      </div>

      <button class="btn btn-secundario btn-detalhes-modal" data-id="${b.id}">
        Ver Informações Nutricionais
      </button>
    </article>
  `;
}

function obterClasseBadgeCategoria(cat) {
  switch (cat) {
    case 'Zero Açúcar': return 'badge-zero';
    case 'Natural': return 'badge-natural';
    case 'Foco/Gamer': return 'badge-gamer';
    case 'Performance Esportiva': return 'badge-performance';
    default: return 'badge-tradicional';
  }
}

function vincularEventosCards(container) {
  const botoesFav = container.querySelectorAll('.btn-favoritar-card');
  botoesFav.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const agoraFavorito = alternarFavorito(id);
      btn.classList.toggle('favoritado', agoraFavorito);
      btn.innerHTML = agoraFavorito ? '&#9733;' : '&#9734;';
      btn.setAttribute('aria-label', agoraFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
      if (apenasFavoritosAtivo && !agoraFavorito) {
        aplicarFiltrosERenderizar();
      }
    });
  });

  const botoesModal = container.querySelectorAll('.btn-detalhes-modal');
  botoesModal.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const bebida = todasBebidasCache.find((b) => b.id === id);
      if (bebida) {
        abrirModalBebida(bebida);
      }
    });
  });
}

function inicializarModalDialog() {
  const modal = document.getElementById('modal-bebida');
  const btnFechar = document.getElementById('btn-fechar-modal');

  if (!modal || !btnFechar) return;

  btnFechar.addEventListener('click', () => {
    modal.close();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.close();
    }
  });
}

function abrirModalBebida(b) {
  const modal = document.getElementById('modal-bebida');
  const modalCorpo = document.getElementById('modal-detalhes-corpo');
  if (!modal || !modalCorpo) return;

  modalCorpo.innerHTML = `
    <div class="modal-cabecalho">
      <img src="${b.imagem}" alt="Lata ${b.nome}" class="modal-imagem" width="90" height="145">
      <div class="modal-titulos">
        <span class="badge-categoria ${obterClasseBadgeCategoria(b.categoria)}">${b.categoria}</span>
        <span class="produto-marca modal-marca" >${b.marca}</span>
        <h2>${b.nome}</h2>
        <p class="modal-categoria-texto">
          <strong>Sabor:</strong> ${b.perfilSabor}
        </p>
      </div>
    </div>

    <p class="modal-descricao">${b.descricao}</p>

    <h3 class="modal-tabela-titulo">Composição Nutricional</h3>
    <table class="modal-tabela-nutricional" aria-label="Tabela Nutricional de ${b.nome}">
      <tbody>
        <tr>
          <th scope="row">Conteúdo da Lata:</th>
          <td>${b.volume}</td>
        </tr>
        <tr>
          <th scope="row">Teor Total de Cafeína:</th>
          <td class="modal-td-cafeina">${b.cafeina} mg</td>
        </tr>
        <tr>
          <th scope="row">Taurina:</th>
          <td>${b.taurina}</td>
        </tr>
        <tr>
          <th scope="row">Valor Energético:</th>
          <td>${b.calorias} kcal</td>
        </tr>
        <tr>
          <th scope="row">Açúcares Adicionados:</th>
          <td>${b.acucar}</td>
        </tr>
      </tbody>
    </table>

    <div>
      <h4 class="modal-ingredientes-titulo">Ingredientes Chave e Bioativos:</h4>
      <ul class="modal-ingredientes-lista">
        ${b.ingredientesChave.map((ing) => `<li>${ing}</li>`).join('')}
      </ul>
    </div>
  `;

  modal.showModal();
}
