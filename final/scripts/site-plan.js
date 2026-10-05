// ==========================================================================
// APEX ENERGY - SCRIPT DO DOCUMENTO DE PLANEJAMENTO DO SITE (SITE PLAN)
// WDD 231 - Matheus Santana
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Atualiza dinamicamente o ano corrente no rodap?
  const anoElemento = document.getElementById('anoAtual');
  if (anoElemento) {
    anoElemento.textContent = new Date().getFullYear();
  }

  // Atualiza dinamicamente a data da ?ltima modifica??o
  const modElemento = document.getElementById('ultimaModificacao');
  if (modElemento) {
    modElemento.textContent = `?ltima Modifica??o do Documento: ${document.lastModified}`;
  }
});
