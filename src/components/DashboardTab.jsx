import React from 'react';

export default function DashboardTab({
    state,
    onAdjustHabit,
    onEditHabit,
    onDeleteHabit,
    onSwitchTab
}) {
    // 1. Calculations
    const habitsCount = state.habits.length;
    const completedTodayCount = state.habits.filter(h => h.current >= h.target).length;

    let maxStreak = 0;
    state.habits.forEach(h => {
        if (h.streak > maxStreak) maxStreak = h.streak;
    });

    const activeProjectsCount = state.projects.filter(p => p.status !== 'completed').length;
    const milestonesCount = state.milestones.length;

    let overallProgress = 0;
    if (habitsCount > 0) {
        let habitPctSum = 0;
        state.habits.forEach(h => {
            const pct = Math.min(100, Math.round((h.current / h.target) * 100));
            habitPctSum += pct;
        });
        overallProgress = Math.round(habitPctSum / habitsCount);
    }

    const priorityHabits = state.habits.slice(0, 4);
    const featuredProjects = state.projects.filter(p => p.status === 'in-progress');

    return (
        <section id="tab-dashboard" className="tab-content active">
            {/* Metric Cards */}
            <div className="grid-cards-4">
                {/* 1. Progress card */}
                <div className="stat-card" style={{ gap: '1.25rem' }}>
                    <div className="metric-circle">
                        <svg viewBox="0 0 36 36" className="circular-chart" style={{ width: '50px', height: '50px' }}>
                            <path className="circle-bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="circle" id="dashboard-progress-circle" strokeDasharray={`${overallProgress}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <text x="18" y="20.35" className="percentage" id="dashboard-progress-text"
                                style={{ fontSize: '0.75rem' }}>{overallProgress}%</text>
                        </svg>
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Conclusão Hoje</span>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>
                            Progresso Geral
                        </h3>
                    </div>
                </div>

                {/* 2. Habits Completed card */}
                <div className="stat-card">
                    <div className="stat-icon icon-emerald"><i className="fa-solid fa-check-double"></i></div>
                    <div className="stat-info">
                        <span className="stat-label">Hábitos Hoje</span>
                        <h3 id="stat-habits-completed">{completedTodayCount} / {habitsCount}</h3>
                    </div>
                </div>

                {/* 3. Best Streak card */}
                <div className="stat-card">
                    <div className="stat-icon icon-amber"><i className="fa-solid fa-fire"></i></div>
                    <div className="stat-info">
                        <span className="stat-label">Maior Sequência</span>
                        <h3 id="stat-best-streak">{maxStreak} {maxStreak === 1 ? 'dia' : 'dias'}</h3>
                    </div>
                </div>

                {/* 4. Active Projects card */}
                <div className="stat-card">
                    <div className="stat-icon icon-indigo"><i className="fa-solid fa-rocket"></i></div>
                    <div className="stat-info">
                        <span className="stat-label">Projetos Ativos</span>
                        <h3 id="stat-active-projects">{activeProjectsCount}</h3>
                    </div>
                </div>

                {/* 5. Milestones Count card */}
                <div className="stat-card">
                    <div className="stat-icon icon-purple"><i className="fa-solid fa-flag-checkered"></i></div>
                    <div className="stat-info">
                        <span className="stat-label">Grandes Metas</span>
                        <h3 id="stat-milestones-count">{milestonesCount}</h3>
                    </div>
                </div>
            </div>

            {/* Dashboard Content Split */}
            <div className="dashboard-grid">
                {/* Left: Today's Habit Quick List */}
                <div className="content-box">
                    <div className="box-header">
                        <h3><i className="fa-solid fa-list-check icon-primary"></i> Hábitos Prioritários Hoje</h3>
                        <button className="btn-text" onClick={() => onSwitchTab('habits')}>
                            Ver Todos <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                    <div id="dashboard-habits-list" className="items-list">
                        {priorityHabits.length === 0 ? (
                            <p className="text-muted">Nenhum hábito cadastrado ainda. Clique em "Criar Hábito" para começar.</p>
                        ) : (
                            priorityHabits.map(habit => {
                                const isDone = habit.current >= habit.target;
                                return (
                                    <div key={habit.id} className={`list-item-card ${isDone ? 'completed' : ''}`}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div className="habit-icon-badge">
                                                <i className={`fa-solid ${habit.icon || 'fa-bullseye'}`}></i>
                                            </div>
                                            <div>
                                                <strong style={{ fontSize: '0.9rem' }}>{habit.title}</strong>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    {habit.current} de {habit.target} {habit.unit}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div className="counter-controls">
                                                <button className="btn-counter" onClick={() => onAdjustHabit(habit.id, -1)}>-</button>
                                                <button className="btn-counter" onClick={() => onAdjustHabit(habit.id, 1)}>+</button>
                                            </div>
                                            <button className="btn-icon" onClick={() => onEditHabit(habit)} title="Editar" style={{ color: 'var(--text-muted)' }}>
                                                <i className="fa-solid fa-pen"></i>
                                            </button>
                                            <button className="btn-icon" onClick={() => onDeleteHabit(habit.id)} title="Excluir" style={{ color: 'var(--text-muted)' }}>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right: Active Projects & Focus */}
                <div className="content-box">
                    <div className="box-header">
                        <h3><i className="fa-solid fa-laptop-code icon-primary"></i> Projetos em Destaque</h3>
                        <button className="btn-text" onClick={() => onSwitchTab('projects')}>
                            Ver Quadro <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                    <div id="dashboard-projects-list" className="items-list">
                        {featuredProjects.length === 0 ? (
                            <p className="text-muted">Nenhum projeto em produção no momento. Adicione um na aba Projetos.</p>
                        ) : (
                            featuredProjects.map(proj => {
                                const totalSub = proj.subtasks ? proj.subtasks.length : 0;
                                const doneSub = proj.subtasks ? proj.subtasks.filter(s => s.done).length : 0;
                                const pct = totalSub > 0 ? Math.round((doneSub / totalSub) * 100) : 0;

                                return (
                                    <div key={proj.id} className="list-item-card">
                                        <div>
                                            <strong style={{ fontSize: '0.9rem' }}>{proj.title}</strong>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                                {doneSub} de {totalSub} tarefas concluídas ({pct}%)
                                            </div>
                                        </div>
                                        <button className="btn-text" onClick={() => onSwitchTab('projects')}>
                                            Abrir <i className="fa-solid fa-chevron-right"></i>
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
