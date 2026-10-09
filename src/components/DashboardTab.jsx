import React from 'react';

export default function DashboardTab({
    state,
    onAdjustHabit,
    onEditHabit,
    onDeleteHabit,
    onSwitchTab
}) {
    // Calculations
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
            {/* Metric Cards Grid (Adaptive 5 cards) */}
            <div className="dashboard-metrics-grid">
                {/* 1. Progress card */}
                <div className="stat-card" style={{ gap: '0.9rem' }}>
                    <div className="metric-circle" style={{ flexShrink: 0 }}>
                        <svg viewBox="0 0 36 36" className="circular-chart" style={{ width: '46px', height: '46px', flexShrink: 0 }}>
                            <path
                                className="circle-bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className="circle"
                                id="dashboard-progress-circle"
                                strokeDasharray={`${overallProgress}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text
                                x="18"
                                y="20.35"
                                className="percentage"
                                id="dashboard-progress-text"
                                style={{ fontSize: '0.75rem' }}
                            >
                                {overallProgress}%
                            </text>
                        </svg>
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Overall</span>
                        <h3 id="stat-overall-progress">{overallProgress}%</h3>
                    </div>
                </div>

                {/* 2. Habits Completed card */}
                <div className="stat-card">
                    <div className="stat-icon icon-emerald"><i className="fa-solid fa-check-double"></i></div>
                    <div className="stat-info">
                        <span className="stat-label">Habits Today</span>
                        <h3 id="stat-habits-completed">{completedTodayCount} / {habitsCount}</h3>
                    </div>
                </div>

                {/* 3. Best Streak card */}
                <div className="stat-card">
                    <div className="stat-icon icon-amber"><i className="fa-solid fa-fire"></i></div>
                    <div className="stat-info">
                        <span className="stat-label">Best Streak</span>
                        <h3 id="stat-best-streak">{maxStreak} {maxStreak === 1 ? 'day' : 'days'}</h3>
                    </div>
                </div>

                {/* 4. Active Projects card */}
                <div className="stat-card">
                    <div className="stat-icon icon-indigo"><i className="fa-solid fa-rocket"></i></div>
                    <div className="stat-info">
                        <span className="stat-label">Projects</span>
                        <h3 id="stat-active-projects">{activeProjectsCount}</h3>
                    </div>
                </div>

                {/* 5. Milestones Count card */}
                <div className="stat-card">
                    <div className="stat-icon icon-purple"><i className="fa-solid fa-flag-checkered"></i></div>
                    <div className="stat-info">
                        <span className="stat-label">Major Goals</span>
                        <h3 id="stat-milestones-count">{milestonesCount}</h3>
                    </div>
                </div>
            </div>

            {/* Dashboard Content Split */}
            <div className="dashboard-grid">
                {/* Left: Today's Habit Quick List */}
                <div className="content-box">
                    <div className="box-header">
                        <h3><i className="fa-solid fa-list-check icon-primary"></i> Priority Habits Today</h3>
                        <button type="button" className="btn-text" onClick={() => onSwitchTab('habits')}>
                            View All <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                    <div id="dashboard-habits-list" className="items-list">
                        {priorityHabits.length === 0 ? (
                            <div className="empty-sub-state">
                                <p className="text-muted">No habits registered yet.</p>
                                <button type="button" className="btn btn-secondary btn-sm mt-2" onClick={() => onSwitchTab('habits')}>
                                    <i className="fa-solid fa-plus"></i> Create Habit
                                </button>
                            </div>
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
                                                    {habit.current} / {habit.target} {habit.unit}
                                                    {habit.streak > 0 && ` • ${habit.streak} ${habit.streak === 1 ? 'day' : 'days'} streak`}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div className="counter-controls">
                                                <button
                                                    type="button"
                                                    className="btn-counter"
                                                    onClick={() => onAdjustHabit(habit.id, -1)}
                                                    aria-label={`Decrease ${habit.title}`}
                                                >
                                                    -
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-counter"
                                                    onClick={() => onAdjustHabit(habit.id, 1)}
                                                    aria-label={`Increase ${habit.title}`}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn-icon"
                                                onClick={() => onEditHabit(habit)}
                                                aria-label={`Edit ${habit.title}`}
                                                title="Edit"
                                            >
                                                <i className="fa-solid fa-pen"></i>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right: Featured Projects in Progress */}
                <div className="content-box">
                    <div className="box-header">
                        <h3><i className="fa-solid fa-diagram-project icon-primary"></i> Active Development</h3>
                        <button type="button" className="btn-text" onClick={() => onSwitchTab('projects')}>
                            View All <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                    <div id="dashboard-projects-list" className="items-list">
                        {featuredProjects.length === 0 ? (
                            <div className="empty-sub-state">
                                <p className="text-muted">No projects in development at the moment.</p>
                                <button type="button" className="btn btn-secondary btn-sm mt-2" onClick={() => onSwitchTab('projects')}>
                                    <i className="fa-solid fa-plus"></i> Start New Project
                                </button>
                            </div>
                        ) : (
                            featuredProjects.map(proj => {
                                const totalSub = proj.subtasks ? proj.subtasks.length : 0;
                                const doneSub = proj.subtasks ? proj.subtasks.filter(s => s.done).length : 0;
                                const pct = totalSub > 0 ? Math.round((doneSub / totalSub) * 100) : 0;

                                return (
                                    <div key={proj.id} className="list-item-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.65rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <strong style={{ fontSize: '0.9rem' }}>{proj.title}</strong>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                                {doneSub}/{totalSub} subtasks ({pct}%)
                                            </span>
                                        </div>
                                        {proj.description && (
                                            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {proj.description}
                                            </p>
                                        )}
                                        <div className="progress-track" style={{ height: '6px' }}>
                                            <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                                        </div>
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
