/**
 * APEX ENERGY - PÁGINA DE AGRADECIMENTO
 * Extrai e renderiza parâmetros enviados via URLSearchParams
 * ES Module | WDD 231 - Matheus Santana
 */
import { inicializarCabecalhoERodape } from './comum.js';

document.addEventListener('DOMContentLoaded', () => {
  inicializarCabecalhoERodape();
  exibirDadosEnviados();
});

function exibirDadosEnviados() {
  const listaContainer = document.getElementById('lista-dados-formulario');
  if (!listaContainer) return;

  const urlParams = new URLSearchParams(window.location.search);

  if (!urlParams.has('nome') && !urlParams.has('email')) {
    listaContainer.innerHTML = '<p style="color: var(--cor-texto-mutado);">Nenhum dado de formulário foi recebido diretamente. Acesse o formulário na página de Guia para realizar o envio.</p>';
    return;
  }

  const rotulosMapeados = {
    nome: 'Nome do Visitante',
    email: 'E-mail de Contato',
    perfil: 'Perfil do Usuário',
    peso: 'Peso Informado (kg)',
    consumo: 'Latas por Semana',
    assunto: 'Assunto Principal',
    mensagem: 'Mensagem / Dúvida',
    newsletter: 'Inscrição na Newsletter'
  };

  const itensHTML = [];
  urlParams.forEach((valor, chave) => {
    if (chave === 'timestamp') return;
    const rotulo = rotulosMapeados[chave] || chave;
    const valorFormatado = (chave === 'newsletter' && valor === 'on') ? 'Sim, desejo receber dicas e novidades' : valor;
    itensHTML.push(`
      <li>
        <span class="dado-rotulo">${rotulo}:</span>
        <span class="dado-valor">${sanitizarHTML(valorFormatado)}</span>
      </li>
    `);
  });

  listaContainer.innerHTML = itensHTML.join('');
}

function sanitizarHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}
