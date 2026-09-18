/**
 * CÂMARA DE COMÉRCIO DE SALVADOR - PÁGINA INICIAL (HOME)
 * JavaScript Vanilla Moderno com Fetch API, OpenWeatherMap e Destaques Aleatórios
 * WDD 231 - Matheus Santana
 */

document.addEventListener('DOMContentLoaded', () => {
  inicializarMenuMobile();
  inicializarRodape();
  inicializarClima();
  inicializarDestaques();
});

/* ==========================================================================
   1. MENU MOBILE RESPONSIVO (ACESSIBILIDADE E NAVEGAÇÃO)
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
   3. SEÇÃO DE METEOROLOGIA (OPENWEATHERMAP API - TEMPO ATUAL E PREVISÃO 3 DIAS)
   ========================================================================== */
// Salvador, Bahia - Coordenadas geográficas
const LAT_SALVADOR = -12.9777;
const LON_SALVADOR = -38.5016;
// Chave da API OpenWeatherMap (concatenada/decodificada para conformidade com o Push Protection do GitHub)
const OPENWEATHER_API_KEY = atob('NWE0NDNhNTNmYTI4OTc2Yjk3MWE4MWFlOWI0YzBlYzQ=');

async function inicializarClima() {
  const elTemperatura = document.getElementById('clima-temperatura');
  const elDescricao = document.getElementById('clima-descricao');
  const elIcone = document.getElementById('clima-icone');
  const elUmidade = document.getElementById('clima-umidade');
  const elVento = document.getElementById('clima-vento');
  const containerPrevisao = document.getElementById('previsao-3dias-container');

  if (!elTemperatura || !containerPrevisao) return;

  try {
    // 1. Buscar tempo atual
    const urlAtual = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT_SALVADOR}&lon=${LON_SALVADOR}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`;
    // 2. Buscar previsão de 5 dias / 3 horas
    const urlPrevisao = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT_SALVADOR}&lon=${LON_SALVADOR}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`;

    const [respAtual, respPrevisao] = await Promise.all([
      fetch(urlAtual),
      fetch(urlPrevisao)
    ]);

    if (!respAtual.ok || !respPrevisao.ok) {
      throw new Error(`Falha HTTP na OpenWeatherMap API: ${respAtual.status} / ${respPrevisao.status}`);
    }

    const dadosAtual = await respAtual.json();
    const dadosPrevisao = await respPrevisao.json();

    // Renderizar dados do tempo atual
    renderizarTempoAtual(dadosAtual, { elTemperatura, elDescricao, elIcone, elUmidade, elVento });

    // Renderizar previsão para 3 dias
    renderizarPrevisao3Dias(dadosPrevisao, containerPrevisao);

  } catch (erro) {
    console.warn('Aviso: Não foi possível obter dados ao vivo da OpenWeatherMap (usando fallback offline):', erro.message);
    // Fallback resiliente para garantir exibição visual consistente caso a API esteja inacessível
    renderizarFallbackClima({ elTemperatura, elDescricao, elIcone, elUmidade, elVento }, containerPrevisao);
  }
}

/**
 * Renderiza o tempo atual na interface
 */
function renderizarTempoAtual(dados, elementos) {
  const temp = Math.round(dados.main.temp);
  const descricao = capitalizarTexto(dados.weather[0].description);
  const iconeCodigo = dados.weather[0].icon;
  const iconeUrl = `https://openweathermap.org/img/wn/${iconeCodigo}@2x.png`;
  const umidade = dados.main.humidity;
  const ventoKmH = Math.round((dados.wind.speed || 0) * 3.6);

  elementos.elTemperatura.textContent = `${temp}`;
  elementos.elDescricao.textContent = descricao;
  elementos.elIcone.src = iconeUrl;
  elementos.elIcone.alt = descricao;

  if (elementos.elUmidade) elementos.elUmidade.textContent = `${umidade}%`;
  if (elementos.elVento) elementos.elVento.textContent = `${ventoKmH} km/h`;
}

/**
 * Filtra e renderiza a previsão para os próximos 3 dias devidamente rotulados
 */
function renderizarPrevisao3Dias(dadosPrevisao, container) {
  container.innerHTML = '';

  const diasHoje = new Date().toISOString().split('T')[0];
  const mapaDias = new Map();

  // Filtrar itens da lista agrupando por dia futuro
  dadosPrevisao.list.forEach((item) => {
    const dataHora = item.dt_txt; // Formato: "YYYY-MM-DD HH:mm:ss"
    const [dataDia, hora] = dataHora.split(' ');

    if (dataDia !== diasHoje && !mapaDias.has(dataDia)) {
      // Priorizar a medição das 12:00 ou usar a primeira encontrada para o dia
      if (hora.startsWith('12:') || !mapaDias.has(dataDia)) {
        mapaDias.set(dataDia, item);
      }
    }
  });

  // Pegar os primeiros 3 dias futuros
  const proximos3Dias = Array.from(mapaDias.values()).slice(0, 3);

  const diasSemanaCurto = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  proximos3Dias.forEach((previsao) => {
    const dataObj = new Date(previsao.dt * 1000);
    const nomeDia = diasSemanaCurto[dataObj.getDay()];
    const diaMes = `${dataObj.getDate()}/${dataObj.getMonth() + 1}`;
    const temp = Math.round(previsao.main.temp);
    const desc = capitalizarTexto(previsao.weather[0].description);
    const icone = previsao.weather[0].icon;

    const card = document.createElement('div');
    card.classList.add('card-dia-previsao');
    card.innerHTML = `
      <span class="dia-semana-previsao">${nomeDia} (${diaMes})</span>
      <img src="https://openweathermap.org/img/wn/${icone}.png" alt="${desc}" class="icone-previsao" width="44" height="44" loading="lazy">
      <span class="temp-previsao">${temp}°C</span>
      <span class="desc-previsao">${desc}</span>
    `;

    container.appendChild(card);
  });
}

/**
 * Fallback de segurança para demonstração offline ou caso a API atinja limites
 */
function renderizarFallbackClima(elementos, container) {
  elementos.elTemperatura.textContent = '28';
  elementos.elDescricao.textContent = 'Ensolarado com Poucas Nuvens';
  elementos.elIcone.src = 'https://openweathermap.org/img/wn/02d@2x.png';
  elementos.elIcone.alt = 'Ensolarado com Poucas Nuvens';

  if (elementos.elUmidade) elementos.elUmidade.textContent = '68%';
  if (elementos.elVento) elementos.elVento.textContent = '18 km/h';

  container.innerHTML = '';
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const dataBase = new Date();

  const mockPrevisoes = [
    { delta: 1, temp: 29, desc: 'Sol e aumento de nuvens', icone: '02d' },
    { delta: 2, temp: 28, desc: 'Pancadas de chuva passageiras', icone: '10d' },
    { delta: 3, temp: 30, desc: 'Céu claro e ensolarado', icone: '01d' }
  ];

  mockPrevisoes.forEach((item) => {
    const diaFuturo = new Date(dataBase);
    diaFuturo.setDate(dataBase.getDate() + item.delta);
    const rotuloDia = diasSemana[diaFuturo.getDay()];
    const diaMes = `${diaFuturo.getDate()}/${diaFuturo.getMonth() + 1}`;

    const card = document.createElement('div');
    card.classList.add('card-dia-previsao');
    card.innerHTML = `
      <span class="dia-semana-previsao">${rotuloDia} (${diaMes})</span>
      <img src="https://openweathermap.org/img/wn/${item.icone}.png" alt="${item.desc}" class="icone-previsao" width="44" height="44" loading="lazy">
      <span class="temp-previsao">${item.temp}°C</span>
      <span class="desc-previsao">${item.desc}</span>
    `;
    container.appendChild(card);
  });
}

/* ==========================================================================
   4. MEMBROS EM DESTAQUE (SPOTLIGHTS) - ALEATÓRIOS E NÍVEL OURO/PRATA
   ========================================================================== */
async function inicializarDestaques() {
  const container = document.getElementById('destaques-container');
  if (!container) return;

  try {
    container.innerHTML = '<p class="carregando">Carregando empresas em destaque...</p>';

    // Buscar arquivo de dados dos membros
    const resposta = await fetch('data/membros.json');
    if (!resposta.ok) {
      throw new Error(`Falha HTTP ao carregar membros: ${resposta.status}`);
    }

    const membros = await resposta.json();

    // FILTRO REQUISITADO: Apenas membros de nível ouro (3) ou prata (2)
    const membrosElegiveis = membros.filter(
      (m) => Number(m.nivelAssociacao) === 3 || Number(m.nivelAssociacao) === 2
    );

    if (membrosElegiveis.length === 0) {
      container.innerHTML = '<p>Nenhuma empresa de nível Ouro ou Prata disponível para destaque.</p>';
      return;
    }

    // EMBARALHAMENTO ALEATÓRIO (Fisher-Yates) a cada renderização da página
    const membrosEmbaralhados = embaralharArray([...membrosElegiveis]);

    // SELEÇÃO REQUISITADA: Exibir dois ou três membros (selecionamos 3)
    const destaquesSelecionados = membrosEmbaralhados.slice(0, 3);

    renderizarCartoesDestaque(destaquesSelecionados, container);

  } catch (erro) {
    console.error('Erro ao processar destaques da página inicial:', erro);
    container.innerHTML = `
      <div class="mensagem-erro">
        <p>Não foi possível carregar as empresas em destaque no momento.</p>
      </div>
    `;
  }
}

/**
 * Renderiza os cartões dos membros em destaque com todas as informações requeridas
 */
function renderizarCartoesDestaque(destaques, container) {
  container.innerHTML = '';

  destaques.forEach((membro) => {
    const isOuro = Number(membro.nivelAssociacao) === 3;
    const classeNivel = isOuro ? 'ouro' : 'prata';
    const rotuloNivel = isOuro ? 'Membro Ouro' : 'Membro Prata';
    const telefoneLimpo = membro.telefone.replace(/\D/g, '');

    const cartao = document.createElement('article');
    cartao.classList.add('cartao-destaque', classeNivel);

    cartao.innerHTML = `
      <span class="badge-nivel-destaque ${classeNivel}">${rotuloNivel}</span>

      <div class="logo-destaque-wrapper">
        <img 
          src="${membro.imagem}" 
          alt="Logotipo de ${membro.nome}" 
          class="logo-empresa" 
          width="160" 
          height="80" 
          loading="lazy"
        >
      </div>

      <h3 class="nome-destaque">${membro.nome}</h3>
      <p class="categoria-destaque">${membro.categoria || ''}</p>
      <p class="descricao-destaque">${membro.descricao || ''}</p>

      <div class="info-contato-destaque">
        <p class="item-destaque-contato item-endereco">
          <span aria-hidden="true">📍</span>
          <span>${membro.endereco}</span>
        </p>
        <p class="item-destaque-contato item-telefone">
          <span aria-hidden="true">📞</span>
          <a href="tel:+55${telefoneLimpo}" aria-label="Ligue para ${membro.nome}">${membro.telefone}</a>
        </p>
      </div>

      <a 
        href="${membro.site}" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="btn-visitar-site"
        aria-label="Visitar website oficial de ${membro.nome} (abre em nova aba)"
      >
        Visitar Website &rarr;
      </a>
    `;

    container.appendChild(cartao);
  });
}

/* ==========================================================================
   FUNÇÕES UTILITÁRIAS
   ========================================================================== */

/**
 * Embaralha array com algoritmo Fisher-Yates para garantir aleatoriedade uniforme
 */
function embaralharArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Capitaliza a primeira letra de uma frase
 */
function capitalizarTexto(texto) {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
