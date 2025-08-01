document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    // --- AÑADIDO: Selector para el botón del certificado ---
    const certificateButton = document.getElementById('certificate-button');


    // --- Funciones para el manejo de Cookies ---
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (JSON.stringify(value) || "")  + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) {
                const value = c.substring(nameEQ.length, c.length);
                try {
                    return JSON.parse(value);
                } catch (e) {
                    return value;
                }
            }
        }
        return null;
    }

    // Navigation Logic
    function navigateTo(targetId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        document.getElementById(targetId + '-content').classList.add('active');
        document.querySelector(`.nav-link[data-target="${targetId}"]`).classList.add('active');
        window.location.hash = targetId;
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.dataset.target;
            navigateTo(targetId);
        });
    });
    
    const initialTarget = window.location.hash.substring(1) || 'inicio';
    navigateTo(initialTarget);


    // Chart.js - Dashboard Progress Chart
    const ctx = document.getElementById('progressChart').getContext('2d');
    const progressChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completado', 'Pendiente'],
            datasets: [{
                data: [45, 55],
                backgroundColor: ['#80206eff', '#ff84eb44'],
                borderColor: '#FFFFFF',
                borderWidth: 4,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true, backgroundColor: '#0F172A' }
            }
        }
    });

    // Modules Data & Logic
    const initialModulesData = [
        { id: 1, title: 'Módulo 1: Fundamentos del Producto', progress: 0, status: 'No Iniciado' },
        { id: 2, title: 'Módulo 2: Características Principales', progress: 0, status: 'Bloqueado' },
        { id: 3, title: 'Módulo 3: Casos de Uso Avanzados', progress: 0, status: 'Bloqueado' },
        { id: 4, title: 'Módulo 4: Integraciones y API', progress: 0, status: 'Bloqueado' },
        { id: 5, title: 'Módulo 5: Soporte y Troubleshooting', progress: 0, status: 'Bloqueado' },
    ];
    let modulesData = getCookie('studentProgress') || JSON.parse(JSON.stringify(initialModulesData));

    // --- AÑADIDO: Funciones para la lógica del certificado ---
    function checkOverallCompletion() {
        return modulesData.every(module => module.status === 'Completado');
    }

    function updateCertificateState() {
        if (checkOverallCompletion()) {
            certificateButton.textContent = 'Ver Certificado';
            certificateButton.disabled = false;
            certificateButton.classList.remove('bg-slate-200', 'text-slate-500', 'cursor-not-allowed');
            certificateButton.classList.add('text-white', 'cursor-pointer');
            certificateButton.style.backgroundColor = '#3e003c';
        } else {
            certificateButton.textContent = 'Bloqueado';
            certificateButton.disabled = true;
            certificateButton.classList.add('bg-slate-200', 'text-slate-500', 'cursor-not-allowed');
            certificateButton.classList.remove('text-white', 'cursor-pointer');
            certificateButton.style.backgroundColor = '';
        }
    }

    function updateModuleProgress(moduleId, newProgress) {
        const module = modulesData.find(m => m.id === moduleId);
        if (module) {
            module.progress = newProgress;
            if (newProgress === 100) {
                module.status = 'Completado';
                const nextModuleId = moduleId + 1;
                const nextModule = modulesData.find(m => m.id === nextModuleId);

                if (nextModule && nextModule.status === 'Bloqueado') {
                    nextModule.status = 'No Iniciado';
                }
                
                // --- AÑADIDO: Comprobar el estado del certificado después de completar un módulo ---
                updateCertificateState();

            } else if (newProgress > 0) {
                module.status = 'En Progreso';
            } else {
                module.status = 'No Iniciado';
            }

            setCookie('studentProgress', modulesData, 30);
            renderModules();
        }
    }

    const moduleDetailStructure = [
        { step: 1, title: 'Introducción (Video)', icon: '▶️', desc: 'Un video corto de 2-3 minutos sobre los objetivos del módulo.' },
        { step: 2, title: 'Contenido Teórico', icon: '📖', desc: 'Lecciones de micro-learning con textos, imágenes e infografías.' },
        { step: 3, title: 'Demostración Práctica', icon: '🖥️', desc: 'Un experto muestra en tiempo real cómo usar la función.' },
        { step: 4, title: 'Actividad Práctica', icon: '✍️', desc: 'Usa el entorno de prueba ("sandbox") para practicar sin riesgos.' },
        { step: 5, title: 'Evaluación Corta', icon: '✅', desc: 'Un quiz rápido para reforzar lo aprendido.' },
    ];

    const modulesListContainer = document.getElementById('modules-list');
    const moduleDetailView = document.getElementById('module-detail-view');

    function renderModules() {
        modulesListContainer.innerHTML = '';
        modulesData.forEach(module => {
            const isLocked = module.status === 'Bloqueado';
            const cardHTML = `
                <div class="card ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}" data-module-id="${module.id}">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-lg font-semibold text-slate-800">${module.title}</h3>
                        <span class="text-xs font-bold py-1 px-2 rounded-full ${
                            module.status === 'Completado' ? 'bg-green-100 text-green-700' :
                            module.status === 'En Progreso' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                        }">${module.status}</span>
                    </div>
                    <div class="w-full bg-slate-200 rounded-full h-2">
                    <div class="h-2 rounded-full" style="width: ${module.progress}%; background-color: #3e003c;"></div>
                </div>
                </div>
            `;
            modulesListContainer.innerHTML += cardHTML;
        });
    }
    
    modulesListContainer.addEventListener('click', function(e) {
        const card = e.target.closest('.card');
        if (card && !card.classList.contains('cursor-not-allowed')) {
            const moduleId = parseInt(card.dataset.moduleId);
            const currentModule = modulesData.find(m => m.id === moduleId);
            if (currentModule && currentModule.progress < 100) {
                const newProgress = Math.min(currentModule.progress + 25, 100);
                updateModuleProgress(moduleId, newProgress);
            }
        }
    });

    renderModules();

    // Resources Data & Logic (sin cambios)
    const resourcesData = [ /* ... */ ];
    const resourcesList = document.getElementById('resources-list');
    const searchInput = document.getElementById('resource-search');
    function renderResources(filter = '') { /* ... */ }
    searchInput.addEventListener('input', function(e) { renderResources(e.target.value); });
    renderResources();

    // Botón para reiniciar el progreso (sin cambios)
    const resetButton = document.getElementById('reset-progress');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que quieres borrar todo tu progreso?')) {
                modulesData = JSON.parse(JSON.stringify(initialModulesData));
                setCookie('studentProgress', modulesData, 30);
                window.location.reload();
            }
        });
    }

    // --- AÑADIDO: Event Listener para el botón del certificado ---
    certificateButton.addEventListener('click', function() {
        if (this.disabled) return; // Si el botón está desactivado, no hacer nada

        const certificateHTML = `
<!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Certificado de Finalización</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Great+Vibes&display=swap" rel="stylesheet">
            <style>
                /* --- Keyframes para las animaciones --- */
                @keyframes gradient-animation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(218, 165, 32, 0.4); }
                    70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(218, 165, 32, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(218, 165, 32, 0); }
                }

                /* --- Estilos Generales --- */
                body {
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    color: #333;
                    background: linear-gradient(-45deg, #f0e8f0, #e8eaf6, #e1f5fe, #e0f2f1);
                    background-size: 400% 400%;
                    animation: gradient-animation 15s ease infinite;
                }

                /* --- Contenedor Principal del Certificado --- */
                .certificate-container {
                    width: 850px;
                    height: 600px;
                    background-color: #ffffff;
                    border-radius: 15px;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
                    padding: 50px 70px;
                    box-sizing: border-box;
                    position: relative;
                    overflow: hidden;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    animation: fadeIn 1s ease-out;
                }
                
                /* Elementos decorativos */
                .certificate-container::before {
                    content: '';
                    position: absolute;
                    top: -50px;
                    left: -50px;
                    width: 150px;
                    height: 150px;
                    background: #3e003c;
                    border-radius: 50%;
                    opacity: 0.07;
                }
                .certificate-container::after {
                    content: '';
                    position: absolute;
                    bottom: -80px;
                    right: -70px;
                    width: 250px;
                    height: 250px;
                    background: #daa520; /* Color dorado */
                    border-radius: 50%;
                    opacity: 0.08;
                }

                /* --- Contenido del Certificado --- */
                .content {
                    position: relative;
                    z-index: 2;
                }

                h1 {
                    font-family: 'Inter', sans-serif;
                    font-weight: 700;
                    font-size: 38px;
                    color: #3e003c;
                    margin: 0 0 10px 0;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    animation: fadeInUp 0.8s ease-out 0.2s backwards;
                }

                .subtitle {
                    font-size: 16px;
                    color: #555;
                    margin: 0 0 30px 0;
                    animation: fadeInUp 0.8s ease-out 0.4s backwards;
                }

                .student-name {
                    font-family: 'Great Vibes', cursive;
                    font-size: 64px;
                    color: #daa520; /* Dorado */
                    margin: 20px 0;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #eee;
                    line-height: 1.2;
                    animation: fadeInUp 0.8s ease-out 0.6s backwards;
                }
                
                .course-info {
                    font-size: 18px;
                    margin: 30px 0;
                    line-height: 1.6;
                    animation: fadeInUp 0.8s ease-out 0.8s backwards;
                }
                
                .course-info strong {
                    color: #3e003c;
                    font-weight: 600;
                }

                /* --- Sello de Calidad --- */
                .seal {
                    position: absolute;
                    bottom: 40px;
                    right: 60px;
                    width: 100px;
                    height: 100px;
                    background-color: #3e003c;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-size: 10px;
                    font-weight: bold;
                    text-transform: uppercase;
                    line-height: 1.2;
                    z-index: 3;
                    border: 4px solid #fff;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    animation: pulse 2s infinite 1s;
                }
                
                .seal span {
                    font-size: 32px;
                }

                /* --- Pie de página del Certificado --- */
                .footer {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 40px;
                    width: 100%;
                    animation: fadeInUp 0.8s ease-out 1s backwards;
                }

                .footer-item {
                    width: 40%;
                    text-align: center;
                }

                .footer-item .line {
                    border-bottom: 1px solid #999;
                    margin-bottom: 5px;
                }
                
                .footer-item .label {
                    font-size: 12px;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="certificate-container">
                <div class="seal">
                    <span>🎓</span>
                    Calidad Garantizada
                </div>
                <div class="content">
                    <h1>Certificado de Finalización</h1>
                    <p class="subtitle">Se otorga con orgullo este certificado a:</p>

                    <h2 class="student-name">Estudiante Ejemplar</h2>

                    <p class="course-info">
                        Por haber demostrado competencia y haber completado satisfactoriamente <br> todos los requisitos del curso de capacitación:
                        <br>
                        <strong>"Emprende Tu Carrera"</strong>
                    </p>

                    <div class="footer">
                        <div class="footer-item">
                            <div class="line"></div>
                            <div class="label">Fecha de Emisión</div>
                            <div class="value">${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                        <div class="footer-item">
                            <div class="line"></div>
                            <div class="label">Emitido por Aula Virtual</div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    const newWindow = window.open('', '_blank');
    newWindow.document.write(certificateHTML);
    newWindow.document.close();
});
    // --- AÑADIDO: Comprobar el estado del certificado al cargar la página ---
    updateCertificateState();
});