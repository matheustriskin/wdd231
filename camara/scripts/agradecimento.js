/**
 * CÂMARA DE COMÉRCIO DE SALVADOR - PÁGINA DE AGRADECIMENTO / CONFIRMAÇÃO
 * Extração de parâmetros de consulta (GET) e exibição dinâmica de dados
 * WDD 231 - Matheus Santana
 */

document.addEventListener('DOMContentLoaded', () => {
  inicializarMenuMobile();
  inicializarRodape();
  exibirDadosEnviados();
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
   3. EXTRAÇÃO E EXIBIÇÃO DOS DADOS DO FORMULÁRIO (URLSearchParams)
   ========================================================================== */
function exibirDadosEnviados() {
  const parametros = new URLSearchParams(window.location.search);

  // Mapeamento dos parâmetros da URL
  const nome = parametros.get('nome') || 'Não informado';
  const sobrenome = parametros.get('sobrenome') || 'Não informado';
  const cargo = parametros.get('cargo') || 'Não informado';
  const email = parametros.get('email') || 'Não informado';
  const celular = parametros.get('celular') || 'Não informado';
  const organizacao = parametros.get('organizacao') || 'Não informado';
  const nivel = parametros.get('nivel-associacao') || 'Não especificado';
  const descricao = parametros.get('descricao') || '';
  const timestampBruto = parametros.get('timestamp');

  // Formatação amigável do nível de associação
  const nomesNiveis = {
    np: 'Associação NP (Sem Fins Lucrativos - Gratuita)',
    bronze: 'Associação Bronze',
    silver: 'Associação Prata',
    gold: 'Associação Ouro'
  };
  const nivelFormatado = nomesNiveis[nivel.toLowerCase()] || nivel;

  // Formatação do timestamp para data/hora brasileira
  let dataHoraFormatada = 'Data/Hora não registrada';
  if (timestampBruto) {
    const dataObj = new Date(timestampBruto);
    if (!Number.isNaN(dataObj.getTime())) {
      dataHoraFormatada = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'full',
        timeStyle: 'medium'
      }).format(dataObj);
    } else {
      dataHoraFormatada = timestampBruto;
    }
  }

  // Preenchimento dos elementos na página com proteção contra injeção de HTML
  const definirTexto = (id, valor) => {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = valor;
  };

  definirTexto('resumo-nome', `${nome} ${sobrenome}`.trim());
  definirTexto('resumo-primeiro-nome', nome);
  definirTexto('resumo-sobrenome', sobrenome);
  definirTexto('resumo-cargo', cargo);
  definirTexto('resumo-email', email);
  definirTexto('resumo-celular', celular);
  definirTexto('resumo-organizacao', organizacao);
  definirTexto('resumo-nivel', nivelFormatado);
  definirTexto('resumo-timestamp', dataHoraFormatada);

  const containerDescricao = document.getElementById('container-descricao');
  const elementoDescricao = document.getElementById('resumo-descricao');
  if (containerDescricao && elementoDescricao) {
    if (descricao && descricao.trim() !== '') {
      elementoDescricao.textContent = descricao;
      containerDescricao.style.display = 'flex';
    } else {
      containerDescricao.style.display = 'none';
    }
  }
}
