/**
 * APEX ENERGY - GUIA CONSCIENTE & CONTATO
 * Calculadora interativa de cafeína, FAQ acordeão e validação em tempo real
 * ES Module | WDD 231 - Matheus Santana
 */
import { inicializarCabecalhoERodape } from './comum.js';

document.addEventListener('DOMContentLoaded', () => {
  inicializarCabecalhoERodape();
  inicializarCalculadoraCafeina();
  inicializarFaqAcordeon();
  inicializarValidacaoFormulario();
});

function inicializarCalculadoraCafeina() {
  const inputPeso = document.getElementById('calc-peso');
  const selectAtividade = document.getElementById('calc-atividade');
  const inputCafeConsumido = document.getElementById('calc-cafe-doses');
  const spanLimite = document.getElementById('calc-resultado-limite');
  const spanRestante = document.getElementById('calc-resultado-restante');
  const barraTermometro = document.getElementById('barra-termometro-preenchimento');
  const diagnosticoEl = document.getElementById('calc-diagnostico');

  if (!inputPeso || !spanLimite) return;

  function calcularLimite() {
    const peso = parseFloat(inputPeso.value) || 70;
    const dosesCafe = parseInt(inputCafeConsumido?.value || 0, 10);
    const fatorAtividade = parseFloat(selectAtividade?.value || 1.0);

    let limiteSeguro = Math.round(peso * 5.7 * fatorAtividade);
    if (limiteSeguro > 400) limiteSeguro = 400;
    if (limiteSeguro < 100) limiteSeguro = 100;

    const cafeinaJaIngerida = dosesCafe * 80;
    const restante = Math.max(0, limiteSeguro - cafeinaJaIngerida);

    spanLimite.textContent = `${limiteSeguro} mg`;
    if (spanRestante) {
      spanRestante.textContent = `${restante} mg`;
    }

    const porcentagemUso = Math.min(100, Math.round((cafeinaJaIngerida / limiteSeguro) * 100));
    if (barraTermometro) {
      barraTermometro.style.width = `${porcentagemUso}%`;
    }

    if (diagnosticoEl) {
      if (porcentagemUso >= 100) {
        diagnosticoEl.className = 'resultado-diagnostico diag-perigo';
        diagnosticoEl.innerHTML = '<strong>Atenção:</strong> Você atingiu ou excedeu a ingestão diária recomendada de cafeína. Evite energéticos pelo restante do dia e hidrate-se com água pura!';
      } else if (porcentagemUso >= 70) {
        diagnosticoEl.className = 'resultado-diagnostico diag-atencao';
        diagnosticoEl.innerHTML = `<strong>Zona de Atenção:</strong> Você já consumiu cerca de ${cafeinaJaIngerida} mg. Você ainda pode tomar com segurança até 1 lata leve (aprox. ${restante} mg de cafeína).`;
      } else {
        diagnosticoEl.className = 'resultado-diagnostico diag-seguro';
        diagnosticoEl.innerHTML = `<strong>Consumo Seguro:</strong> Sua ingestão atual é moderada. Você tem margem saudável para consumir até ${restante} mg de cafeína ao longo do dia.`;
      }
    }
  }

  inputPeso.addEventListener('input', calcularLimite);
  if (selectAtividade) selectAtividade.addEventListener('change', calcularLimite);
  if (inputCafeConsumido) inputCafeConsumido.addEventListener('input', calcularLimite);

  calcularLimite();
}

function inicializarFaqAcordeon() {
  const botoesFaq = document.querySelectorAll('.faq-pergunta-btn');
  botoesFaq.forEach((btn) => {
    btn.addEventListener('click', () => {
      const itemPai = btn.closest('.faq-item');
      const aberto = itemPai.classList.toggle('aberto');
      btn.setAttribute('aria-expanded', String(aberto));
    });
  });
}

function inicializarValidacaoFormulario() {
  const form = document.getElementById('form-contato-apex');
  if (!form) return;

  const campoNome = document.getElementById('campo-nome');
  const campoEmail = document.getElementById('campo-email');
  const campoPeso = document.getElementById('campo-peso-form');
  const campoMensagem = document.getElementById('campo-mensagem');

  function validarCampo(campo, regex, msgErro) {
    const grupo = campo.closest('.campo-grupo');
    const msgEl = grupo ? grupo.querySelector('.msg-erro-validacao') : null;
    const valido = regex.test(campo.value.trim());

    if (grupo) {
      grupo.classList.toggle('invalido', !valido);
      grupo.classList.toggle('valido', valido);
    }
    if (msgEl) {
      msgEl.textContent = valido ? '' : msgErro;
    }
    return valido;
  }

  if (campoNome) {
    campoNome.addEventListener('input', () => {
      validarCampo(campoNome, /^[a-zA-ZÀ-ÿ\s]{3,}$/, 'Digite um nome válido com pelo menos 3 caracteres.');
    });
  }

  if (campoEmail) {
    campoEmail.addEventListener('input', () => {
      validarCampo(campoEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Digite um endereço de e-mail válido.');
    });
  }

  if (campoPeso) {
    campoPeso.addEventListener('input', () => {
      const v = parseFloat(campoPeso.value);
      const valido = !isNaN(v) && v >= 35 && v <= 200;
      const grupo = campoPeso.closest('.campo-grupo');
      if (grupo) {
        grupo.classList.toggle('invalido', !valido);
        grupo.classList.toggle('valido', valido);
      }
    });
  }

  form.addEventListener('submit', (e) => {
    let formValido = true;

    if (campoNome && !validarCampo(campoNome, /^[a-zA-ZÀ-ÿ\s]{3,}$/, 'Por favor, preencha seu nome completo.')) {
      formValido = false;
    }

    if (campoEmail && !validarCampo(campoEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Por favor, informe um e-mail válido.')) {
      formValido = false;
    }

    if (campoMensagem && campoMensagem.value.trim().length < 5) {
      const grupo = campoMensagem.closest('.campo-grupo');
      if (grupo) {
        grupo.classList.add('invalido');
        const msgEl = grupo.querySelector('.msg-erro-validacao');
        if (msgEl) msgEl.textContent = 'A mensagem deve conter pelo menos 5 caracteres.';
      }
      formValido = false;
    }

    if (!formValido) {
      e.preventDefault();
      alert('Por favor, corrija os campos indicados antes de enviar o formulário.');
    }
  });
}
