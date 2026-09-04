// Lista de Cursos do Certificado de Programação de Computadores e Web
const cursos = [
  {
    assunto: 'CSE',
    numero: 110,
    titulo: 'Introduction to Programming',
    creditos: 2,
    certificado: 'Web and Computer Programming',
    descricao: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
    tecnologia: ['Python'],
    concluido: true
  },
  {
    assunto: 'WDD',
    numero: 130,
    titulo: 'Web Fundamentals',
    creditos: 2,
    certificado: 'Web and Computer Programming',
    descricao: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming.',
    tecnologia: ['HTML', 'CSS'],
    concluido: true
  },
  {
    assunto: 'CSE',
    numero: 111,
    titulo: 'Programming with Functions',
    creditos: 2,
    certificado: 'Web and Computer Programming',
    descricao: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call, debug, and test their own functions; and to handle errors within functions.',
    tecnologia: ['Python'],
    concluido: true
  },
  {
    assunto: 'CSE',
    numero: 210,
    titulo: 'Programming with Classes',
    creditos: 2,
    certificado: 'Web and Computer Programming',
    descricao: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
    tecnologia: ['C#'],
    concluido: false
  },
  {
    assunto: 'WDD',
    numero: 131,
    titulo: 'Dynamic Web Fundamentals',
    creditos: 2,
    certificado: 'Web and Computer Programming',
    descricao: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
    tecnologia: ['HTML', 'CSS', 'JavaScript'],
    concluido: true
  },
  {
    assunto: 'WDD',
    numero: 231,
    titulo: 'Frontend Web Development I',
    creditos: 2,
    certificado: 'Web and Computer Programming',
    descricao: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
    tecnologia: ['HTML', 'CSS', 'JavaScript'],
    concluido: false
  }
];

// Elementos da Página
const cursosContainer = document.getElementById('cursos-container');
const totalCreditosSpan = document.getElementById('valor-creditos');
const botaoTodos = document.getElementById('filtro-todos');
const botaoCSE = document.getElementById('filtro-cse');
const botaoWDD = document.getElementById('filtro-wdd');
const botoesFiltro = [botaoTodos, botaoCSE, botaoWDD];

// Função para renderizar os cursos na tela
function renderizarCursos(listaCursos) {
  if (!cursosContainer) return;
  
  cursosContainer.innerHTML = '';

  listaCursos.forEach(curso => {
    const cursoCard = document.createElement('div');
    const estaConcluido = curso.concluido || curso.completed;
    cursoCard.className = `curso-item ${estaConcluido ? 'curso-concluido' : 'curso-pendente'}`;
    cursoCard.textContent = `${estaConcluido ? '✓ ' : ''}${curso.assunto} ${curso.numero}`;
    cursoCard.title = `${curso.titulo} (${curso.creditos} créditos) - ${estaConcluido ? 'Concluído' : 'Pendente'}`;
    cursosContainer.appendChild(cursoCard);
  });

  // Calcular total de créditos dinamicamente com reduce()
  if (totalCreditosSpan) {
    const totalCreditos = listaCursos.reduce((acumulador, cursoAtual) => {
      return acumulador + cursoAtual.creditos;
    }, 0);
    totalCreditosSpan.textContent = totalCreditos;
  }
}

// Função para alternar o botão ativo
function atualizarBotaoAtivo(botaoSelecionado) {
  botoesFiltro.forEach(btn => {
    if (btn) btn.classList.remove('ativo');
  });
  if (botaoSelecionado) {
    botaoSelecionado.classList.add('ativo');
  }
}

// Configuração dos Event Listeners dos Filtros
if (botaoTodos) {
  botaoTodos.addEventListener('click', () => {
    atualizarBotaoAtivo(botaoTodos);
    renderizarCursos(cursos);
  });
}

if (botaoCSE) {
  botaoCSE.addEventListener('click', () => {
    atualizarBotaoAtivo(botaoCSE);
    const cursosCSE = cursos.filter(curso => curso.assunto === 'CSE');
    renderizarCursos(cursosCSE);
  });
}

if (botaoWDD) {
  botaoWDD.addEventListener('click', () => {
    atualizarBotaoAtivo(botaoWDD);
    const cursosWDD = cursos.filter(curso => curso.assunto === 'WDD');
    renderizarCursos(cursosWDD);
  });
}

// Renderização Inicial com Todos os Cursos
renderizarCursos(cursos);
