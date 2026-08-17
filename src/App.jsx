import React, { useState, useEffect } from 'react';
import DashboardTab from './components/DashboardTab';
import HabitsTab from './components/HabitsTab';
import TasksTab from './components/TasksTab';
import ProjectsTab from './components/ProjectsTab';
import MilestonesTab from './components/MilestonesTab';
import AnalyticsTab from './components/AnalyticsTab';
import AiAssistantModal from './components/AiAssistantModal';
import BackupModal from './components/BackupModal';

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
    tasks: [
        {
            id: 'task-1',
            title: 'Responder e-mails de recrutadores no LinkedIn',
            priority: 'high',
            status: 'todo',
            tag: 'Carreira',
            createdAt: getTodayDateString()
        },
        {
            id: 'task-2',
            title: 'Configurar chave API Gemini no MetasTracker',
            priority: 'medium',
            status: 'in-progress',
            tag: 'Setup',
            createdAt: getTodayDateString()
        },
        {
            id: 'task-3',
            title: 'Revisar anotações de estudo de IA',
            priority: 'low',
            status: 'done',
            tag: 'Estudo',
            createdAt: getTodayDateString()
        }
    ],
    dailyLog: {}
};

function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function getYesterdayDateString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
}

export default function App() {
    const [state, setState] = useState(() => {
        try {
            const stored = localStorage.getItem('metas_tracker_state');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (!Array.isArray(parsed.tasks)) parsed.tasks = [];
                // Check daily reset for habits
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
        // Seed default dailyLog count
        initialState.dailyLog = { [getTodayDateString()]: 4 };
        return initialState;
    });

    const [activeTab, setActiveTab] = useState('dashboard');
    const [toasts, setToasts] = useState([]);

    // Modal Control States
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

    // CRUD Modal State Details
    const [activeHabitModal, setActiveHabitModal] = useState({ open: false, isEdit: false, habit: null });
    const [activeTaskModal, setActiveTaskModal] = useState({ open: false, isEdit: false, task: null });
    const [activeProjectModal, setActiveProjectModal] = useState({ open: false, isEdit: false, project: null });
    const [activeMilestoneModal, setActiveMilestoneModal] = useState({ open: false, isEdit: false, milestone: null });

    // Temp lists for editing items that have sublists
    const [subtaskTitles, setSubtaskTitles] = useState([]);
    const [milestoneStepTitles, setMilestoneStepTitles] = useState([]);

    // Save state helper
    const saveState = (newState) => {
        setState(newState);
        try {
            localStorage.setItem('metas_tracker_state', JSON.stringify(newState));
        } catch (e) {
            console.error('Error saving state to LocalStorage:', e);
        }
    };

    // Confetti helper
    const triggerConfetti = () => {
        if (typeof window.confetti === 'function') {
            window.confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    // Toast helpers
    const showToast = (message, type = 'info') => {
        const id = Date.now() + '-' + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3300);
    };

    // Theme toggle
    const toggleTheme = () => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        const updated = { ...state, theme: newTheme };
        saveState(updated);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', state.theme || 'dark');
    }, [state.theme]);

    // Badge counts
    const habitsBadgeCount = state.habits.length;
    const tasksBadgeCount = state.tasks.filter(t => t.status !== 'done').length;
    const projectsBadgeCount = state.projects.length;

    // Navigation trigger
    const handleSwitchTab = (tab) => {
        setActiveTab(tab);
    };

    // Adjust habit completion counts
    const handleAdjustHabit = (habitId, delta) => {
        const updatedHabits = state.habits.map(h => {
            if (h.id === habitId) {
                const prev = h.current;
                const next = Math.max(0, h.current + delta);
                let streak = h.streak || 0;
                let lastCompletedDate = h.lastCompletedDate;
                const today = getTodayDateString();

                if (next >= h.target && prev < h.target) {
                    if (lastCompletedDate !== today) {
                        streak += 1;
                        lastCompletedDate = today;
                    }
                    triggerConfetti();
                    showToast(`Meta "${h.title}" alcançada hoje! 🎉`, 'success');
                }
                return { ...h, current: next, streak, lastCompletedDate };
            }
            return h;
        });

        // Update dailyLog
        const today = getTodayDateString();
        const dailyLog = { ...(state.dailyLog || {}) };
        dailyLog[today] = (dailyLog[today] || 0) + (delta > 0 ? 1 : -1);
        if (dailyLog[today] < 0) dailyLog[today] = 0;

        saveState({ ...state, habits: updatedHabits, dailyLog });
    };

    // Delete handlers
    const handleDeleteHabit = (habitId) => {
        if (window.confirm('Tem certeza que deseja excluir este hábito?')) {
            const habits = state.habits.filter(h => h.id !== habitId);
            saveState({ ...state, habits });
            showToast('Hábito removido com sucesso.', 'info');
        }
    };

    const handleDeleteTask = (taskId) => {
        if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
            const tasks = state.tasks.filter(t => t.id !== taskId);
            saveState({ ...state, tasks });
            showToast('Tarefa removida.', 'info');
        }
    };

    const handleDeleteProject = (projectId) => {
        if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
            const projects = state.projects.filter(p => p.id !== projectId);
            saveState({ ...state, projects });
            showToast('Projeto removido.', 'info');
        }
    };

    const handleDeleteMilestone = (milestoneId) => {
        if (window.confirm('Tem certeza que deseja excluir esta grande meta?')) {
            const milestones = state.milestones.filter(m => m.id !== milestoneId);
            saveState({ ...state, milestones });
            showToast('Meta removida.', 'info');
        }
    };

    // Move states in Kanban boards
    const handleMoveTask = (taskId, newStatus) => {
        const tasks = state.tasks.map(t => {
            if (t.id === taskId) {
                if (newStatus === 'done' && t.status !== 'done') {
                    triggerConfetti();
                    showToast(`Tarefa "${t.title}" concluída! 🎉`, 'success');
                }
                return { ...t, status: newStatus };
            }
            return t;
        });
        saveState({ ...state, tasks });
    };

    const handleMoveProject = (projectId, newStatus) => {
        const projects = state.projects.map(p => {
            if (p.id === projectId) {
                if (newStatus === 'completed' && p.status !== 'completed') {
                    triggerConfetti();
                    showToast(`Projeto "${p.title}" concluído! 🎉`, 'success');
                }
                return { ...p, status: newStatus };
            }
            return p;
        });
        saveState({ ...state, projects });
    };

    // Checklist toggles
    const handleToggleSubtask = (projectId, subtaskId) => {
        const projects = state.projects.map(p => {
            if (p.id === projectId) {
                const subtasks = p.subtasks.map(s => {
                    if (s.id === subtaskId) {
                        return { ...s, done: !s.done };
                    }
                    return s;
                });
                return { ...p, subtasks };
            }
            return p;
        });
        saveState({ ...state, projects });
    };

    const handleToggleMilestoneStep = (milestoneId, stepId) => {
        const milestones = state.milestones.map(m => {
            if (m.id === milestoneId) {
                const steps = m.steps.map(s => {
                    if (s.id === stepId) {
                        return { ...s, done: !s.done };
                    }
                    return s;
                });
                const allDone = steps.every(s => s.done);
                if (allDone && m.steps.some(s => !s.done)) {
                    triggerConfetti();
                    showToast(`PARABÉNS! Grande meta "${m.title}" 100% concluída! 🏆`, 'success');
                }
                return { ...m, steps };
            }
            return m;
        });
        saveState({ ...state, milestones });
    };

    // Backup integration triggers
    const handleImportState = (importedState) => {
        saveState(importedState);
    };

    const handleResetState = () => {
        const defaultState = JSON.parse(JSON.stringify(DEFAULT_STATE));
        defaultState.lastOpenedDay = getTodayDateString();
        defaultState.dailyLog = { [getTodayDateString()]: 4 };
        saveState(defaultState);
    };

    const handleClearState = () => {
        saveState({
            ...state,
            habits: [],
            tasks: [],
            projects: [],
            milestones: [],
            dailyLog: {}
        });
    };

    // AI items loader
    const handleAcceptAiItems = (parsedItems) => {
        let addedCount = 0;
        const newHabits = [...state.habits];
        const newTasks = [...state.tasks];
        const newProjects = [...state.projects];
        const newMilestones = [...state.milestones];

        if (Array.isArray(parsedItems.habits)) {
            parsedItems.habits.forEach(h => {
                newHabits.push({
                    id: 'habit-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                    title: h.title,
                    target: h.target || 1,
                    current: 0,
                    unit: h.unit || 'vezes',
                    category: h.category || 'produtividade',
                    icon: h.icon || 'fa-bullseye',
                    streak: 0,
                    lastCompletedDate: ''
                });
                addedCount++;
            });
        }

        if (Array.isArray(parsedItems.tasks)) {
            parsedItems.tasks.forEach(t => {
                newTasks.push({
                    id: 'task-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                    title: t.title,
                    priority: t.priority || 'medium',
                    status: 'todo',
                    tag: t.tag || 'Geral',
                    createdAt: getTodayDateString()
                });
                addedCount++;
            });
        }

        if (Array.isArray(parsedItems.projects)) {
            parsedItems.projects.forEach(p => {
                const subtasks = Array.isArray(p.subtasks)
                    ? p.subtasks.map((st, i) => ({ id: 'sub-' + Date.now() + '-' + i, title: st, done: false }))
                    : [];

                newProjects.push({
                    id: 'proj-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                    title: p.title,
                    description: p.description || '',
                    status: 'in-progress',
                    tags: Array.isArray(p.tags) ? p.tags : [],
                    subtasks
                });
                addedCount++;
            });
        }

        if (Array.isArray(parsedItems.milestones)) {
            parsedItems.milestones.forEach(m => {
                const steps = Array.isArray(m.steps)
                    ? m.steps.map((st, i) => ({ id: 'milestone-step-' + Date.now() + '-' + i, title: st, done: false }))
                    : [];

                newMilestones.push({
                    id: 'milestone-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                    title: m.title,
                    targetDate: '',
                    category: m.category || 'carreira',
                    notes: m.notes || '',
                    steps
                });
                addedCount++;
            });
        }

        saveState({
            ...state,
            habits: newHabits,
            tasks: newTasks,
            projects: newProjects,
            milestones: newMilestones
        });

        triggerConfetti();
        showToast(`${addedCount} novos itens adicionados com sucesso pela IA! 🎉`, 'success');
    };

    // FORM SUBMIT HANDLERS
    const handleHabitFormSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const habitId = form.elements['habit-id'].value;
        const title = form.elements['habit-title'].value.trim();
        const target = parseInt(form.elements['habit-target'].value) || 1;
        const unit = form.elements['habit-unit'].value.trim() || 'unidades';
        const category = form.elements['habit-category'].value;
        const icon = form.elements['habit-icon'].value;

        if (activeHabitModal.isEdit && activeHabitModal.habit) {
            const habits = state.habits.map(h => {
                if (h.id === habitId) {
                    return { ...h, title, target, unit, category, icon };
                }
                return h;
            });
            saveState({ ...state, habits });
            showToast('Hábito atualizado.', 'success');
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
            saveState({ ...state, habits: [...state.habits, newHabit] });
            showToast('Hábito criado com sucesso!', 'success');
        }
        setActiveHabitModal({ open: false, isEdit: false, habit: null });
    };

    const handleTaskFormSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const taskId = form.elements['task-id'].value;
        const title = form.elements['task-title'].value.trim();
        const priority = form.elements['task-priority'].value;
        const status = form.elements['task-status'].value;
        const tag = form.elements['task-tag'].value.trim();

        if (activeTaskModal.isEdit && activeTaskModal.task) {
            const tasks = state.tasks.map(t => {
                if (t.id === taskId) {
                    return { ...t, title, priority, status, tag };
                }
                return t;
            });
            saveState({ ...state, tasks });
            showToast('Tarefa atualizada.', 'success');
        } else {
            const newTask = {
                id: 'task-' + Date.now(),
                title,
                priority,
                status,
                tag,
                createdAt: getTodayDateString()
            };
            saveState({ ...state, tasks: [...state.tasks, newTask] });
            showToast('Tarefa adicionada!', 'success');
        }
        setActiveTaskModal({ open: false, isEdit: false, task: null });
    };

    const handleProjectFormSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const projectId = form.elements['project-id'].value;
        const title = form.elements['project-title'].value.trim();
        const description = form.elements['project-description'].value.trim();
        const status = form.elements['project-status'].value;
        const tagsInput = form.elements['project-tags'].value.trim();
        const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [];

        // Build subtasks array
        const subtasks = subtaskTitles.map((titleText, i) => {
            // Find existing subtask to preserve its done status
            if (activeProjectModal.isEdit && activeProjectModal.project?.subtasks) {
                const existing = activeProjectModal.project.subtasks[i];
                if (existing && existing.title === titleText) {
                    return existing;
                }
            }
            return { id: 'sub-' + Date.now() + '-' + i, title: titleText, done: false };
        }).filter(sub => sub.title.trim());

        if (activeProjectModal.isEdit && activeProjectModal.project) {
            const projects = state.projects.map(p => {
                if (p.id === projectId) {
                    return { ...p, title, description, status, tags, subtasks };
                }
                return p;
            });
            saveState({ ...state, projects });
            showToast('Projeto atualizado.', 'success');
        } else {
            const newProj = {
                id: 'proj-' + Date.now(),
                title,
                description,
                status,
                tags,
                subtasks
            };
            saveState({ ...state, projects: [...state.projects, newProj] });
            showToast('Projeto adicionado!', 'success');
        }
        setActiveProjectModal({ open: false, isEdit: false, project: null });
    };

    const handleMilestoneFormSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const milestoneId = form.elements['milestone-id'].value;
        const title = form.elements['milestone-title'].value.trim();
        const targetDate = form.elements['milestone-target-date'].value;
        const category = form.elements['milestone-category'].value;
        const notes = form.elements['milestone-notes'].value.trim();

        // Build steps
        const steps = milestoneStepTitles.map((titleText, i) => {
            if (activeMilestoneModal.isEdit && activeMilestoneModal.milestone?.steps) {
                const existing = activeMilestoneModal.milestone.steps[i];
                if (existing && existing.title === titleText) {
                    return existing;
                }
            }
            return { id: 'milestone-step-' + Date.now() + '-' + i, title: titleText, done: false };
        }).filter(step => step.title.trim());

        if (activeMilestoneModal.isEdit && activeMilestoneModal.milestone) {
            const milestones = state.milestones.map(m => {
                if (m.id === milestoneId) {
                    return { ...m, title, targetDate, category, notes, steps };
                }
                return m;
            });
            saveState({ ...state, milestones });
            showToast('Grande meta atualizada.', 'success');
        } else {
            const newMilestone = {
                id: 'milestone-' + Date.now(),
                title,
                targetDate,
                category,
                notes,
                steps
            };
            saveState({ ...state, milestones: [...state.milestones, newMilestone] });
            showToast('Grande meta criada!', 'success');
        }
        setActiveMilestoneModal({ open: false, isEdit: false, milestone: null });
    };

    // Subtask lists helpers for modal forms
    const handleAddSubtaskField = () => {
        setSubtaskTitles(prev => [...prev, '']);
    };

    const handleRemoveSubtaskField = (index) => {
        setSubtaskTitles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubtaskValueChange = (index, value) => {
        setSubtaskTitles(prev => prev.map((title, i) => i === index ? value : title));
    };

    // Milestone steps helpers
    const handleAddMilestoneStepField = () => {
        setMilestoneStepTitles(prev => [...prev, '']);
    };

    const handleRemoveMilestoneStepField = (index) => {
        setMilestoneStepTitles(prev => prev.filter((_, i) => i !== index));
    };

    const handleMilestoneStepValueChange = (index, value) => {
        setMilestoneStepTitles(prev => prev.map((title, i) => i === index ? value : title));
    };

    // Trigger forms openings
    const openAddHabitModal = () => {
        setActiveHabitModal({ open: true, isEdit: false, habit: null });
    };

    const openEditHabitModal = (habit) => {
        setActiveHabitModal({ open: true, isEdit: true, habit });
    };

    const openAddTaskModal = () => {
        setActiveTaskModal({ open: true, isEdit: false, task: null });
    };

    const openEditTaskModal = (task) => {
        setActiveTaskModal({ open: true, isEdit: true, task });
    };

    const openAddProjectModal = () => {
        setSubtaskTitles(['']);
        setActiveProjectModal({ open: true, isEdit: false, project: null });
    };

    const openEditProjectModal = (project) => {
        const titles = project.subtasks ? project.subtasks.map(s => s.title) : [];
        setSubtaskTitles(titles.length > 0 ? titles : ['']);
        setActiveProjectModal({ open: true, isEdit: true, project });
    };

    const openAddMilestoneModal = () => {
        setMilestoneStepTitles(['']);
        setActiveMilestoneModal({ open: true, isEdit: false, milestone: null });
    };

    const openEditMilestoneModal = (milestone) => {
        const titles = milestone.steps ? milestone.steps.map(s => s.title) : [];
        setMilestoneStepTitles(titles.length > 0 ? titles : ['']);
        setActiveMilestoneModal({ open: true, isEdit: true, milestone });
    };

    // Title / Subtitle updates based on active tab
    const getPageHeader = () => {
        switch (activeTab) {
            case 'dashboard':
                return { title: 'Dashboard', subtitle: 'Visão geral do seu progresso, hábitos do dia e projetos ativos.' };
            case 'habits':
                return { title: 'Hábitos Diários', subtitle: 'Acompanhe e reforce as tarefas repetitivas do dia a dia.' };
            case 'tasks':
                return { title: 'Tarefas Diárias', subtitle: 'Quadro Kanban para organizar os afazeres rápidos do seu dia.' };
            case 'projects':
                return { title: 'Projetos & Ideias', subtitle: 'Painel Kanban para construir seus projetos em produção e novas ideias.' };
            case 'milestones':
                return { title: 'Grandes Metas', subtitle: 'Metas estratégicas de médio e longo prazo com planos de ação práticos.' };
            case 'analytics':
                return { title: 'Estatísticas & Análise de Progresso', subtitle: 'Métricas visuais do seu desempenho nos últimos dias.' };
            default:
                return { title: 'MetasTracker', subtitle: '' };
        }
    };

    const headerText = getPageHeader();

    return (
        <div className="app-container">
            <div className="app-body">
                {/* Sidebar Navigation */}
                <aside className="sidebar">
                    <div className="brand">
                        <div className="brand-logo">
                            <i className="fa-solid fa-bullseye"></i>
                        </div>
                        <div className="brand-text">
                            <h2>Metas<span>Tracker</span></h2>
                            <span className="brand-tagline">Conquiste Seus Objetivos</span>
                        </div>
                    </div>

                    <nav className="nav-menu">
                        <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleSwitchTab('dashboard')}>
                            <i className="fa-solid fa-chart-pie"></i>
                            <span>Dashboard</span>
                        </button>
                        <button className={`nav-item ${activeTab === 'habits' ? 'active' : ''}`} onClick={() => handleSwitchTab('habits')}>
                            <i className="fa-solid fa-fire"></i>
                            <span>Hábitos Diários</span>
                            <span className="badge">{habitsBadgeCount}</span>
                        </button>
                        <button className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => handleSwitchTab('tasks')}>
                            <i className="fa-solid fa-list-check"></i>
                            <span>Tarefas Diárias</span>
                            <span className="badge">{tasksBadgeCount}</span>
                        </button>
                        <button className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => handleSwitchTab('projects')}>
                            <i className="fa-solid fa-diagram-project"></i>
                            <span>Projetos & Ideias</span>
                            <span className="badge">{projectsBadgeCount}</span>
                        </button>
                        <button className={`nav-item ${activeTab === 'milestones' ? 'active' : ''}`} onClick={() => handleSwitchTab('milestones')}>
                            <i className="fa-solid fa-trophy"></i>
                            <span>Grandes Metas</span>
                        </button>
                        <button className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => handleSwitchTab('analytics')}>
                            <i className="fa-solid fa-chart-line"></i>
                            <span>Estatísticas</span>
                        </button>
                    </nav>

                    <div className="sidebar-footer">
                        <button className="btn-icon-label" title="Criar com IA Grátis" onClick={() => setIsAiModalOpen(true)}>
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                            <span>Assistente IA</span>
                        </button>
                        <button className="btn-icon-label" title="Alternar Tema" onClick={toggleTheme}>
                            <i className={`fa-solid ${state.theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
                            <span>{state.theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
                        </button>
                        <button className="btn-icon-label" title="Exportar/Importar Dados" onClick={() => setIsBackupModalOpen(true)}>
                            <i className="fa-solid fa-database"></i>
                            <span>Backup & Dados</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="main-content">
                    {/* Top Header */}
                    <header className="top-header">
                        <div className="header-title">
                            <h1>{headerText.title}</h1>
                            <p className="subtitle">{headerText.subtitle}</p>
                        </div>
                        <div className="header-actions">
                            <button className="btn btn-secondary" title="Criar itens automaticamente com IA" onClick={() => setIsAiModalOpen(true)}>
                                <i className="fa-solid fa-wand-magic-sparkles"></i> Assistente IA
                            </button>
                            <button className="btn btn-primary" onClick={() => {
                                if (activeTab === 'habits') openAddHabitModal();
                                else if (activeTab === 'tasks') openAddTaskModal();
                                else if (activeTab === 'projects') openAddProjectModal();
                                else if (activeTab === 'milestones') openAddMilestoneModal();
                                else openAddHabitModal(); // Fallback
                            }}>
                                <i className="fa-solid fa-plus"></i> Novo Item
                            </button>
                        </div>
                    </header>

                    {/* Active Tab Screen */}
                    {activeTab === 'dashboard' && (
                        <DashboardTab
                            state={state}
                            onAdjustHabit={handleAdjustHabit}
                            onEditHabit={openEditHabitModal}
                            onDeleteHabit={handleDeleteHabit}
                            onSwitchTab={handleSwitchTab}
                        />
                    )}
                    {activeTab === 'habits' && (
                        <HabitsTab
                            state={state}
                            onAdjustHabit={handleAdjustHabit}
                            onEditHabit={openEditHabitModal}
                            onDeleteHabit={handleDeleteHabit}
                            onAddHabitBtnClick={openAddHabitModal}
                        />
                    )}
                    {activeTab === 'tasks' && (
                        <TasksTab
                            state={state}
                            onMoveTask={handleMoveTask}
                            onEditTask={openEditTaskModal}
                            onDeleteTask={handleDeleteTask}
                            onAddTaskBtnClick={openAddTaskModal}
                        />
                    )}
                    {activeTab === 'projects' && (
                        <ProjectsTab
                            state={state}
                            onMoveProject={handleMoveProject}
                            onEditProject={openEditProjectModal}
                            onDeleteProject={handleDeleteProject}
                            onToggleSubtask={handleToggleSubtask}
                            onAddProjectBtnClick={openAddProjectModal}
                        />
                    )}
                    {activeTab === 'milestones' && (
                        <MilestonesTab
                            state={state}
                            onToggleMilestoneStep={handleToggleMilestoneStep}
                            onEditMilestone={openEditMilestoneModal}
                            onDeleteMilestone={handleDeleteMilestone}
                            onAddMilestoneBtnClick={openAddMilestoneModal}
                        />
                    )}
                    {activeTab === 'analytics' && (
                        <AnalyticsTab
                            state={state}
                        />
                    )}
                </main>
            </div>

            {/* AUXILIARY MODALS */}
            <AiAssistantModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                onAcceptAiItems={handleAcceptAiItems}
                showToast={showToast}
            />

            <BackupModal
                isOpen={isBackupModalOpen}
                onClose={() => setIsBackupModalOpen(false)}
                state={state}
                onImportState={handleImportState}
                onResetState={handleResetState}
                onClearState={handleClearState}
                getTodayDateString={getTodayDateString}
                showToast={showToast}
            />

            {/* HABIT ADD/EDIT MODAL */}
            {activeHabitModal.open && (
                <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && setActiveHabitModal({ open: false, isEdit: false, habit: null })}>
                    <div className="modal-card">
                        <div className="modal-header">
                            <h3>{activeHabitModal.isEdit ? 'Editar Hábito' : 'Novo Hábito / Meta Diária'}</h3>
                            <button className="modal-close" onClick={() => setActiveHabitModal({ open: false, isEdit: false, habit: null })}>&times;</button>
                        </div>
                        <form onSubmit={handleHabitFormSubmit}>
                            <input type="hidden" name="habit-id" defaultValue={activeHabitModal.habit?.id || ''} />
                            <div className="form-group">
                                <label htmlFor="habit-title">Nome do Hábito / Meta *</label>
                                <input
                                    type="text"
                                    name="habit-title"
                                    placeholder="Ex: Mandar currículos, Estudar React, Beber água"
                                    defaultValue={activeHabitModal.habit?.title || ''}
                                    required
                                />
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label htmlFor="habit-target">Meta Diária (Quantidade)</label>
                                    <input
                                        type="number"
                                        name="habit-target"
                                        min="1"
                                        defaultValue={activeHabitModal.habit?.target || 1}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="habit-unit">Unidade de Medida</label>
                                    <input
                                        type="text"
                                        name="habit-unit"
                                        placeholder="Ex: currículos, minutos, páginas"
                                        defaultValue={activeHabitModal.habit?.unit || 'unidades'}
                                    />
                                </div>
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label htmlFor="habit-category">Categoria</label>
                                    <select name="habit-category" defaultValue={activeHabitModal.habit?.category || 'produtividade'}>
                                        <option value="carreira">Carreira / Emprego</option>
                                        <option value="estudo">Estudo & Aprendizado</option>
                                        <option value="saude">Saúde & Bem-Estar</option>
                                        <option value="produtividade">Produtividade</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="habit-icon">Ícone Visual</label>
                                    <select name="habit-icon" defaultValue={activeHabitModal.habit?.icon || 'fa-bullseye'}>
                                        <option value="fa-file-lines">📄 Currículo / Documento</option>
                                        <option value="fa-laptop-code">💻 Programação / Código</option>
                                        <option value="fa-book">📚 Leitura / Livro</option>
                                        <option value="fa-dumbbell">🏋️ Exercício / Saúde</option>
                                        <option value="fa-briefcase">💼 Trabalho / Carreira</option>
                                        <option value="fa-bullseye">🎯 Foco / Meta</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setActiveHabitModal({ open: false, isEdit: false, habit: null })}>Cancelar</button>
                                <button type="submit" class="btn btn-primary">Salvar Hábito</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TASK ADD/EDIT MODAL */}
            {activeTaskModal.open && (
                <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && setActiveTaskModal({ open: false, isEdit: false, task: null })}>
                    <div className="modal-card">
                        <div className="modal-header">
                            <h3>{activeTaskModal.isEdit ? 'Editar Tarefa' : 'Nova Tarefa Diária'}</h3>
                            <button className="modal-close" onClick={() => setActiveTaskModal({ open: false, isEdit: false, task: null })}>&times;</button>
                        </div>
                        <form onSubmit={handleTaskFormSubmit}>
                            <input type="hidden" name="task-id" defaultValue={activeTaskModal.task?.id || ''} />
                            <div className="form-group">
                                <label htmlFor="task-title">Título da Tarefa *</label>
                                <input
                                    type="text"
                                    name="task-title"
                                    placeholder="Ex: Enviar relatório mensal, Comprar café, Ligar para cliente"
                                    defaultValue={activeTaskModal.task?.title || ''}
                                    required
                                />
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label htmlFor="task-priority">Prioridade</label>
                                    <select name="task-priority" defaultValue={activeTaskModal.task?.priority || 'medium'}>
                                        <option value="high">🔥 Alta Prioridade</option>
                                        <option value="medium">⚡ Média Prioridade</option>
                                        <option value="low">🌱 Baixa Prioridade</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="task-status">Status Inicial</label>
                                    <select name="task-status" defaultValue={activeTaskModal.task?.status || 'todo'}>
                                        <option value="todo">📋 A Fazer</option>
                                        <option value="in-progress">⏳ Em Andamento</option>
                                        <option value="done">✅ Concluída</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="task-tag">Categoria / Tag (Opcional)</label>
                                <input
                                    type="text"
                                    name="task-tag"
                                    placeholder="Ex: Trabalho, Pessoal, Urgente"
                                    defaultValue={activeTaskModal.task?.tag || ''}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setActiveTaskModal({ open: false, isEdit: false, task: null })}>Cancelar</button>
                                <button type="submit" class="btn btn-primary">Salvar Tarefa</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* PROJECT ADD/EDIT MODAL */}
            {activeProjectModal.open && (
                <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && setActiveProjectModal({ open: false, isEdit: false, project: null })}>
                    <div className="modal-card">
                        <div className="modal-header">
                            <h3>{activeProjectModal.isEdit ? 'Editar Projeto' : 'Novo Projeto / Ideia'}</h3>
                            <button className="modal-close" onClick={() => setActiveProjectModal({ open: false, isEdit: false, project: null })}>&times;</button>
                        </div>
                        <form onSubmit={handleProjectFormSubmit}>
                            <input type="hidden" name="project-id" defaultValue={activeProjectModal.project?.id || ''} />
                            <div className="form-group">
                                <label htmlFor="project-title">Nome do Projeto *</label>
                                <input
                                    type="text"
                                    name="project-title"
                                    placeholder="Ex: MetasTracker App, Portfólio 2026, SaaS de Vendas"
                                    defaultValue={activeProjectModal.project?.title || ''}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="project-description">Descrição / Conceito</label>
                                <textarea
                                    name="project-description"
                                    rows="3"
                                    placeholder="Descreva a ideia do projeto, objetivos e diferencial..."
                                    defaultValue={activeProjectModal.project?.description || ''}
                                ></textarea>
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label htmlFor="project-status">Status Atual</label>
                                    <select name="project-status" defaultValue={activeProjectModal.project?.status || 'idea'}>
                                        <option value="idea">💡 Ideia em Mente</option>
                                        <option value="in-progress">⚡ Em Produção</option>
                                        <option value="completed">✅ Concluído / Lançado</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="project-tags">Tecnologias / Tags (separadas por vírgula)</label>
                                    <input
                                        type="text"
                                        name="project-tags"
                                        placeholder="HTML, CSS, Node.js, AI, Design"
                                        defaultValue={activeProjectModal.project?.tags ? activeProjectModal.project.tags.join(', ') : ''}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Lista de Subtarefas (Checklist)</label>
                                <div id="subtask-inputs-list">
                                    {subtaskTitles.map((title, idx) => (
                                        <div className="dynamic-input-row" key={idx}>
                                            <input
                                                type="text"
                                                className="subtask-input-val"
                                                placeholder="Ex: Criar tela inicial"
                                                value={title}
                                                onChange={(e) => handleSubtaskValueChange(idx, e.target.value)}
                                            />
                                            <button type="button" className="btn-icon" onClick={() => handleRemoveSubtaskField(idx)}>&times;</button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" className="btn btn-secondary btn-sm mt-2" onClick={handleAddSubtaskField}>
                                    <i className="fa-solid fa-plus"></i> Adicionar Subtarefa
                                </button>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setActiveProjectModal({ open: false, isEdit: false, project: null })}>Cancelar</button>
                                <button type="submit" class="btn btn-primary">Salvar Projeto</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MILESTONE ADD/EDIT MODAL */}
            {activeMilestoneModal.open && (
                <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && setActiveMilestoneModal({ open: false, isEdit: false, milestone: null })}>
                    <div className="modal-card">
                        <div className="modal-header">
                            <h3>{activeMilestoneModal.isEdit ? 'Editar Grande Meta' : 'Nova Grande Meta'}</h3>
                            <button className="modal-close" onClick={() => setActiveMilestoneModal({ open: false, isEdit: false, milestone: null })}>&times;</button>
                        </div>
                        <form onSubmit={handleMilestoneFormSubmit}>
                            <input type="hidden" name="milestone-id" defaultValue={activeMilestoneModal.milestone?.id || ''} />
                            <div className="form-group">
                                <label htmlFor="milestone-title">Título da Meta *</label>
                                <input
                                    type="text"
                                    name="milestone-title"
                                    placeholder="Ex: Conseguir um Emprego Melhor como Dev, Certificação AWS"
                                    defaultValue={activeMilestoneModal.milestone?.title || ''}
                                    required
                                />
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label htmlFor="milestone-target-date">Data Alvo / Prazo Desejado</label>
                                    <input
                                        type="date"
                                        name="milestone-target-date"
                                        defaultValue={activeMilestoneModal.milestone?.targetDate || ''}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="milestone-category">Categoria</label>
                                    <select name="milestone-category" defaultValue={activeMilestoneModal.milestone?.category || 'carreira'}>
                                        <option value="carreira">Carreira & Profissional</option>
                                        <option value="financas">Finanças & Economia</option>
                                        <option value="conhecimento">Conhecimento & Estudos</option>
                                        <option value="pessoal">Projeto Pessoal & Vida</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="milestone-notes">Plano de Ação / Anotações Estratégicas</label>
                                <textarea
                                    name="milestone-notes"
                                    rows="3"
                                    placeholder="O que você precisa fazer para alcançar esta meta? (Ex: Ajustar currículo, aplicar para 50 vagas, treinar entrevistas)"
                                    defaultValue={activeMilestoneModal.milestone?.notes || ''}
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Etapas de Conclusão (Checklist)</label>
                                <div id="milestone-step-inputs-list">
                                    {milestoneStepTitles.map((title, idx) => (
                                        <div className="dynamic-input-row" key={idx}>
                                            <input
                                                type="text"
                                                className="milestone-step-input-val"
                                                placeholder="Ex: Passo de ação..."
                                                value={title}
                                                onChange={(e) => handleMilestoneStepValueChange(idx, e.target.value)}
                                            />
                                            <button type="button" className="btn-icon" onClick={() => handleRemoveMilestoneStepField(idx)}>&times;</button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" className="btn btn-secondary btn-sm mt-2" onClick={handleAddMilestoneStepField}>
                                    <i className="fa-solid fa-plus"></i> Adicionar Etapa
                                </button>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setActiveMilestoneModal({ open: false, isEdit: false, milestone: null })}>Cancelar</button>
                                <button type="submit" class="btn btn-primary">Salvar Meta</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TOAST SYSTEM RENDERING */}
            <div id="toast-container" className="toast-container">
                {toasts.map(toast => {
                    let icon = 'fa-circle-info';
                    if (toast.type === 'success') icon = 'fa-circle-check';
                    if (toast.type === 'warning') icon = 'fa-triangle-exclamation';

                    return (
                        <div key={toast.id} className={`toast toast-${toast.type}`} style={{ opacity: 1, transform: 'translateX(0)' }}>
                            <i className={`fa-solid ${icon}`}></i>
                            <span>{toast.message}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
