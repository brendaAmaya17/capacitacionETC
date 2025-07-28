document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

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
                backgroundColor: [
                    '#0EA5E9', // sky-500
                    '#E2E8F0'  // slate-200
                ],
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
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: '#0F172A', // slate-900
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 12 },
                    padding: 10,
                    cornerRadius: 6,
                }
            }
        }
    });

    // Modules Data & Logic
    const modulesData = [
        { id: 1, title: 'Módulo 1: Fundamentos del Producto', progress: 100, status: 'Completado' },
        { id: 2, title: 'Módulo 2: Características Principales', progress: 75, status: 'En Progreso' },
        { id: 3, title: 'Módulo 3: Casos de Uso Avanzados', progress: 10, status: 'No Iniciado' },
        { id: 4, title: 'Módulo 4: Integraciones y API', progress: 0, status: 'Bloqueado' },
        { id: 5, title: 'Módulo 5: Soporte y Troubleshooting', progress: 0, status: 'Bloqueado' },
    ];

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
                        <div class="h-2 rounded-full ${
                            module.progress > 0 ? 'bg-sky-500' : ''
                        }" style="width: ${module.progress}%"></div>
                    </div>
                </div>
            `;
            modulesListContainer.innerHTML += cardHTML;
        });
    }

    function renderModuleDetail(moduleId) {
        const module = modulesData.find(m => m.id === moduleId);
        if (!module) return;

        let detailHTML = `<h3 class="text-2xl font-bold mb-6">Estructura de: ${module.title}</h3><ol class="relative border-l border-slate-200 ml-4">`;
        moduleDetailStructure.forEach(item => {
            detailHTML += `
                <li class="mb-10 ml-6">            
                    <span class="absolute flex items-center justify-center w-8 h-8 bg-sky-100 rounded-full -left-4 ring-4 ring-white">
                        ${item.icon}
                    </span>
                    <h4 class="flex items-center mb-1 text-lg font-semibold text-slate-900">${item.title}</h4>
                    <p class="block mb-2 text-sm font-normal leading-none text-slate-500">${item.desc}</p>
                </li>
            `;
        });
        detailHTML += `</ol>`;
        moduleDetailView.innerHTML = detailHTML;
        moduleDetailView.classList.remove('hidden');
    }
    
    modulesListContainer.addEventListener('click', function(e) {
        const card = e.target.closest('.card');
        if (card && !card.classList.contains('cursor-not-allowed')) {
            const moduleId = parseInt(card.dataset.moduleId);
            renderModuleDetail(moduleId);
        }
    });

    renderModules();

    // Resources Data & Logic
    const resourcesData = [
        { title: 'Manual completo del producto (v2.3)', category: 'Manual', icon: '📘' },
        { title: 'FAQs: Preguntas sobre facturación', category: 'FAQs', icon: '❓' },
        { title: 'FAQs: Preguntas técnicas comunes', category: 'FAQs', icon: '❓' },
        { title: 'Glosario de términos técnicos', category: 'Glosario', icon: '📙' },
        { title: 'Grabación: Webinar de Introducción', category: 'Webinar', icon: '📹' },
        { title: 'Caso de Éxito: Acme Corp', category: 'Casos de Éxito', icon: '🌟' },
        { title: 'Guía de inicio rápido para administradores', category: 'Manual', icon: '📘' },
    ];
    const resourcesList = document.getElementById('resources-list');
    const searchInput = document.getElementById('resource-search');

    function renderResources(filter = '') {
        resourcesList.innerHTML = '';
        const filteredData = resourcesData.filter(item => 
            item.title.toLowerCase().includes(filter.toLowerCase()) ||
            item.category.toLowerCase().includes(filter.toLowerCase())
        );

        if (filteredData.length === 0) {
            resourcesList.innerHTML = `<li class="p-4 text-center text-slate-500">No se encontraron recursos.</li>`;
            return;
        }

        filteredData.forEach(item => {
            const itemHTML = `
                <li class="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div class="flex items-center">
                        <span class="text-2xl mr-4">${item.icon}</span>
                        <div>
                            <p class="font-medium text-slate-800">${item.title}</p>
                            <p class="text-sm text-slate-500">${item.category}</p>
                        </div>
                    </div>
                    <button class="text-sky-600 font-semibold text-sm">Ver</button>
                </li>
            `;
            resourcesList.innerHTML += itemHTML;
        });
    }

    searchInput.addEventListener('input', function(e) {
        renderResources(e.target.value);
    });

    renderResources();
});