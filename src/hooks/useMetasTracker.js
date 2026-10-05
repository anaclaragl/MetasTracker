import { useState, useEffect, useCallback } from 'react';
import { getTodayDateString, getYesterdayDateString } from '../utils/dateUtils';
import { triggerConfetti } from '../utils/confetti';

const STORAGE_KEY = 'metas_tracker_state';

const DEFAULT_STATE = {
    theme: 'dark',
    habits: [
        {
            id: 'habit-1',
            title: 'Mandar Curriculos',
            target: 5,
            current: 2,
            unit: 'curriculos',
            category: 'carreira',
            icon: 'fa-file-lines',
            streak: 4,
            lastCompletedDate: getTodayDateString()
        },
        {
            id: 'habit-2',
            title: 'Estudar Programacao / IA',
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
            title: 'Exercicio Fisico',
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
            description: 'Plataforma completa para gerenciar rotinas diarias, ideias de softwares e grandes objetivos de carreira.',
            status: 'in-progress',
            tags: ['HTML5', 'CSS3', 'JavaScript'],
            subtasks: [
                { id: 'sub-1', title: 'Criar estrutura e layout responsivo', done: true },
                { id: 'sub-2', title: 'Implementar salvamento no LocalStorage', done: true },
                { id: 'sub-3', title: 'Adicionar quadro Kanban interativo', done: true },
                { id: 'sub-4', title: 'Incluir graficos de desempenho semanal', done: false }
            ]
        },
        {
            id: 'proj-2',
            title: 'Novo Portfolio 2026',
            description: 'Site pessoal de alta estetica destacando principais projetos e casos de sucesso.',
            status: 'idea',
            tags: ['UX/UI', 'Portfolio', 'Fullstack'],
            subtasks: [
                { id: 'sub-201', title: 'Desenhar prototipo no Figma', done: false },
                { id: 'sub-202', title: 'Escrever textos e descricoes dos projetos', done: false }
            ]
        },
        {
            id: 'proj-3',
            title: 'Automacao de Tarefas em Python',
            description: 'Script para envio de relatorios e busca de oportunidades de emprego.',
            status: 'completed',
            tags: ['Python', 'Automacao'],
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
            notes: 'Focar em vagas que paguem melhor, permitam trabalho remoto e aprendizado continuo.',
            steps: [
                { id: 'step-1', title: 'Atualizar perfil do LinkedIn e Curriculo', done: true },
                { id: 'step-2', title: 'Mandar 5 curriculos personalizados por dia', done: true },
                { id: 'step-3', title: 'Desenvolver e lancar 2 projetos no GitHub', done: false },
                { id: 'step-4', title: 'Treinar 20 perguntas de entrevista tecnica', done: false }
            ]
        },
        {
            id: 'milestone-2',
            title: 'Obter Certificacao Profissional Cloud / DevOps',
            targetDate: '2026-12-15',
            category: 'conhecimento',
            notes: 'Estudar 1 hora diaria para dominar os conceitos fundamentais e simulados.',
            steps: [
                { id: 'step-201', title: 'Concluir curso preparatorio online', done: true },
                { id: 'step-202', title: 'Realizar 3 simulados com pontuacao > 80%', done: false },
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
            title: 'Revisar anotacoes de estudo de IA',
            priority: 'low',
            status: 'done',
            tag: 'Estudo',
            createdAt: getTodayDateString()
        }
    ],
    dailyLog: {}
};

export function useMetasTracker() {
    const [state, setState] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (!Array.isArray(parsed.tasks)) parsed.tasks = [];
                if (!Array.isArray(parsed.habits)) parsed.habits = [];
                if (!Array.isArray(parsed.projects)) parsed.projects = [];
                if (!Array.isArray(parsed.milestones)) parsed.milestones = [];
                if (!parsed.dailyLog) parsed.dailyLog = {};

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
            console.error('Error loading state from localStorage:', e);
        }

        const initialState = JSON.parse(JSON.stringify(DEFAULT_STATE));
        const today = getTodayDateString();
        initialState.lastOpenedDay = today;
        initialState.dailyLog = { [today]: 4 };
        return initialState;
    });

    const [toasts, setToasts] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmLabel: 'Confirmar',
        isDanger: false,
        onConfirm: null
    });

    const saveState = useCallback((newState) => {
        setState(newState);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        } catch (e) {
            console.error('Error saving state to localStorage:', e);
        }
    }, []);

    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now() + '-' + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3300);
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const askConfirmation = useCallback(({ title, message, confirmLabel = 'Excluir', isDanger = true, onConfirm }) => {
        setConfirmDialog({
            isOpen: true,
            title,
            message,
            confirmLabel,
            isDanger,
            onConfirm: () => {
                onConfirm();
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            }
        });
    }, []);

    const closeConfirmation = useCallback(() => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
    }, []);

    // Theme toggle
    const toggleTheme = useCallback(() => {
        setState(prev => {
            const newTheme = prev.theme === 'dark' ? 'light' : 'dark';
            const updated = { ...prev, theme: newTheme };
            saveState(updated);
            return updated;
        });
    }, [saveState]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', state.theme || 'dark');
    }, [state.theme]);

    // Adjust habit current counter
    const handleAdjustHabit = useCallback((habitId, delta) => {
        setState(prev => {
            let triggeredToast = null;
            const updatedHabits = prev.habits.map(h => {
                if (h.id === habitId) {
                    const previous = h.current;
                    const next = Math.max(0, h.current + delta);
                    let streak = h.streak || 0;
                    let lastCompletedDate = h.lastCompletedDate;
                    const today = getTodayDateString();

                    if (next >= h.target && previous < h.target) {
                        if (lastCompletedDate !== today) {
                            streak += 1;
                            lastCompletedDate = today;
                        }
                        triggerConfetti();
                        triggeredToast = `Meta "${h.title}" alcancada hoje!`;
                    }
                    return { ...h, current: next, streak, lastCompletedDate };
                }
                return h;
            });

            const today = getTodayDateString();
            const dailyLog = { ...(prev.dailyLog || {}) };
            dailyLog[today] = Math.max(0, (dailyLog[today] || 0) + (delta > 0 ? 1 : -1));

            const newState = { ...prev, habits: updatedHabits, dailyLog };
            saveState(newState);

            if (triggeredToast) {
                showToast(triggeredToast, 'success');
            }
            return newState;
        });
    }, [saveState, showToast]);

    // Save habit (create or edit)
    const handleSaveHabit = useCallback((habitData) => {
        setState(prev => {
            let updatedHabits;
            if (habitData.id) {
                updatedHabits = prev.habits.map(h => h.id === habitData.id ? { ...h, ...habitData } : h);
                showToast('Habito atualizado com sucesso.', 'success');
            } else {
                const newHabit = {
                    id: 'habit-' + Date.now(),
                    ...habitData,
                    current: 0,
                    streak: 0,
                    lastCompletedDate: ''
                };
                updatedHabits = [...prev.habits, newHabit];
                showToast('Habito criado com sucesso!', 'success');
            }
            const newState = { ...prev, habits: updatedHabits };
            saveState(newState);
            return newState;
        });
    }, [saveState, showToast]);

    // Delete habit
    const handleDeleteHabit = useCallback((habitId) => {
        const habit = state.habits.find(h => h.id === habitId);
        askConfirmation({
            title: 'Excluir Habito',
            message: `Tem certeza que deseja excluir o habito "${habit ? habit.title : ''}"?`,
            confirmLabel: 'Excluir Habito',
            isDanger: true,
            onConfirm: () => {
                setState(prev => {
                    const habits = prev.habits.filter(h => h.id !== habitId);
                    const newState = { ...prev, habits };
                    saveState(newState);
                    showToast('Habito removido com sucesso.', 'info');
                    return newState;
                });
            }
        });
    }, [state.habits, askConfirmation, saveState, showToast]);

    // Save task (create or edit)
    const handleSaveTask = useCallback((taskData) => {
        setState(prev => {
            let updatedTasks;
            if (taskData.id) {
                updatedTasks = prev.tasks.map(t => t.id === taskData.id ? { ...t, ...taskData } : t);
                showToast('Tarefa atualizada com sucesso.', 'success');
            } else {
                const newTask = {
                    id: 'task-' + Date.now(),
                    ...taskData,
                    createdAt: getTodayDateString()
                };
                updatedTasks = [...prev.tasks, newTask];
                showToast('Tarefa adicionada com sucesso!', 'success');
            }
            const newState = { ...prev, tasks: updatedTasks };
            saveState(newState);
            return newState;
        });
    }, [saveState, showToast]);

    // Move task status in Kanban
    const handleMoveTask = useCallback((taskId, newStatus) => {
        setState(prev => {
            let completedTitle = null;
            const tasks = prev.tasks.map(t => {
                if (t.id === taskId) {
                    if (newStatus === 'done' && t.status !== 'done') {
                        triggerConfetti();
                        completedTitle = t.title;
                    }
                    return { ...t, status: newStatus };
                }
                return t;
            });
            const newState = { ...prev, tasks };
            saveState(newState);
            if (completedTitle) {
                showToast(`Tarefa "${completedTitle}" concluida!`, 'success');
            }
            return newState;
        });
    }, [saveState, showToast]);

    // Delete task
    const handleDeleteTask = useCallback((taskId) => {
        const task = state.tasks.find(t => t.id === taskId);
        askConfirmation({
            title: 'Excluir Tarefa',
            message: `Tem certeza que deseja excluir a tarefa "${task ? task.title : ''}"?`,
            confirmLabel: 'Excluir Tarefa',
            isDanger: true,
            onConfirm: () => {
                setState(prev => {
                    const tasks = prev.tasks.filter(t => t.id !== taskId);
                    const newState = { ...prev, tasks };
                    saveState(newState);
                    showToast('Tarefa removida.', 'info');
                    return newState;
                });
            }
        });
    }, [state.tasks, askConfirmation, saveState, showToast]);

    // Save project (create or edit)
    const handleSaveProject = useCallback((projectData) => {
        setState(prev => {
            let updatedProjects;
            if (projectData.id) {
                updatedProjects = prev.projects.map(p => p.id === projectData.id ? { ...p, ...projectData } : p);
                showToast('Projeto atualizado com sucesso.', 'success');
            } else {
                const newProject = {
                    id: 'proj-' + Date.now(),
                    ...projectData
                };
                updatedProjects = [...prev.projects, newProject];
                showToast('Projeto adicionado com sucesso!', 'success');
            }
            const newState = { ...prev, projects: updatedProjects };
            saveState(newState);
            return newState;
        });
    }, [saveState, showToast]);

    // Move project status in Kanban
    const handleMoveProject = useCallback((projectId, newStatus) => {
        setState(prev => {
            let completedTitle = null;
            const projects = prev.projects.map(p => {
                if (p.id === projectId) {
                    if (newStatus === 'completed' && p.status !== 'completed') {
                        triggerConfetti();
                        completedTitle = p.title;
                    }
                    return { ...p, status: newStatus };
                }
                return p;
            });
            const newState = { ...prev, projects };
            saveState(newState);
            if (completedTitle) {
                showToast(`Projeto "${completedTitle}" concluido!`, 'success');
            }
            return newState;
        });
    }, [saveState, showToast]);

    // Toggle subtask in project
    const handleToggleSubtask = useCallback((projectId, subtaskId) => {
        setState(prev => {
            const projects = prev.projects.map(p => {
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
            const newState = { ...prev, projects };
            saveState(newState);
            return newState;
        });
    }, [saveState]);

    // Delete project
    const handleDeleteProject = useCallback((projectId) => {
        const proj = state.projects.find(p => p.id === projectId);
        askConfirmation({
            title: 'Excluir Projeto',
            message: `Tem certeza que deseja excluir o projeto "${proj ? proj.title : ''}"?`,
            confirmLabel: 'Excluir Projeto',
            isDanger: true,
            onConfirm: () => {
                setState(prev => {
                    const projects = prev.projects.filter(p => p.id !== projectId);
                    const newState = { ...prev, projects };
                    saveState(newState);
                    showToast('Projeto removido.', 'info');
                    return newState;
                });
            }
        });
    }, [state.projects, askConfirmation, saveState, showToast]);

    // Save milestone (create or edit)
    const handleSaveMilestone = useCallback((milestoneData) => {
        setState(prev => {
            let updatedMilestones;
            if (milestoneData.id) {
                updatedMilestones = prev.milestones.map(m => m.id === milestoneData.id ? { ...m, ...milestoneData } : m);
                showToast('Grande meta atualizada com sucesso.', 'success');
            } else {
                const newMilestone = {
                    id: 'milestone-' + Date.now(),
                    ...milestoneData
                };
                updatedMilestones = [...prev.milestones, newMilestone];
                showToast('Grande meta criada com sucesso!', 'success');
            }
            const newState = { ...prev, milestones: updatedMilestones };
            saveState(newState);
            return newState;
        });
    }, [saveState, showToast]);

    // Toggle milestone step
    const handleToggleMilestoneStep = useCallback((milestoneId, stepId) => {
        setState(prev => {
            let completedMilestoneTitle = null;
            const milestones = prev.milestones.map(m => {
                if (m.id === milestoneId) {
                    const steps = m.steps.map(s => s.id === stepId ? { ...s, done: !s.done } : s);
                    const allDone = steps.length > 0 && steps.every(s => s.done);
                    const hadUndone = m.steps.some(s => !s.done);
                    if (allDone && hadUndone) {
                        triggerConfetti();
                        completedMilestoneTitle = m.title;
                    }
                    return { ...m, steps };
                }
                return m;
            });
            const newState = { ...prev, milestones };
            saveState(newState);
            if (completedMilestoneTitle) {
                showToast(`Meta estrategica "${completedMilestoneTitle}" 100% concluida!`, 'success');
            }
            return newState;
        });
    }, [saveState, showToast]);

    // Delete milestone
    const handleDeleteMilestone = useCallback((milestoneId) => {
        const milestone = state.milestones.find(m => m.id === milestoneId);
        askConfirmation({
            title: 'Excluir Grande Meta',
            message: `Tem certeza que deseja excluir a meta "${milestone ? milestone.title : ''}"?`,
            confirmLabel: 'Excluir Meta',
            isDanger: true,
            onConfirm: () => {
                setState(prev => {
                    const milestones = prev.milestones.filter(m => m.id !== milestoneId);
                    const newState = { ...prev, milestones };
                    saveState(newState);
                    showToast('Meta removida.', 'info');
                    return newState;
                });
            }
        });
    }, [state.milestones, askConfirmation, saveState, showToast]);

    // Reset / Import / Clear
    const handleImportState = useCallback((importedState) => {
        saveState(importedState);
        showToast('Backup restaurado com sucesso!', 'success');
    }, [saveState, showToast]);

    const handleResetState = useCallback(() => {
        const defaultState = JSON.parse(JSON.stringify(DEFAULT_STATE));
        defaultState.lastOpenedDay = getTodayDateString();
        defaultState.dailyLog = { [getTodayDateString()]: 4 };
        saveState(defaultState);
        showToast('Dados restaurados para o padrao inicial.', 'info');
    }, [saveState, showToast]);

    const handleClearState = useCallback(() => {
        const clearedState = {
            ...state,
            habits: [],
            tasks: [],
            projects: [],
            milestones: [],
            dailyLog: {}
        };
        saveState(clearedState);
        showToast('Todos os dados foram limpos.', 'warning');
    }, [state, saveState, showToast]);

    // AI generated items batch import
    const handleAcceptAiItems = useCallback((parsedItems) => {
        setState(prev => {
            let addedCount = 0;
            const newHabits = [...prev.habits];
            const newTasks = [...prev.tasks];
            const newProjects = [...prev.projects];
            const newMilestones = [...prev.milestones];

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

            const newState = {
                ...prev,
                habits: newHabits,
                tasks: newTasks,
                projects: newProjects,
                milestones: newMilestones
            };
            saveState(newState);

            triggerConfetti();
            showToast(`${addedCount} novos itens adicionados com sucesso pela IA!`, 'success');
            return newState;
        });
    }, [saveState, showToast]);

    return {
        state,
        toasts,
        confirmDialog,
        toggleTheme,
        showToast,
        dismissToast,
        closeConfirmation,
        handleAdjustHabit,
        handleSaveHabit,
        handleDeleteHabit,
        handleSaveTask,
        handleMoveTask,
        handleDeleteTask,
        handleSaveProject,
        handleMoveProject,
        handleToggleSubtask,
        handleDeleteProject,
        handleSaveMilestone,
        handleToggleMilestoneStep,
        handleDeleteMilestone,
        handleImportState,
        handleResetState,
        handleClearState,
        handleAcceptAiItems
    };
}
