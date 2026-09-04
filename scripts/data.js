// Atualização Dinâmica do Ano de Copyright e Data de Última Modificação
const anoAtualElemento = document.getElementById("anoAtual");
if (anoAtualElemento) {
  anoAtualElemento.textContent = new Date().getFullYear();
}

const ultimaModificacaoElemento = document.getElementById("ultimaModificacao");
if (ultimaModificacaoElemento) {
  ultimaModificacaoElemento.innerHTML = `Última Modificação: ${document.lastModified}`;
}
