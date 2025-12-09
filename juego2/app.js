// Variables globales
let isSpinning = false;
let currentRotation = 0;
let points = 0;
let correctCount = 0;
let incorrectCount = 0;
let totalQuestions = 0;
let currentQuestion = null;
let timerInterval = null;
let timeLeft = 15;
let wheelSections = [];

// Elementos del DOM
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const resultDisplay = document.getElementById('result-display');
const pointsDisplay = document.getElementById('points');
const correctCountDisplay = document.getElementById('correct-count');
const incorrectCountDisplay = document.getElementById('incorrect-count');
const totalCountDisplay = document.getElementById('total-count');
const questionModal = document.getElementById('question-modal');
const resultModal = document.getElementById('result-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const submitAnswerBtn = document.getElementById('submit-answer');
const nextQuestionBtn = document.getElementById('next-question');
const timerElement = document.getElementById('timer');
const timerProgress = document.getElementById('timer-progress');

// Definición de las secciones de la ruleta (todas preguntas)
const sectionDefinitions = [
    { type: 'question', text: 'Iluminación: Deslumbramiento', color: '#3498db', topic: 'Iluminación' },
    { type: 'question', text: 'Iluminación: Niveles de lux', color: '#2980b9', topic: 'Iluminación' },
    { type: 'question', text: 'Ventilación: Riesgos', color: '#1abc9c', topic: 'Ventilación' },
    { type: 'question', text: 'Iluminación: Natural vs Artificial', color: '#16a085', topic: 'Iluminación' },
    { type: 'question', text: 'Iluminación: Tipos', color: '#3498db', topic: 'Iluminación' },
    { type: 'question', text: 'Iluminación: Métodos', color: '#2980b9', topic: 'Iluminación' },
    { type: 'question', text: 'Ventilación: Sistemas', color: '#1abc9c', topic: 'Ventilación' },
    { type: 'question', text: 'Seguridad: Normas', color: '#9b59b6', topic: 'Seguridad' },
    { type: 'question', text: 'Iluminación: Medición', color: '#3498db', topic: 'Iluminación' },
    { type: 'question', text: 'Ventilación: Efectos salud', color: '#1abc9c', topic: 'Ventilación' },
    { type: 'question', text: 'Iluminación: Eficiencia energética', color: '#f39c12', topic: 'Iluminación' },
    { type: 'question', text: 'Seguridad: Equipos protección', color: '#9b59b6', topic: 'Seguridad' }
];

// Preguntas y respuestas sobre seguridad industrial
const questions = [
    {
        question: "¿Qué es deslumbramiento en el contexto de iluminación industrial?",
        options: [
            "Una condición visual que produce malestar o reduce la capacidad para ver detalles",
            "Un tipo de lámpara de alta intensidad",
            "La falta total de iluminación en un área",
            "El exceso de ventilación en un espacio cerrado"
        ],
        correct: 0,
        points: 10,
        explanation: "El deslumbramiento es una condición visual que causa incomodidad o reduce la capacidad de ver objetos debido a una distribución inadecuada de la luz.",
        topic: "Iluminación"
    },
    {
        question: "¿Cuántos lux se recomiendan para oficinas con tareas generales?",
        options: [
            "100-150 lux",
            "200-300 lux",
            "500-750 lux",
            "1000-1500 lux"
        ],
        correct: 2,
        points: 10,
        explanation: "Para oficinas con tareas generales, se recomienda entre 500 y 750 lux según las normativas de iluminación.",
        topic: "Iluminación"
    },
    {
        question: "¿Qué riesgos causa la mala ventilación en espacios industriales?",
        options: [
            "Acumulación de contaminantes y calor excesivo",
            "Mayor consumo de energía eléctrica",
            "Aumento de la iluminación natural",
            "Reducción del ruido ambiental"
        ],
        correct: 0,
        points: 10,
        explanation: "La mala ventilación puede causar acumulación de gases tóxicos, polvo, humedad y calor excesivo, afectando la salud de los trabajadores.",
        topic: "Ventilación"
    },
    {
        question: "¿Qué es la iluminación natural?",
        options: [
            "La luz proveniente del sol que ingresa a los espacios interiores",
            "Cualquier luz que no sea artificial",
            "Lámparas que simulan la luz del día",
            "Iluminación de emergencia"
        ],
        correct: 0,
        points: 10,
        explanation: "La iluminación natural es la que proviene directamente del sol y se aprovecha mediante ventanas, claraboyas y otros elementos arquitectónicos.",
        topic: "Iluminación"
    },
    {
        question: "¿Cuáles son los tipos de deslumbramiento?",
        options: [
            "Deslumbramiento discapacitante y deslumbramiento molesto",
            "Deslumbramiento interno y externo",
            "Deslumbramiento directo e indirecto",
            "Deslumbramiento natural y artificial"
        ],
        correct: 0,
        points: 10,
        explanation: "El deslumbramiento discapacitante impide ver correctamente, mientras que el molesto causa incomodidad sin necesariamente impedir la visión.",
        topic: "Iluminación"
    },
    {
        question: "¿Cuáles son los métodos de alumbrado más comunes?",
        options: [
            "Alumbrado general, localizado y combinado",
            "Alumbrado solar, lunar y artificial",
            "Alumbrado horizontal, vertical y diagonal",
            "Alumbrado estático, dinámico y mixto"
        ],
        correct: 0,
        points: 10,
        explanation: "El alumbrado general ilumina toda el área, el localizado enfoca zonas específicas, y el combinado usa ambos métodos.",
        topic: "Iluminación"
    },
    {
        question: "¿Qué sistema de ventilación extrae el aire viciado del interior?",
        options: [
            "Ventilación por extracción",
            "Ventilación por inyección",
            "Ventilación natural",
            "Ventilación mixta"
        ],
        correct: 0,
        points: 10,
        explanation: "La ventilación por extracción remueve el aire contaminado del interior, creando una presión negativa que atrae aire fresco.",
        topic: "Ventilación"
    },
    {
        question: "¿Qué norma regula las condiciones de iluminación en los lugares de trabajo?",
        options: [
            "NOM-025-STPS-2008",
            "NOM-001-STPS-2008",
            "NOM-017-STPS-2008",
            "NOM-030-STPS-2009"
        ],
        correct: 0,
        points: 15,
        explanation: "La NOM-025-STPS-2008 establece las condiciones de iluminación en los centros de trabajo para garantizar la seguridad y salud.",
        topic: "Normativas"
    },
    {
        question: "¿Qué instrumento se utiliza para medir los niveles de iluminación?",
        options: [
            "Luxómetro",
            "Termómetro",
            "Higrómetro",
            "Anemómetro"
        ],
        correct: 0,
        points: 10,
        explanation: "El luxómetro es el instrumento diseñado específicamente para medir la intensidad luminosa en lux.",
        topic: "Iluminación"
    },
    {
        question: "¿Qué efectos tiene una mala ventilación en la salud de los trabajadores?",
        options: [
            "Dolores de cabeza, fatiga y problemas respiratorios",
            "Mejora de la concentración y productividad",
            "Aumento de la agudeza visual",
            "Reducción del estrés laboral"
        ],
        correct: 0,
        points: 10,
        explanation: "La falta de ventilación adecuada puede causar síntomas como dolor de cabeza, fatiga, irritación ocular y problemas respiratorios.",
        topic: "Ventilación"
    },
    {
        question: "¿Cuál es una ventaja de la iluminación LED en entornos industriales?",
        options: [
            "Mayor eficiencia energética y mayor vida útil",
            "Menor costo inicial de instalación",
            "Mayor generación de calor",
            "Necesita más mantenimiento"
        ],
        correct: 0,
        points: 15,
        explanation: "Los LEDs consumen menos energía, tienen mayor duración y generan menos calor que otras tecnologías de iluminación.",
        topic: "Iluminación"
    },
    {
        question: "¿Qué equipo de protección personal se recomienda en áreas con riesgo de deslumbramiento?",
        options: [
            "Gafas de seguridad con protección UV",
            "Casco de seguridad",
            "Guantes anticorte",
            "Calzado de seguridad"
        ],
        correct: 0,
        points: 10,
        explanation: "Las gafas de seguridad con protección UV filtran la luz intensa y protegen contra el deslumbramiento en áreas con iluminación brillante.",
        topic: "Seguridad"
    }
];

// Inicialización
function init() {
    createWheel();
    setupEventListeners();
    updateStatsDisplay();
}

// Crear la ruleta
function createWheel() {
    wheel.innerHTML = '';
    const totalSections = sectionDefinitions.length;
    const anglePerSection = 360 / totalSections;
    
    sectionDefinitions.forEach((section, index) => {
        const sectionElement = document.createElement('div');
        sectionElement.className = 'wheel-section';
        sectionElement.dataset.index = index;
        sectionElement.dataset.type = section.type;
        sectionElement.dataset.topic = section.topic;
        sectionElement.style.backgroundColor = section.color;
        sectionElement.style.transform = `rotate(${index * anglePerSection}deg)`;
        
        const content = document.createElement('div');
        content.className = 'section-content';
        content.textContent = section.text;
        content.style.transform = `rotate(${anglePerSection/2}deg)`;
        
        sectionElement.appendChild(content);
        wheel.appendChild(sectionElement);
        
        // Guardar información de la sección
        wheelSections.push({
            element: sectionElement,
            ...section
        });
    });
}

// Configurar event listeners
function setupEventListeners() {
    spinBtn.addEventListener('click', spinWheel);
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            questionModal.style.display = 'none';
            resultModal.style.display = 'none';
        });
    });
    
    submitAnswerBtn.addEventListener('click', checkAnswer);
    nextQuestionBtn.addEventListener('click', () => {
        resultModal.style.display = 'none';
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === questionModal) {
            questionModal.style.display = 'none';
        }
        if (e.target === resultModal) {
            resultModal.style.display = 'none';
        }
    });
}

// Girar la ruleta
function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    spinBtn.disabled = true;
    
    // Generar un resultado aleatorio
    const totalSections = sectionDefinitions.length;
    const selectedSection = Math.floor(Math.random() * totalSections);
    const extraRotations = 5; // Rotaciones completas adicionales
    const anglePerSection = 360 / totalSections;
    
    // Calcular el ángulo final (apuntando a la sección seleccionada)
    const finalRotation = 360 * extraRotations + (360 - (selectedSection * anglePerSection)) + (anglePerSection / 2);
    
    // Aplicar la rotación
    currentRotation += finalRotation;
    wheel.style.transform = `rotate(${currentRotation}deg)`;
    
    // Mostrar resultado después de la animación
    setTimeout(() => {
        const selectedTopic = sectionDefinitions[selectedSection].topic;
        const selectedText = sectionDefinitions[selectedSection].text;
        
        // Mostrar resultado
        resultDisplay.innerHTML = `<p><strong>Tema:</strong> ${selectedTopic}<br><strong>Pregunta:</strong> ${selectedText}</p>`;
        
        // Mostrar pregunta
        showQuestion();
        
        isSpinning = false;
        spinBtn.disabled = false;
    }, 5000); // Duración de la animación
}

// Mostrar pregunta
function showQuestion() {
    // Seleccionar una pregunta aleatoria según el tema
    const topic = getRandomTopic();
    const filteredQuestions = questions.filter(q => q.topic === topic);
    
    if (filteredQuestions.length === 0) {
        // Si no hay preguntas de ese tema, seleccionar cualquiera
        const randomIndex = Math.floor(Math.random() * questions.length);
        currentQuestion = questions[randomIndex];
    } else {
        const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
        currentQuestion = filteredQuestions[randomIndex];
    }
    
    // Actualizar contador de preguntas totales
    totalQuestions++;
    
    // Actualizar modal
    document.getElementById('modal-title').textContent = `Pregunta sobre ${currentQuestion.topic}`;
    document.getElementById('question-text').textContent = currentQuestion.question;
    
    // Limpiar opciones anteriores
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    // Agregar opciones
    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
        optionElement.dataset.index = index;
        
        optionElement.addEventListener('click', () => {
            // Deseleccionar todas las opciones
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Seleccionar esta opción
            optionElement.classList.add('selected');
        });
        
        optionsContainer.appendChild(optionElement);
    });
    
    // Limpiar retroalimentación anterior
    document.getElementById('answer-feedback').textContent = '';
    document.getElementById('answer-feedback').style.color = '';
    
    // Reiniciar temporizador
    resetTimer();
    
    // Mostrar modal
    questionModal.style.display = 'flex';
}

// Obtener un tema aleatorio
function getRandomTopic() {
    const topics = ['Iluminación', 'Ventilación', 'Seguridad', 'Normativas'];
    const randomIndex = Math.floor(Math.random() * topics.length);
    return topics[randomIndex];
}

// Verificar respuesta
function checkAnswer() {
    const selectedOption = document.querySelector('.option.selected');
    
    if (!selectedOption) {
        document.getElementById('answer-feedback').textContent = 'Por favor, selecciona una opción.';
        document.getElementById('answer-feedback').style.color = 'var(--accent-color)';
        return;
    }
    
    const selectedIndex = parseInt(selectedOption.dataset.index);
    const isCorrect = selectedIndex === currentQuestion.correct;
    
    // Detener temporizador
    clearInterval(timerInterval);
    
    // Actualizar estadísticas
    if (isCorrect) {
        correctCount++;
        points += currentQuestion.points;
    } else {
        incorrectCount++;
    }
    
    // Actualizar displays
    updateStatsDisplay();
    updatePointsDisplay();
    
    // Mostrar resultado en el modal de resultado
    showResultModal(isCorrect, selectedIndex);
    
    // Cerrar modal de pregunta
    questionModal.style.display = 'none';
}

// Mostrar modal de resultado
function showResultModal(isCorrect, selectedIndex) {
    const resultTitle = document.getElementById('result-title');
    const resultIcon = document.getElementById('result-icon');
    const resultText = document.getElementById('result-text');
    const correctAnswer = document.getElementById('correct-answer');
    const pointsEarned = document.getElementById('points-earned');
    
    if (isCorrect) {
        resultTitle.textContent = '¡Respuesta Correcta!';
        resultIcon.innerHTML = '<i class="fas fa-check-circle" style="color: var(--success-color);"></i>';
        resultText.textContent = '¡Excelente! Has respondido correctamente.';
        correctAnswer.textContent = '';
        pointsEarned.textContent = `+${currentQuestion.points} puntos`;
        pointsEarned.style.color = 'var(--success-color)';
    } else {
        resultTitle.textContent = 'Respuesta Incorrecta';
        resultIcon.innerHTML = '<i class="fas fa-times-circle" style="color: var(--accent-color);"></i>';
        resultText.textContent = 'La respuesta seleccionada no es correcta.';
        correctAnswer.textContent = `Respuesta correcta: ${currentQuestion.options[currentQuestion.correct]}`;
        correctAnswer.style.color = 'var(--success-color)';
        pointsEarned.textContent = `+0 puntos`;
        pointsEarned.style.color = 'var(--accent-color)';
    }
    
    // Mostrar modal
    resultModal.style.display = 'flex';
}

// Reiniciar temporizador
function resetTimer() {
    timeLeft = 15;
    timerElement.textContent = timeLeft;
    timerProgress.style.width = '100%';
    
    // Limpiar intervalo anterior
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Configurar nuevo intervalo
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        timerProgress.style.width = `${(timeLeft / 15) * 100}%`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            
            // Tiempo agotado - respuesta incorrecta
            incorrectCount++;
            updateStatsDisplay();
            showResultModal(false, -1);
            questionModal.style.display = 'none';
        }
    }, 1000);
}

// Actualizar puntos en pantalla
function updatePointsDisplay() {
    pointsDisplay.textContent = points;
}

// Actualizar estadísticas
function updateStatsDisplay() {
    correctCountDisplay.textContent = correctCount;
    incorrectCountDisplay.textContent = incorrectCount;
    totalCountDisplay.textContent = totalQuestions;
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', init);