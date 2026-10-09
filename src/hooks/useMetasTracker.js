import { useState, useEffect, useCallback } from 'react';
import { getTodayDateString, getYesterdayDateString } from '../utils/dateUtils';
import { triggerConfetti } from '../utils/confetti';
import { normalizeCategory } from '../utils/categoryUtils';

const STORAGE_KEY = 'metas_tracker_state';

const DEFAULT_STATE = {
    theme: 'dark',
    habits: [
        {
            id: 'habit-1',
            title: 'Send Resumes',
            target: 5,
            current: 2,
            unit: 'resumes',
            category: 'career',
            icon: 'fa-file-lines',
            streak: 4,
            lastCompletedDate: getTodayDateString()
        },
        {
            id: 'habit-2',
            title: 'Study Programming / AI',
            target: 60,
            current: 60,
            unit: 'minutes',
            category: 'study',
            icon: 'fa-laptop-code',
            streak: 7,
            lastCompletedDate: getTodayDateString()
        },
        {
            id: 'habit-3',
            title: 'Physical Exercise',
            target: 30,
            current: 0,
            unit: 'minutes',
            category: 'health',
            icon: 'fa-dumbbell',
            streak: 2,
            lastCompletedDate: getYesterdayDateString()
        }
    ],
    projects: [
        {
            id: 'proj-1',
            title: 'MetasTracker WebApp',
            description: 'Modern productivity dashboard to manage daily routines, software concepts, and career milestones.',
            status: 'in-progress',
            tags: ['HTML5', 'CSS3', 'JavaScript'],
            subtasks: [
                { id: 'sub-1', title: 'Build responsive layout and design', done: true },
                { id: 'sub-2', title: 'Implement LocalStorage state persistence', done: true },
                { id: 'sub-3', title: 'Add interactive Kanban workflows', done: true },
                { id: 'sub-4', title: 'Incorporate weekly performance analytics', done: false }
            ]
        },
        {
            id: 'proj-2',
            title: 'Portfolio Redesign 2026',
            description: 'Clean engineering portfolio showcasing production projects, architecture case studies, and achievements.',
            status: 'idea',
            tags: ['React', 'UI/UX', 'Fullstack'],
            subtasks: [
                { id: 'sub-201', title: 'Create Figma design mockup', done: false },
                { id: 'sub-202', title: 'Draft project descriptions and architecture docs', done: false }
            ]
        },
        {
            id: 'proj-3',
            title: 'Python Job Search Automation',
            description: 'Automated background script for tracking relevant software engineering roles.',
            status: 'completed',
            tags: ['Python', 'Automation'],
            subtasks: [
                { id: 'sub-301', title: 'Build scraping and filtering pipeline', done: true },
                { id: 'sub-302', title: 'Connect automated email notifications', done: true }
            ]
        }
    ],
    milestones: [
        {
            id: 'milestone-1',
            title: 'Land a Senior Software Engineering Role',
            targetDate: '2026-11-30',
            category: 'career',
            notes: 'Target high-impact remote roles with strong engineering culture and continuous learning.',
            steps: [
                { id: 'step-1', title: 'Optimize LinkedIn profile and technical resume', done: true },
                { id: 'step-2', title: 'Submit 5 tailored applications daily', done: true },
                { id: 'step-3', title: 'Publish 2 open-source showcase repositories', done: false },
                { id: 'step-4', title: 'Practice 20 core system design and coding questions', done: false }
            ]
        },
        {
            id: 'milestone-2',
            title: 'Earn Professional Cloud / DevOps Certification',
            targetDate: '2026-12-15',
            category: 'knowledge',
            notes: 'Study 1 hour every day to master cloud architecture fundamentals and mock exams.',
            steps: [
                { id: 'step-201', title: 'Complete comprehensive online prep course', done: true },
                { id: 'step-202', title: 'Pass 3 practice exams with score above 80%', done: false },
                { id: 'step-203', title: 'Schedule and sit for official certification exam', done: false }
            ]
        }
    ],
    tasks: [
        {
            id: 'task-1',
            title: 'Respond to recruiter inquiries on LinkedIn',
            priority: 'high',
            status: 'todo',
            tag: 'Career',
            createdAt: getTodayDateString()
        },
        {
            id: 'task-2',
            title: 'Configure Gemini API key in MetasTracker',
            priority: 'medium',
            status: 'in-progress',
            tag: 'Setup',
            createdAt: getTodayDateString()
        },
        {
            id: 'task-3',
            title: 'Review AI system architecture study notes',
            priority: 'low',
            status: 'done',
            tag: 'Study',
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

                // Automatically normalize any existing categories to English
                parsed.habits.forEach(h => {
                    if (h.category) h.category = normalizeCategory(h.category);
                });
                parsed.milestones.forEach(m => {
                    if (m.category) m.category = normalizeCategory(m.category);
                });

                // If existing stored data still has Portuguese seed items, update them cleanly to English
                if (parsed.habits.some(h => h.title === 'Mandar Curriculos')) {
                    parsed.habits = parsed.habits.map(h => {
                        if (h.title === 'Mandar Curriculos') return { ...h, title: 'Send Resumes', unit: 'resumes' };
                        if (h.title === 'Estudar Programacao / IA') return { ...h, title: 'Study Programming / AI', unit: 'minutes' };
                        if (h.title === 'Exercicio Fisico') return { ...h, title: 'Physical Exercise', unit: 'minutes' };
                        return h;
                    });
                }
                if (parsed.tasks.some(t => t.title === 'Responder e-mails de recrutadores no LinkedIn')) {
                    parsed.tasks = parsed.tasks.map(t => {
                        if (t.title === 'Responder e-mails de recrutadores no LinkedIn') return { ...t, title: 'Respond to recruiter inquiries on LinkedIn', tag: 'Career' };
                        if (t.title === 'Configurar chave API Gemini no MetasTracker') return { ...t, title: 'Configure Gemini API key in MetasTracker', tag: 'Setup' };
                        if (t.title === 'Revisar anotacoes de estudo de IA') return { ...t, title: 'Review AI system architecture study notes', tag: 'Study' };
                        return t;
                    });
                }
                if (parsed.milestones.some(m => m.title === 'Conseguir um Emprego Melhor em Tecnologia')) {
                    parsed.milestones = parsed.milestones.map(m => {
                        if (m.title === 'Conseguir um Emprego Melhor em Tecnologia') {
                            return {
                                ...m,
                                title: 'Land a Senior Software Engineering Role',
                                notes: 'Target high-impact remote roles with strong engineering culture and continuous learning.',
                                steps: (m.steps || []).map((s, i) => {
                                    const defaultSteps = [
                                        'Optimize LinkedIn profile and technical resume',
                                        'Submit 5 tailored applications daily',
                                        'Publish 2 open-source showcase repositories',
                                        'Practice 20 core system design and coding questions'
                                    ];
                                    return { ...s, title: defaultSteps[i] || s.title };
                                })
                            };
                        }
                        if (m.title === 'Obter Certificacao Profissional Cloud / DevOps') {
                            return {
                                ...m,
                                title: 'Earn Professional Cloud / DevOps Certification',
                                notes: 'Study 1 hour every day to master cloud architecture fundamentals and mock exams.',
                                steps: (m.steps || []).map((s, i) => {
                                    const defaultSteps = [
                                        'Complete comprehensive online prep course',
                                        'Pass 3 practice exams with score above 80%',
                                        'Schedule and sit for official certification exam'
                                    ];
                                    return { ...s, title: defaultSteps[i] || s.title };
                                })
                            };
                        }
                        return m;
                    });
                }
                if (parsed.projects.some(p => p.title === 'Novo Portfolio 2026')) {
                    parsed.projects = parsed.projects.map(p => {
                        if (p.title === 'Novo Portfolio 2026') return { ...p, title: 'Portfolio Redesign 2026', description: 'Clean engineering portfolio showcasing production projects, architecture case studies, and achievements.' };
                        if (p.title === 'Automacao de Tarefas em Python') return { ...p, title: 'Python Job Search Automation', description: 'Automated background script for tracking relevant software engineering roles.' };
                        return p;
                    });
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
        confirmLabel: 'Confirm',
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

    const askConfirmation = useCallback(({ title, message, confirmLabel = 'Delete', isDanger = true, onConfirm }) => {
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
                        triggeredToast = `Habit "${h.title}" goal reached today!`;
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
                showToast('Habit updated successfully.', 'success');
            } else {
                const newHabit = {
                    id: 'habit-' + Date.now(),
                    ...habitData,
                    current: 0,
                    streak: 0,
                    lastCompletedDate: ''
                };
                updatedHabits = [...prev.habits, newHabit];
                showToast('Habit created successfully!', 'success');
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
            title: 'Delete Habit',
            message: `Are you sure you want to delete "${habit ? habit.title : ''}"?`,
            confirmLabel: 'Delete Habit',
            isDanger: true,
            onConfirm: () => {
                setState(prev => {
                    const habits = prev.habits.filter(h => h.id !== habitId);
                    const newState = { ...prev, habits };
                    saveState(newState);
                    showToast('Habit removed.', 'info');
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
                showToast('Task updated successfully.', 'success');
            } else {
                const newTask = {
                    id: 'task-' + Date.now(),
                    ...taskData,
                    createdAt: getTodayDateString()
                };
                updatedTasks = [...prev.tasks, newTask];
                showToast('Task added successfully!', 'success');
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
                showToast(`Task "${completedTitle}" completed!`, 'success');
            }
            return newState;
        });
    }, [saveState, showToast]);

    // Delete task
    const handleDeleteTask = useCallback((taskId) => {
        const task = state.tasks.find(t => t.id === taskId);
        askConfirmation({
            title: 'Delete Task',
            message: `Are you sure you want to delete the task "${task ? task.title : ''}"?`,
            confirmLabel: 'Delete Task',
            isDanger: true,
            onConfirm: () => {
                setState(prev => {
                    const tasks = prev.tasks.filter(t => t.id !== taskId);
                    const newState = { ...prev, tasks };
                    saveState(newState);
                    showToast('Task removed.', 'info');
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
                showToast('Project updated successfully.', 'success');
            } else {
                const newProject = {
                    id: 'proj-' + Date.now(),
                    ...projectData
                };
                updatedProjects = [...prev.projects, newProject];
                showToast('Project created successfully!', 'success');
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
                showToast(`Project "${completedTitle}" completed!`, 'success');
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
            title: 'Delete Project',
            message: `Are you sure you want to delete "${proj ? proj.title : ''}"?`,
            confirmLabel: 'Delete Project',
            isDanger: true,
            onConfirm: () => {
                setState(prev => {
                    const projects = prev.projects.filter(p => p.id !== projectId);
                    const newState = { ...prev, projects };
                    saveState(newState);
                    showToast('Project removed.', 'info');
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
                showToast('Major goal updated successfully.', 'success');
            } else {
                const newMilestone = {
                    id: 'milestone-' + Date.now(),
                    ...milestoneData
                };
                updatedMilestones = [...prev.milestones, newMilestone];
                showToast('Major goal created successfully!', 'success');
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
                showToast(`Strategic goal "${completedMilestoneTitle}" 100% completed!`, 'success');
            }
            return newState;
        });
    }, [saveState, showToast]);

    // Delete milestone
    const handleDeleteMilestone = useCallback((milestoneId) => {
        const milestone = state.milestones.find(m => m.id === milestoneId);
        askConfirmation({
            title: 'Delete Major Goal',
            message: `Are you sure you want to delete "${milestone ? milestone.title : ''}"?`,
            confirmLabel: 'Delete Goal',
            isDanger: true,
            onConfirm: () => {
                setState(prev => {
                    const milestones = prev.milestones.filter(m => m.id !== milestoneId);
                    const newState = { ...prev, milestones };
                    saveState(newState);
                    showToast('Goal removed.', 'info');
                    return newState;
                });
            }
        });
    }, [state.milestones, askConfirmation, saveState, showToast]);

    // Reset / Import / Clear
    const handleImportState = useCallback((importedState) => {
        saveState(importedState);
        showToast('Backup restored successfully!', 'success');
    }, [saveState, showToast]);

    const handleResetState = useCallback(() => {
        const defaultState = JSON.parse(JSON.stringify(DEFAULT_STATE));
        defaultState.lastOpenedDay = getTodayDateString();
        defaultState.dailyLog = { [getTodayDateString()]: 4 };
        saveState(defaultState);
        showToast('Data reset to default state.', 'info');
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
        showToast('All data has been cleared.', 'warning');
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
                        unit: h.unit || 'times',
                        category: normalizeCategory(h.category || 'productivity'),
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
                        tag: t.tag || 'General',
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
                        category: normalizeCategory(m.category || 'career'),
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
            showToast(`${addedCount} new items successfully added by AI!`, 'success');
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
