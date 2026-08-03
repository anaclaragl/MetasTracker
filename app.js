/**
 * MetasTracker Application Core Script
 * Manage habits, projects, milestones, analytics, and data persistence.
 * Written strictly in English per workspace rules.
 */

// Application State Schema
const DEFAULT_STATE = {
    theme: 'dark',
    habits: [
        {
            id: 'habit-1',
            title: 'Mandar Currículos',
            target: 5,
            current: 2,
            unit: 'currículos',
            category: 'carreira',
            icon: 'fa-file-lines',
            streak: 4,
            lastCompletedDate: getTodayDateString()
        },
        {
            id: 'habit-2',
            title: 'Estudar Programação / IA',
            target: 60,
            current: 60,
            unit: 'minutos',
            category: 'estudo',
            icon: 'fa-laptop-code',
            streak: 7,
            lastCompletedDate: getTodayDateString()
        },
        {
            id: 'habit-3',
            title: 'Exercício Físico',
            target: 30,
            current: 0,
            unit: 'minutos',
            category: 'saude',
            icon: 'fa-dumbbell',
            streak: 2,
            lastCompletedDate: getYesterdayDateString()
        }
    ],
    projects: [
        {
            id: 'proj-1',
            title: 'MetasTracker WebApp',
            description: 'Plataforma completa para gerenciar rotinas diárias, ideias de softwares e grandes objetivos de carreira.',
            status: 'in-progress',
            tags: ['HTML5', 'CSS3', 'JavaScript'],
            subtasks: [
                { id: 'sub-1', title: 'Criar estrutura e layout responsivo', done: true },
                { id: 'sub-2', title: 'Implementar salvamento no LocalStorage', done: true },
                { id: 'sub-3', title: 'Adicionar quadro Kanban interativo', done: true },
                { id: 'sub-4', title: 'Incluir gráficos de desempenho semanal', done: false }
            ]
        },
        {
            id: 'proj-2',
            title: 'Novo Portfólio 2026',
            description: 'Site pessoal de alta estética destacando principais projetos e casos de sucesso.',
            status: 'idea',
            tags: ['UX/UI', 'Portfólio', 'Fullstack'],
            subtasks: [
                { id: 'sub-201', title: 'Desenhar protótipo no Figma', done: false },
                { id: 'sub-202', title: 'Escrever textos e descrições dos projetos', done: false }
            ]
        },
        {
            id: 'proj-3',
            title: 'Automação de Tarefas em Python',
            description: 'Script para envio de relatórios e busca de oportunidades de emprego.',
            status: 'completed',
            tags: ['Python', 'Automação'],
            subtasks: [
                { id: 'sub-301', title: 'Escrever rotina de scraping', done: true },
                { id: 'sub-302', title: 'Integrar com envio de e-mails', done: true }
            ]
        }
    ],
    milestones: [
        {
            id: 'milestone-1',
            title: 'Conseguir um Emprego Melhor em Tecnologia',
            targetDate: '2026-11-30',
            category: 'carreira',
            notes: 'Focar em vagas que paguem melhor, permitam trabalho remoto e aprendizado contínuo.',
            steps: [
                { id: 'step-1', title: 'Atualizar perfil do LinkedIn e Currículo', done: true },
                { id: 'step-2', title: 'Mandar 5 currículos personalizados por dia', done: true },
                { id: 'step-3', title: 'Desenvolver e lançar 2 projetos no GitHub', done: false },
                { id: 'step-4', title: 'Treinar 20 perguntas de entrevista técnica', done: false }
            ]
        },
        {
            id: 'milestone-2',
            title: 'Obter Certificação Profissional Cloud / DevOps',
            targetDate: '2026-12-15',
            category: 'conhecimento',
            notes: 'Estudar 1 hora diária para dominar os conceitos fundamentais e simulados.',
            steps: [
                { id: 'step-201', title: 'Concluir curso preparatório online', done: true },
                { id: 'step-202', title: 'Realizar 3 simulados com pontuação > 80%', done: false },
                { id: 'step-203', title: 'Agendar e realizar exame oficial', done: false }
            ]
        }
    ],
    dailyLog: {
        [getTodayDateString()]: 4
    }
};

let state = loadStateFromLocalStorage();

// Helper Date Functions
function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function getYesterdayDateString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
}

function formatDateToBR(dateString) {
    if (!dateString) return 'Sem prazo';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// LocalStorage Persistence
function loadStateFromLocalStorage() {
    try {
        const stored = localStorage.getItem('metas_tracker_state');
        if (stored) {
            const parsed = JSON.parse(stored);
            // Check day reset for habits
            const today = getTodayDateString();
            if (parsed.lastOpenedDay !== today) {
                parsed.habits.forEach(h => {
                    if (h.lastCompletedDate !== today) {
                        h.current = 0;
                    }
                });
                parsed.lastOpenedDay = today;
            }
            return parsed;
        }
    } catch (e) {
        console.error('Error loading state from LocalStorage:', e);
    }
    const initialState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    initialState.lastOpenedDay = getTodayDateString();
    return initialState;
}

function saveState() {
    try {
        state.lastOpenedDay = getTodayDateString();
        localStorage.setItem('metas_tracker_state', JSON.stringify(state));
    } catch (e) {
        console.error('Error saving state to LocalStorage:', e);
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'warning') icon = 'fa-triangle-exclamation';
    
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Visual Confetti Trigger
function triggerConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

// Initialize App Event Listeners & Views
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initModals();
    initForms();
    initBackupHandlers();

    renderAllViews();
});

// Theme Logic
function initTheme() {
    const htmlElem = document.documentElement;
    if (state.theme) {
        htmlElem.setAttribute('data-theme', state.theme);
    }
    updateThemeButtonUI();

    document.getElementById('theme-toggle-btn').addEventListener('click', () => {
        const currentTheme = htmlElem.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElem.setAttribute('data-theme', newTheme);
        state.theme = newTheme;
        saveState();
        updateThemeButtonUI();
    });
}

function updateThemeButtonUI() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textSpan = document.getElementById('theme-btn-text');
    const iconElem = document.querySelector('#theme-toggle-btn i');
    
    if (isDark) {
        textSpan.textContent = 'Modo Claro';
        iconElem.className = 'fa-solid fa-sun';
    } else {
        textSpan.textContent = 'Modo Escuro';
        iconElem.className = 'fa-solid fa-moon';
    }
}

// Navigation & Tab Switching
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-item');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    document.querySelectorAll('[data-switch-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-switch-tab');
            switchTab(tabName);
        });
    });

    document.getElementById('global-add-btn').addEventListener('click', () => {
        const activeTab = document.querySelector('.tab-content.active').id;
        if (activeTab === 'tab-projects') {
            document.getElementById('form-project').reset();
            document.getElementById('project-id').value = '';
            document.getElementById('subtask-inputs-list').innerHTML = '';
            document.getElementById('modal-project-title').textContent = 'Novo Projeto / Ideia';
            addSubtaskInputField();
            openModal('modal-project');
        } else if (activeTab === 'tab-milestones') {
            document.getElementById('form-milestone').reset();
            document.getElementById('milestone-id').value = '';
            document.getElementById('milestone-step-inputs-list').innerHTML = '';
            document.getElementById('modal-milestone-title').textContent = 'Nova Grande Meta';
            addMilestoneStepInputField();
            openModal('modal-milestone');
        } else {
            document.getElementById('form-habit').reset();
            document.getElementById('habit-id').value = '';
            document.getElementById('modal-habit-title').textContent = 'Novo Hábito / Meta Diária';
            openModal('modal-habit');
        }
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    const targetNav = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
    const targetContent = document.getElementById(`tab-${tabName}`);

    if (targetNav) targetNav.classList.add('active');
    if (targetContent) targetContent.classList.add('active');

    // Update Header Titles
    const titleMap = {
        dashboard: { title: 'Dashboard', desc: 'Visão geral do seu progresso, hábitos do dia e projetos ativos.' },
        habits: { title: 'Hábitos Diários & Metas Quantitativas', desc: 'Acompanhe metas rotineiras com contadores diários e sequências.' },
        projects: { title: 'Quadro de Projetos & Ideias', desc: 'Gerencie ideias do backlog, projetos em produção e subtarefas.' },
        milestones: { title: 'Grandes Metas de Carreira & Vida', desc: 'Planejamento estratégico de longo prazo com passos de ação.' },
        analytics: { title: 'Estatísticas & Análise de Progresso', desc: 'Métricas visuais do seu desempenho nos últimos dias.' }
    };

    if (titleMap[tabName]) {
        document.getElementById('page-title').textContent = titleMap[tabName].title;
        document.getElementById('page-subtitle').textContent = titleMap[tabName].desc;
    }

    renderAllViews();
}

// Master Render Function
function renderAllViews() {
    updateBadgesAndStats();
    renderDashboard();
    renderHabits();
    renderProjects();
    renderMilestones();
    renderAnalytics();
}

function updateBadgesAndStats() {
    const habitsBadge = document.getElementById('habits-badge');
    const projectsBadge = document.getElementById('projects-badge');

    if (habitsBadge) habitsBadge.textContent = state.habits.length;
    if (projectsBadge) projectsBadge.textContent = state.projects.length;

    // Stat card calculations
    const todayCompletedHabits = state.habits.filter(h => h.current >= h.target).length;
    const statHabitsElem = document.getElementById('stat-habits-completed');
    if (statHabitsElem) {
        statHabitsElem.textContent = `${todayCompletedHabits} / ${state.habits.length}`;
    }

    let maxStreak = 0;
    state.habits.forEach(h => {
        if (h.streak > maxStreak) maxStreak = h.streak;
    });
    const statStreakElem = document.getElementById('stat-best-streak');
    if (statStreakElem) {
        statStreakElem.textContent = `${maxStreak} dias`;
    }

    const activeProjects = state.projects.filter(p => p.status !== 'completed').length;
    const statProjectsElem = document.getElementById('stat-active-projects');
    if (statProjectsElem) {
        statProjectsElem.textContent = activeProjects;
    }

    const statMilestonesElem = document.getElementById('stat-milestones-count');
    if (statMilestonesElem) {
        statMilestonesElem.textContent = state.milestones.length;
    }

    // Progress circle percentage
    const progressText = document.getElementById('dashboard-progress-text');
    const progressCircle = document.getElementById('dashboard-progress-circle');
    
    let totalPercentage = 0;
    if (state.habits.length > 0) {
        let habitPctSum = 0;
        state.habits.forEach(h => {
            const pct = Math.min(100, Math.round((h.current / h.target) * 100));
            habitPctSum += pct;
        });
        totalPercentage = Math.round(habitPctSum / state.habits.length);
    }

    if (progressText) progressText.textContent = `${totalPercentage}%`;
    if (progressCircle) progressCircle.setAttribute('stroke-dasharray', `${totalPercentage}, 100`);
}

// 1. DASHBOARD VIEW RENDER
function renderDashboard() {
    const habitsList = document.getElementById('dashboard-habits-list');
    const projectsList = document.getElementById('dashboard-projects-list');

    if (habitsList) {
        habitsList.innerHTML = '';
        if (state.habits.length === 0) {
            habitsList.innerHTML = '<p class="text-muted">Nenhum hábito cadastrado ainda. Clique em "Criar Hábito" para começar.</p>';
        } else {
            state.habits.slice(0, 4).forEach(habit => {
                const isDone = habit.current >= habit.target;
                const item = document.createElement('div');
                item.className = `list-item-card ${isDone ? 'completed' : ''}`;
                item.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div class="habit-icon-badge"><i class="fa-solid ${habit.icon || 'fa-bullseye'}"></i></div>
                        <div>
                            <strong style="font-size: 0.9rem;">${escapeHtml(habit.title)}</strong>
                            <div style="font-size: 0.75rem; color: var(--text-secondary);">${habit.current} de ${habit.target} ${escapeHtml(habit.unit)}</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="counter-controls">
                            <button class="btn-counter" onclick="adjustHabitCount('${habit.id}', -1)">-</button>
                            <button class="btn-counter" onclick="adjustHabitCount('${habit.id}', 1)">+</button>
                        </div>
                        <button class="btn-icon" onclick="openEditHabitModal('${habit.id}')" title="Editar" style="color: var(--text-muted);"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icon" onclick="deleteHabit('${habit.id}')" title="Excluir" style="color: var(--text-muted);"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
                habitsList.appendChild(item);
            });
        }
    }

    if (projectsList) {
        projectsList.innerHTML = '';
        const inProgress = state.projects.filter(p => p.status === 'in-progress');
        if (inProgress.length === 0) {
            projectsList.innerHTML = '<p class="text-muted">Nenhum projeto em produção no momento. Adicione um na aba Projetos.</p>';
        } else {
            inProgress.forEach(proj => {
                const totalSub = proj.subtasks ? proj.subtasks.length : 0;
                const doneSub = proj.subtasks ? proj.subtasks.filter(s => s.done).length : 0;
                const pct = totalSub > 0 ? Math.round((doneSub / totalSub) * 100) : 0;

                const item = document.createElement('div');
                item.className = 'list-item-card';
                item.innerHTML = `
                    <div>
                        <strong style="font-size: 0.9rem;">${escapeHtml(proj.title)}</strong>
                        <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                            ${doneSub} de ${totalSub} tarefas concluídas (${pct}%)
                        </div>
                    </div>
                    <button class="btn-text" onclick="switchTab('projects')">Abrir <i class="fa-solid fa-chevron-right"></i></button>
                `;
                projectsList.appendChild(item);
            });
        }
    }
}

// 2. HABITS TAB RENDER & ACTIONS
function renderHabits() {
    const container = document.getElementById('habits-cards-container');
    if (!container) return;

    const searchInput = document.getElementById('habit-search');
    const filterSelect = document.getElementById('habit-filter-category');

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const categoryFilter = filterSelect ? filterSelect.value : 'all';

    container.innerHTML = '';

    const filtered = state.habits.filter(h => {
        const matchesSearch = h.title.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || h.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
            <i class="fa-solid fa-fire-burner" style="font-size: 2.5rem; margin-bottom: 1rem;"></i>
            <p>Nenhum hábito encontrado com esses filtros.</p>
        </div>`;
        return;
    }

    filtered.forEach(habit => {
        const pct = Math.min(100, Math.round((habit.current / habit.target) * 100));
        const isCompleted = habit.current >= habit.target;

        const card = document.createElement('div');
        card.className = `habit-card category-${habit.category} ${isCompleted ? 'completed' : ''}`;
        card.innerHTML = `
            <div class="habit-header">
                <div class="habit-title-area">
                    <div class="habit-icon-badge">
                        <i class="fa-solid ${habit.icon || 'fa-bullseye'}"></i>
                    </div>
                    <div>
                        <h4>${escapeHtml(habit.title)}</h4>
                        <span class="habit-category-tag">${escapeHtml(habit.category)}</span>
                    </div>
                </div>
                <div class="card-actions-menu">
                    <button class="btn-icon" onclick="openEditHabitModal('${habit.id}')" title="Editar"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-icon" onclick="deleteHabit('${habit.id}')" title="Excluir"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>

            <div class="habit-progress-section">
                <div class="habit-counter-bar">
                    <div class="counter-text">${habit.current} <span>/ ${habit.target} ${escapeHtml(habit.unit)}</span></div>
                    <span style="font-size: 0.85rem; font-weight: 700; color: ${isCompleted ? 'var(--emerald)' : 'var(--text-secondary)'};">
                        ${isCompleted ? '✓ Meta Concluída' : `${pct}%`}
                    </span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${pct}%;"></div>
                </div>
            </div>

            <div class="habit-footer">
                <div class="streak-badge" title="Dias seguidos completando este hábito">
                    <i class="fa-solid fa-fire"></i>
                    <span>${habit.streak || 0} dias em sequência</span>
                </div>
                <div class="counter-controls">
                    <button class="btn-counter" onclick="adjustHabitCount('${habit.id}', -1)">-</button>
                    <button class="btn-counter" onclick="adjustHabitCount('${habit.id}', 1)">+</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function adjustHabitCount(habitId, delta) {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return;

    const previousCurrent = habit.current;
    habit.current = Math.max(0, habit.current + delta);

    const today = getTodayDateString();
    
    // Check if target was reached right now
    if (habit.current >= habit.target && previousCurrent < habit.target) {
        if (habit.lastCompletedDate !== today) {
            habit.streak = (habit.streak || 0) + 1;
            habit.lastCompletedDate = today;
        }
        triggerConfetti();
        showToast(`Meta "${habit.title}" alcançada hoje! 🎉`, 'success');
    }

    // Log daily activity count
    if (!state.dailyLog) state.dailyLog = {};
    state.dailyLog[today] = (state.dailyLog[today] || 0) + (delta > 0 ? 1 : -1);

    saveState();
    renderAllViews();
}

function deleteHabit(habitId) {
    if (confirm('Tem certeza que deseja excluir este hábito?')) {
        state.habits = state.habits.filter(h => h.id !== habitId);
        saveState();
        renderAllViews();
        showToast('Hábito removido com sucesso.', 'info');
    }
}

// 3. PROJECTS & IDEAS (KANBAN) RENDER
function renderProjects() {
    const colIdea = document.getElementById('col-body-idea');
    const colProgress = document.getElementById('col-body-progress');
    const colCompleted = document.getElementById('col-body-completed');

    if (!colIdea || !colProgress || !colCompleted) return;

    colIdea.innerHTML = '';
    colProgress.innerHTML = '';
    colCompleted.innerHTML = '';

    const searchInput = document.getElementById('project-search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

    const counts = { idea: 0, 'in-progress': 0, completed: 0 };

    state.projects.forEach(proj => {
        if (searchTerm && !proj.title.toLowerCase().includes(searchTerm) && !proj.description.toLowerCase().includes(searchTerm)) {
            return;
        }

        counts[proj.status] = (counts[proj.status] || 0) + 1;

        const card = document.createElement('div');
        card.className = 'project-card';

        const totalSub = proj.subtasks ? proj.subtasks.length : 0;
        const doneSub = proj.subtasks ? proj.subtasks.filter(s => s.done).length : 0;

        let subtasksHtml = '';
        if (totalSub > 0) {
            subtasksHtml = `
                <div class="subtasks-progress">
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.3rem;">
                        <span>Tarefas</span>
                        <span>${doneSub}/${totalSub}</span>
                    </div>
                    ${proj.subtasks.map(st => `
                        <div class="subtask-item ${st.done ? 'checked' : ''}">
                            <input type="checkbox" ${st.done ? 'checked' : ''} onchange="toggleSubtask('${proj.id}', '${st.id}')">
                            <span>${escapeHtml(st.title)}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        let tagsHtml = '';
        if (proj.tags && proj.tags.length > 0) {
            tagsHtml = `
                <div class="tags-list">
                    ${proj.tags.map(t => `<span class="tag-pill">${escapeHtml(t)}</span>`).join('')}
                </div>
            `;
        }

        let moverHtml = '';
        if (proj.status === 'idea') {
            moverHtml = `<button class="btn btn-secondary btn-sm" onclick="moveProjectStatus('${proj.id}', 'in-progress')">Mover p/ Em Produção <i class="fa-solid fa-arrow-right"></i></button>`;
        } else if (proj.status === 'in-progress') {
            moverHtml = `
                <button class="btn btn-secondary btn-sm" onclick="moveProjectStatus('${proj.id}', 'idea')"><i class="fa-solid fa-arrow-left"></i> Ideia</button>
                <button class="btn btn-primary btn-sm" onclick="moveProjectStatus('${proj.id}', 'completed')">Concluir <i class="fa-solid fa-check"></i></button>
            `;
        } else {
            moverHtml = `<button class="btn btn-secondary btn-sm" onclick="moveProjectStatus('${proj.id}', 'in-progress')"><i class="fa-solid fa-rotate-left"></i> Reabrir</button>`;
        }

        card.innerHTML = `
            <div class="project-card-header">
                <h4>${escapeHtml(proj.title)}</h4>
                <div class="card-actions-menu">
                    <button class="btn-icon" onclick="openEditProjectModal('${proj.id}')"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-icon" onclick="deleteProject('${proj.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            ${proj.description ? `<p class="project-desc">${escapeHtml(proj.description)}</p>` : ''}
            ${tagsHtml}
            ${subtasksHtml}
            <div class="card-status-mover">
                ${moverHtml}
            </div>
        `;

        if (proj.status === 'idea') colIdea.appendChild(card);
        else if (proj.status === 'in-progress') colProgress.appendChild(card);
        else if (proj.status === 'completed') colCompleted.appendChild(card);
    });

    document.getElementById('count-idea').textContent = counts.idea;
    document.getElementById('count-progress').textContent = counts['in-progress'];
    document.getElementById('count-completed').textContent = counts.completed;
}

function toggleSubtask(projectId, subtaskId) {
    const proj = state.projects.find(p => p.id === projectId);
    if (!proj || !proj.subtasks) return;

    const sub = proj.subtasks.find(s => s.id === subtaskId);
    if (sub) {
        sub.done = !sub.done;
        
        // If all subtasks completed, toast encouragement
        const allDone = proj.subtasks.every(s => s.done);
        if (allDone) {
            triggerConfetti();
            showToast(`Todas as tarefas do projeto "${proj.title}" foram concluídas!`, 'success');
        }
        
        saveState();
        renderAllViews();
    }
}

function moveProjectStatus(projectId, newStatus) {
    const proj = state.projects.find(p => p.id === projectId);
    if (proj) {
        proj.status = newStatus;
        if (newStatus === 'completed') {
            triggerConfetti();
            showToast(`Projeto "${proj.title}" concluído com sucesso! 🚀`, 'success');
        }
        saveState();
        renderAllViews();
    }
}

function deleteProject(projectId) {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
        state.projects = state.projects.filter(p => p.id !== projectId);
        saveState();
        renderAllViews();
        showToast('Projeto removido.', 'info');
    }
}

// 4. MILESTONES (GRANDES METAS) RENDER
function renderMilestones() {
    const container = document.getElementById('milestones-cards-container');
    if (!container) return;

    container.innerHTML = '';

    if (state.milestones.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
            <i class="fa-solid fa-trophy" style="font-size: 2.5rem; margin-bottom: 1rem;"></i>
            <p>Nenhuma grande meta definida. Clique em "Nova Grande Meta" para criar seu plano de ação.</p>
        </div>`;
        return;
    }

    state.milestones.forEach(m => {
        const totalSteps = m.steps ? m.steps.length : 0;
        const doneSteps = m.steps ? m.steps.filter(s => s.done).length : 0;
        const pct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

        const card = document.createElement('div');
        card.className = `milestone-card milestone-category-${m.category}`;

        let stepsHtml = '';
        if (totalSteps > 0) {
            stepsHtml = `
                <div class="steps-list">
                    <strong style="font-size: 0.85rem; color: var(--text-secondary);">Plano de Ação (${doneSteps}/${totalSteps}):</strong>
                    ${m.steps.map(step => `
                        <div class="step-row">
                            <input type="checkbox" ${step.done ? 'checked' : ''} onchange="toggleMilestoneStep('${m.id}', '${step.id}')">
                            <span style="${step.done ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${escapeHtml(step.title)}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        card.innerHTML = `
            <div class="milestone-header">
                <div class="milestone-info">
                    <h3>${escapeHtml(m.title)}</h3>
                    <div class="milestone-meta">
                        <span><i class="fa-regular fa-calendar"></i> Prazo: ${formatDateToBR(m.targetDate)}</span>
                        <span style="text-transform: capitalize;"><i class="fa-solid fa-tag"></i> ${escapeHtml(m.category)}</span>
                    </div>
                </div>
                <div class="card-actions-menu">
                    <button class="btn-icon" onclick="openEditMilestoneModal('${m.id}')"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-icon" onclick="deleteMilestone('${m.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>

            ${m.notes ? `<div class="milestone-notes"><i class="fa-solid fa-lightbulb" style="color: var(--amber); margin-right: 6px;"></i> ${escapeHtml(m.notes)}</div>` : ''}

            <div class="habit-progress-section">
                <div class="habit-counter-bar">
                    <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">Progresso Geral</span>
                    <span style="font-size: 0.9rem; font-weight: 800; color: ${pct === 100 ? 'var(--emerald)' : 'var(--primary)'};">${pct}%</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${pct}%;"></div>
                </div>
            </div>

            ${stepsHtml}
        `;

        container.appendChild(card);
    });
}

function toggleMilestoneStep(milestoneId, stepId) {
    const m = state.milestones.find(item => item.id === milestoneId);
    if (!m || !m.steps) return;

    const step = m.steps.find(s => s.id === stepId);
    if (step) {
        step.done = !step.done;
        const allDone = m.steps.every(s => s.done);
        if (allDone) {
            triggerConfetti();
            showToast(`PARABÉNS! Grande meta "${m.title}" 100% concluída! 🏆`, 'success');
        }
        saveState();
        renderAllViews();
    }
}

function deleteMilestone(milestoneId) {
    if (confirm('Tem certeza que deseja excluir esta grande meta?')) {
        state.milestones = state.milestones.filter(m => m.id !== milestoneId);
        saveState();
        renderAllViews();
        showToast('Meta removida.', 'info');
    }
}

// 5. ANALYTICS VIEW RENDER
function renderAnalytics() {
    const barsContainer = document.getElementById('weekly-bars-chart');
    const categoryContainer = document.getElementById('category-distribution');

    if (barsContainer) {
        barsContainer.innerHTML = '';
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = dayNames[d.getDay()];

            const count = state.dailyLog && state.dailyLog[dateStr] ? state.dailyLog[dateStr] : 0;
            const maxVal = 10;
            const heightPct = Math.min(100, Math.max(10, Math.round((count / maxVal) * 100)));

            const barCol = document.createElement('div');
            barCol.className = 'bar-col';
            barCol.innerHTML = `
                <span style="font-size: 0.75rem; font-weight: 700;">${count}</span>
                <div class="bar-wrapper">
                    <div class="bar-fill" style="height: ${heightPct}%;"></div>
                </div>
                <span class="bar-day">${dayName}</span>
            `;
            barsContainer.appendChild(barCol);
        }
    }

    if (categoryContainer) {
        categoryContainer.innerHTML = '';
        const catMap = {
            carreira: { name: 'Carreira & Emprego', count: 0, color: 'var(--accent-blue)' },
            estudo: { name: 'Estudo & Conhecimento', count: 0, color: 'var(--accent-purple)' },
            saude: { name: 'Saúde & Bem-Estar', count: 0, color: 'var(--accent-green)' },
            produtividade: { name: 'Produtividade Geral', count: 0, color: 'var(--accent-yellow)' }
        };

        state.habits.forEach(h => {
            if (catMap[h.category]) catMap[h.category].count++;
        });

        const total = state.habits.length || 1;

        Object.values(catMap).forEach(cat => {
            const pct = Math.round((cat.count / total) * 100);
            const catElem = document.createElement('div');
            catElem.className = 'cat-item';
            catElem.innerHTML = `
                <div class="cat-info">
                    <span>${cat.name}</span>
                    <span>${cat.count} (${pct}%)</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${pct}%; background: ${cat.color};"></div>
                </div>
            `;
            categoryContainer.appendChild(catElem);
        });
    }
}

// MODAL HANDLERS & FORMS
function initModals() {
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-close-modal');
            closeModal(modalId);
        });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay.id);
            }
        });
    });

    document.getElementById('add-habit-btn').addEventListener('click', () => {
        document.getElementById('form-habit').reset();
        document.getElementById('habit-id').value = '';
        document.getElementById('modal-habit-title').textContent = 'Novo Hábito / Meta Diária';
        openModal('modal-habit');
    });

    document.getElementById('add-project-btn').addEventListener('click', () => {
        document.getElementById('form-project').reset();
        document.getElementById('project-id').value = '';
        document.getElementById('subtask-inputs-list').innerHTML = '';
        document.getElementById('modal-project-title').textContent = 'Novo Projeto / Ideia';
        addSubtaskInputField();
        openModal('modal-project');
    });

    document.getElementById('add-milestone-btn').addEventListener('click', () => {
        document.getElementById('form-milestone').reset();
        document.getElementById('milestone-id').value = '';
        document.getElementById('milestone-step-inputs-list').innerHTML = '';
        document.getElementById('modal-milestone-title').textContent = 'Nova Grande Meta';
        addMilestoneStepInputField();
        openModal('modal-milestone');
    });

    document.getElementById('add-subtask-input-btn').addEventListener('click', () => addSubtaskInputField());
    document.getElementById('add-milestone-step-input-btn').addEventListener('click', () => addMilestoneStepInputField());
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function addSubtaskInputField(value = '') {
    const container = document.getElementById('subtask-inputs-list');
    const div = document.createElement('div');
    div.className = 'dynamic-input-row';
    div.innerHTML = `
        <input type="text" class="subtask-input-val" placeholder="Ex: Criar tela inicial" value="${escapeHtml(value)}">
        <button type="button" class="btn-icon" onclick="this.parentElement.remove()">&times;</button>
    `;
    container.appendChild(div);
}

function addMilestoneStepInputField(value = '') {
    const container = document.getElementById('milestone-step-inputs-list');
    const div = document.createElement('div');
    div.className = 'dynamic-input-row';
    div.innerHTML = `
        <input type="text" class="milestone-step-input-val" placeholder="Ex: Passo de ação..." value="${escapeHtml(value)}">
        <button type="button" class="btn-icon" onclick="this.parentElement.remove()">&times;</button>
    `;
    container.appendChild(div);
}

// FORM SUBMISSIONS
function initForms() {
    // Habit Form
    document.getElementById('form-habit').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('habit-id').value;
        const title = document.getElementById('habit-title').value.trim();
        const target = parseInt(document.getElementById('habit-target').value, 10) || 1;
        const unit = document.getElementById('habit-unit').value.trim() || 'unidades';
        const category = document.getElementById('habit-category').value;
        const icon = document.getElementById('habit-icon').value;

        if (id) {
            const h = state.habits.find(item => item.id === id);
            if (h) {
                h.title = title;
                h.target = target;
                h.unit = unit;
                h.category = category;
                h.icon = icon;
            }
            showToast('Hábito atualizado!', 'success');
        } else {
            const newHabit = {
                id: 'habit-' + Date.now(),
                title,
                target,
                current: 0,
                unit,
                category,
                icon,
                streak: 0,
                lastCompletedDate: ''
            };
            state.habits.push(newHabit);
            showToast('Novo hábito criado!', 'success');
        }

        saveState();
        closeModal('modal-habit');
        renderAllViews();
    });

    // Project Form
    document.getElementById('form-project').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('project-id').value;
        const title = document.getElementById('project-title').value.trim();
        const description = document.getElementById('project-description').value.trim();
        const status = document.getElementById('project-status').value;
        const tagsRaw = document.getElementById('project-tags').value;
        const tags = tagsRaw.split(',').map(t => t.trim()).filter(t => t.length > 0);

        const subtaskInputs = document.querySelectorAll('.subtask-input-val');
        const subtasks = [];
        subtaskInputs.forEach((inp, idx) => {
            const text = inp.value.trim();
            if (text) {
                subtasks.push({
                    id: 'sub-' + Date.now() + '-' + idx,
                    title: text,
                    done: false
                });
            }
        });

        if (id) {
            const p = state.projects.find(item => item.id === id);
            if (p) {
                p.title = title;
                p.description = description;
                p.status = status;
                p.tags = tags;
                // Preserve done state of existing subtasks if matching titles
                const updatedSubtasks = subtasks.map(s => {
                    const existing = p.subtasks ? p.subtasks.find(ex => ex.title === s.title) : null;
                    return existing ? { ...s, done: existing.done } : s;
                });
                p.subtasks = updatedSubtasks;
            }
            showToast('Projeto atualizado!', 'success');
        } else {
            const newProj = {
                id: 'proj-' + Date.now(),
                title,
                description,
                status,
                tags,
                subtasks
            };
            state.projects.push(newProj);
            showToast('Projeto adicionado!', 'success');
        }

        saveState();
        closeModal('modal-project');
        renderAllViews();
    });

    // Milestone Form
    document.getElementById('form-milestone').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('milestone-id').value;
        const title = document.getElementById('milestone-title').value.trim();
        const targetDate = document.getElementById('milestone-target-date').value;
        const category = document.getElementById('milestone-category').value;
        const notes = document.getElementById('milestone-notes').value.trim();

        const stepInputs = document.querySelectorAll('.milestone-step-input-val');
        const steps = [];
        stepInputs.forEach((inp, idx) => {
            const text = inp.value.trim();
            if (text) {
                steps.push({
                    id: 'step-' + Date.now() + '-' + idx,
                    title: text,
                    done: false
                });
            }
        });

        if (id) {
            const m = state.milestones.find(item => item.id === id);
            if (m) {
                m.title = title;
                m.targetDate = targetDate;
                m.category = category;
                m.notes = notes;
                const updatedSteps = steps.map(s => {
                    const existing = m.steps ? m.steps.find(ex => ex.title === s.title) : null;
                    return existing ? { ...s, done: existing.done } : s;
                });
                m.steps = updatedSteps;
            }
            showToast('Grande meta atualizada!', 'success');
        } else {
            const newMilestone = {
                id: 'milestone-' + Date.now(),
                title,
                targetDate,
                category,
                notes,
                steps
            };
            state.milestones.push(newMilestone);
            showToast('Grande meta registrada!', 'success');
        }

        saveState();
        closeModal('modal-milestone');
        renderAllViews();
    });

    // Live search input listeners
    document.getElementById('habit-search')?.addEventListener('input', () => renderHabits());
    document.getElementById('habit-filter-category')?.addEventListener('change', () => renderHabits());
    document.getElementById('project-search')?.addEventListener('input', () => renderProjects());
}

// EDIT MODAL PRE-FILLS
function openEditHabitModal(habitId) {
    const h = state.habits.find(item => item.id === habitId);
    if (!h) return;

    document.getElementById('habit-id').value = h.id;
    document.getElementById('habit-title').value = h.title;
    document.getElementById('habit-target').value = h.target;
    document.getElementById('habit-unit').value = h.unit;
    document.getElementById('habit-category').value = h.category;
    document.getElementById('habit-icon').value = h.icon || 'fa-bullseye';
    document.getElementById('modal-habit-title').textContent = 'Editar Hábito';

    openModal('modal-habit');
}

function openEditProjectModal(projectId) {
    const p = state.projects.find(item => item.id === projectId);
    if (!p) return;

    document.getElementById('project-id').value = p.id;
    document.getElementById('project-title').value = p.title;
    document.getElementById('project-description').value = p.description || '';
    document.getElementById('project-status').value = p.status;
    document.getElementById('project-tags').value = p.tags ? p.tags.join(', ') : '';
    document.getElementById('modal-project-title').textContent = 'Editar Projeto';

    const subtaskContainer = document.getElementById('subtask-inputs-list');
    subtaskContainer.innerHTML = '';
    if (p.subtasks && p.subtasks.length > 0) {
        p.subtasks.forEach(st => addSubtaskInputField(st.title));
    } else {
        addSubtaskInputField();
    }

    openModal('modal-project');
}

function openEditMilestoneModal(milestoneId) {
    const m = state.milestones.find(item => item.id === milestoneId);
    if (!m) return;

    document.getElementById('milestone-id').value = m.id;
    document.getElementById('milestone-title').value = m.title;
    document.getElementById('milestone-target-date').value = m.targetDate || '';
    document.getElementById('milestone-category').value = m.category;
    document.getElementById('milestone-notes').value = m.notes || '';
    document.getElementById('modal-milestone-title').textContent = 'Editar Grande Meta';

    const stepsContainer = document.getElementById('milestone-step-inputs-list');
    stepsContainer.innerHTML = '';
    if (m.steps && m.steps.length > 0) {
        m.steps.forEach(st => addMilestoneStepInputField(st.title));
    } else {
        addMilestoneStepInputField();
    }

    openModal('modal-milestone');
}

// BACKUP & RESTORE DATA HANDLERS
function initBackupHandlers() {
    const backupBtn = document.getElementById('backup-btn');
    if (backupBtn) {
        backupBtn.addEventListener('click', () => openModal('modal-backup'));
    }

    document.getElementById('export-json-btn')?.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `metas_tracker_backup_${getTodayDateString()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('Backup exportado com sucesso!', 'success');
    });

    document.getElementById('import-json-btn')?.addEventListener('click', () => {
        document.getElementById('import-json-input').click();
    });

    document.getElementById('import-json-input')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                if (parsed.habits && parsed.projects && parsed.milestones) {
                    state = parsed;
                    saveState();
                    renderAllViews();
                    closeModal('modal-backup');
                    showToast('Dados importados com sucesso!', 'success');
                } else {
                    alert('Arquivo JSON inválido. Estrutura incorreta.');
                }
            } catch (err) {
                alert('Erro ao ler o arquivo de backup.');
            }
        };
        reader.readAsText(file);
    });

    document.getElementById('reset-demo-btn')?.addEventListener('click', () => {
        if (confirm('Restaurar dados de exemplo? Isso substituirá suas alterações atuais.')) {
            state = JSON.parse(JSON.stringify(DEFAULT_STATE));
            saveState();
            renderAllViews();
            closeModal('modal-backup');
            showToast('Dados de exemplo restaurados!', 'info');
        }
    });

    document.getElementById('clear-all-btn')?.addEventListener('click', () => {
        if (confirm('ATENÇÃO: Deseja apagar TODOS os seus hábitos, projetos e metas?')) {
            state.habits = [];
            state.projects = [];
            state.milestones = [];
            state.dailyLog = {};
            saveState();
            renderAllViews();
            closeModal('modal-backup');
            showToast('Todos os dados foram zerados.', 'warning');
        }
    });
}

// Utility: Escape HTML String to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}
