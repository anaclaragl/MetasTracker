import React, { useState, useEffect } from 'react';
import DashboardTab from './components/DashboardTab';
import HabitsTab from './components/HabitsTab';
import TasksTab from './components/TasksTab';
import ProjectsTab from './components/ProjectsTab';
import MilestonesTab from './components/MilestonesTab';
import AnalyticsTab from './components/AnalyticsTab';
import AiAssistantModal from './components/AiAssistantModal';
import BackupModal from './components/BackupModal';
import HabitModal from './components/modals/HabitModal';
import TaskModal from './components/modals/TaskModal';
import ProjectModal from './components/modals/ProjectModal';
import MilestoneModal from './components/modals/MilestoneModal';
import ConfirmModal from './components/modals/ConfirmModal';
import { useMetasTracker } from './hooks/useMetasTracker';
import { getTodayDateString } from './utils/dateUtils';

export default function App() {
    const {
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
    } = useMetasTracker();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Modal Visibility States
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
    const [habitModal, setHabitModal] = useState({ isOpen: false, isEdit: false, habit: null });
    const [taskModal, setTaskModal] = useState({ isOpen: false, isEdit: false, task: null });
    const [projectModal, setProjectModal] = useState({ isOpen: false, isEdit: false, project: null });
    const [milestoneModal, setMilestoneModal] = useState({ isOpen: false, isEdit: false, milestone: null });

    // Open Add Modals depending on context
    const handleOpenNewItem = () => {
        if (activeTab === 'habits') {
            setHabitModal({ isOpen: true, isEdit: false, habit: null });
        } else if (activeTab === 'tasks') {
            setTaskModal({ isOpen: true, isEdit: false, task: null });
        } else if (activeTab === 'projects') {
            setProjectModal({ isOpen: true, isEdit: false, project: null });
        } else if (activeTab === 'milestones') {
            setMilestoneModal({ isOpen: true, isEdit: false, milestone: null });
        } else {
            // Default on Dashboard or Analytics
            setHabitModal({ isOpen: true, isEdit: false, habit: null });
        }
    };

    // Keyboard Shortcuts (Ctrl+K for command menu, Alt+N for new item, Alt+1..6 for tabs)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.altKey && e.key.toLowerCase() === 'n') {
                e.preventDefault();
                handleOpenNewItem();
            } else if (e.altKey && e.key === '1') {
                e.preventDefault();
                setActiveTab('dashboard');
            } else if (e.altKey && e.key === '2') {
                e.preventDefault();
                setActiveTab('habits');
            } else if (e.altKey && e.key === '3') {
                e.preventDefault();
                setActiveTab('tasks');
            } else if (e.altKey && e.key === '4') {
                e.preventDefault();
                setActiveTab('projects');
            } else if (e.altKey && e.key === '5') {
                e.preventDefault();
                setActiveTab('milestones');
            } else if (e.altKey && e.key === '6') {
                e.preventDefault();
                setActiveTab('analytics');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeTab]);

    const handleSwitchTab = (tab) => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
    };

    // Badge counts
    const habitsBadgeCount = state.habits.length;
    const tasksBadgeCount = state.tasks.filter(t => t.status !== 'done').length;
    const projectsBadgeCount = state.projects.length;

    const getPageHeader = () => {
        switch (activeTab) {
            case 'dashboard':
                return { title: 'Dashboard', subtitle: 'Overview of your daily progress, active habits, and key projects.' };
            case 'habits':
                return { title: 'Daily Habits', subtitle: 'Build and reinforce positive recurring routines every day.' };
            case 'tasks':
                return { title: 'Daily Tasks', subtitle: 'Kanban board to streamline and organize your quick daily to-dos.' };
            case 'projects':
                return { title: 'Projects & Ideas', subtitle: 'Structured kanban workspace for active builds and creative concepts.' };
            case 'milestones':
                return { title: 'Major Goals', subtitle: 'Strategic medium and long-term milestones with step-by-step roadmaps.' };
            case 'analytics':
                return { title: 'Analytics & Insights', subtitle: 'Visual metrics and streak history of your daily consistency.' };
            default:
                return { title: 'MetasTracker', subtitle: '' };
        }
    };

    const headerText = getPageHeader();

    return (
        <div className="app-container">
            <div className="app-body">
                {/* Sidebar Navigation */}
                <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    <div className="brand">
                        <div className="brand-logo">
                            <i className="fa-solid fa-bullseye"></i>
                        </div>
                        <div className="brand-text">
                            <h2>Metas<span>Tracker</span></h2>
                            <span className="brand-tagline">Achieve Your Goals</span>
                        </div>
                        <button
                            type="button"
                            className="mobile-close-btn"
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-label="Close menu"
                        >
                            &times;
                        </button>
                    </div>

                    <nav className="nav-menu" aria-label="Main menu">
                        <button
                            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => handleSwitchTab('dashboard')}
                            aria-current={activeTab === 'dashboard' ? 'page' : undefined}
                        >
                            <i className="fa-solid fa-chart-pie"></i>
                            <span>Dashboard</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'habits' ? 'active' : ''}`}
                            onClick={() => handleSwitchTab('habits')}
                            aria-current={activeTab === 'habits' ? 'page' : undefined}
                        >
                            <i className="fa-solid fa-fire"></i>
                            <span>Daily Habits</span>
                            <span className="badge">{habitsBadgeCount}</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
                            onClick={() => handleSwitchTab('tasks')}
                            aria-current={activeTab === 'tasks' ? 'page' : undefined}
                        >
                            <i className="fa-solid fa-list-check"></i>
                            <span>Daily Tasks</span>
                            <span className="badge">{tasksBadgeCount}</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
                            onClick={() => handleSwitchTab('projects')}
                            aria-current={activeTab === 'projects' ? 'page' : undefined}
                        >
                            <i className="fa-solid fa-diagram-project"></i>
                            <span>Projects & Ideas</span>
                            <span className="badge">{projectsBadgeCount}</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'milestones' ? 'active' : ''}`}
                            onClick={() => handleSwitchTab('milestones')}
                            aria-current={activeTab === 'milestones' ? 'page' : undefined}
                        >
                            <i className="fa-solid fa-trophy"></i>
                            <span>Major Goals</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
                            onClick={() => handleSwitchTab('analytics')}
                            aria-current={activeTab === 'analytics' ? 'page' : undefined}
                        >
                            <i className="fa-solid fa-chart-line"></i>
                            <span>Analytics</span>
                        </button>
                    </nav>

                    <div className="sidebar-footer">
                        <button
                            className="btn-icon-label"
                            title="Generate with Free AI"
                            onClick={() => {
                                setIsAiModalOpen(true);
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                            <span>AI Assistant</span>
                        </button>
                        <button
                            className="btn-icon-label"
                            title="Toggle Theme"
                            onClick={toggleTheme}
                        >
                            <i className={`fa-solid ${state.theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
                            <span>{state.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>
                        <button
                            className="btn-icon-label"
                            title="Export/Import Data"
                            onClick={() => {
                                setIsBackupModalOpen(true);
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            <i className="fa-solid fa-database"></i>
                            <span>Backup & Data</span>
                        </button>
                    </div>
                </aside>

                {/* Mobile Backdrop Overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="mobile-backdrop"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-hidden="true"
                    />
                )}

                {/* Main Content Area */}
                <main className="main-content">
                    {/* Top Header */}
                    <header className="top-header">
                        <div className="header-left">
                            <button
                                type="button"
                                className="mobile-menu-toggle"
                                onClick={() => setIsMobileMenuOpen(true)}
                                aria-label="Open navigation menu"
                            >
                                <i className="fa-solid fa-bars"></i>
                            </button>
                            <div className="header-title">
                                <h1>{headerText.title}</h1>
                                <p className="subtitle">{headerText.subtitle}</p>
                            </div>
                        </div>
                    </header>

                    {/* Active Tab Screen */}
                    {activeTab === 'dashboard' && (
                        <DashboardTab
                            state={state}
                            onAdjustHabit={handleAdjustHabit}
                            onEditHabit={(h) => setHabitModal({ isOpen: true, isEdit: true, habit: h })}
                            onDeleteHabit={handleDeleteHabit}
                            onSwitchTab={handleSwitchTab}
                        />
                    )}
                    {activeTab === 'habits' && (
                        <HabitsTab
                            state={state}
                            onAdjustHabit={handleAdjustHabit}
                            onEditHabit={(h) => setHabitModal({ isOpen: true, isEdit: true, habit: h })}
                            onDeleteHabit={handleDeleteHabit}
                            onAddHabitBtnClick={() => setHabitModal({ isOpen: true, isEdit: false, habit: null })}
                        />
                    )}
                    {activeTab === 'tasks' && (
                        <TasksTab
                            state={state}
                            onMoveTask={handleMoveTask}
                            onEditTask={(t) => setTaskModal({ isOpen: true, isEdit: true, task: t })}
                            onDeleteTask={handleDeleteTask}
                            onAddTaskBtnClick={() => setTaskModal({ isOpen: true, isEdit: false, task: null })}
                        />
                    )}
                    {activeTab === 'projects' && (
                        <ProjectsTab
                            state={state}
                            onMoveProject={handleMoveProject}
                            onEditProject={(p) => setProjectModal({ isOpen: true, isEdit: true, project: p })}
                            onDeleteProject={handleDeleteProject}
                            onToggleSubtask={handleToggleSubtask}
                            onAddProjectBtnClick={() => setProjectModal({ isOpen: true, isEdit: false, project: null })}
                        />
                    )}
                    {activeTab === 'milestones' && (
                        <MilestonesTab
                            state={state}
                            onToggleMilestoneStep={handleToggleMilestoneStep}
                            onEditMilestone={(m) => setMilestoneModal({ isOpen: true, isEdit: true, milestone: m })}
                            onDeleteMilestone={handleDeleteMilestone}
                            onAddMilestoneBtnClick={() => setMilestoneModal({ isOpen: true, isEdit: false, milestone: null })}
                        />
                    )}
                    {activeTab === 'analytics' && (
                        <AnalyticsTab
                            state={state}
                        />
                    )}
                </main>
            </div>

            {/* MODALS */}
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

            <HabitModal
                isOpen={habitModal.isOpen}
                isEdit={habitModal.isEdit}
                habit={habitModal.habit}
                onClose={() => setHabitModal({ isOpen: false, isEdit: false, habit: null })}
                onSave={handleSaveHabit}
            />

            <TaskModal
                isOpen={taskModal.isOpen}
                isEdit={taskModal.isEdit}
                task={taskModal.task}
                onClose={() => setTaskModal({ isOpen: false, isEdit: false, task: null })}
                onSave={handleSaveTask}
            />

            <ProjectModal
                isOpen={projectModal.isOpen}
                isEdit={projectModal.isEdit}
                project={projectModal.project}
                onClose={() => setProjectModal({ isOpen: false, isEdit: false, project: null })}
                onSave={handleSaveProject}
            />

            <MilestoneModal
                isOpen={milestoneModal.isOpen}
                isEdit={milestoneModal.isEdit}
                milestone={milestoneModal.milestone}
                onClose={() => setMilestoneModal({ isOpen: false, isEdit: false, milestone: null })}
                onSave={handleSaveMilestone}
            />

            <ConfirmModal
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                confirmLabel={confirmDialog.confirmLabel}
                isDanger={confirmDialog.isDanger}
                onConfirm={confirmDialog.onConfirm}
                onClose={closeConfirmation}
            />

            {/* TOAST NOTIFICATION CONTAINER */}
            <div id="toast-container" className="toast-container" aria-live="polite">
                {toasts.map(toast => {
                    let icon = 'fa-circle-info';
                    if (toast.type === 'success') icon = 'fa-circle-check';
                    if (toast.type === 'warning') icon = 'fa-triangle-exclamation';
                    if (toast.type === 'error') icon = 'fa-circle-xmark';

                    return (
                        <div
                            key={toast.id}
                            className={`toast toast-${toast.type}`}
                            onClick={() => dismissToast(toast.id)}
                            role="status"
                            title="Click to dismiss"
                        >
                            <i className={`fa-solid ${icon}`}></i>
                            <span>{toast.message}</span>
                            <button
                                type="button"
                                className="toast-dismiss-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dismissToast(toast.id);
                                }}
                                aria-label="Dismiss notification"
                            >
                                &times;
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
