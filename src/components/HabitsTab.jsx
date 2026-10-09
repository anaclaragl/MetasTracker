import React, { useState } from 'react';
import { getCategoryLabel, normalizeCategory } from '../utils/categoryUtils';

export default function HabitsTab({
    state,
    onAdjustHabit,
    onEditHabit,
    onDeleteHabit,
    onAddHabitBtnClick
}) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredHabits = state.habits.filter(h => {
        const catLabel = getCategoryLabel(h.category).toLowerCase();
        const rawCat = (h.category || '').toLowerCase();
        const term = searchTerm.toLowerCase();
        return h.title.toLowerCase().includes(term) ||
               rawCat.includes(term) ||
               catLabel.includes(term);
    });

    return (
        <section id="tab-habits" className="tab-content active">
            <div className="section-toolbar">
                <div className="search-filter">
                    <div className="input-with-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            placeholder="Search habits..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Search habits"
                        />
                    </div>
                </div>
                <button className="btn btn-primary" onClick={onAddHabitBtnClick}>
                    <i className="fa-solid fa-plus"></i> Create Habit
                </button>
            </div>

            <div className="habits-grid" id="habits-cards-container">
                {filteredHabits.length === 0 ? (
                    <div className="empty-state-box">
                        <div className="empty-state-icon">
                            <i className="fa-solid fa-fire-burner"></i>
                        </div>
                        <h4>No habits found</h4>
                        <p>Adjust your search query or start by building your first daily habit right now.</p>
                        <button className="btn btn-primary btn-sm" onClick={onAddHabitBtnClick}>
                            <i className="fa-solid fa-plus"></i> Create New Habit
                        </button>
                    </div>
                ) : (
                    filteredHabits.map(habit => {
                        const pct = Math.min(100, Math.round((habit.current / habit.target) * 100));
                        const isCompleted = habit.current >= habit.target;
                        const catKey = normalizeCategory(habit.category);

                        return (
                            <div key={habit.id} className={`habit-card category-${catKey} category-${habit.category} ${isCompleted ? 'completed' : ''}`}>
                                <div className="habit-header">
                                    <div className="habit-title-area">
                                        <div className="habit-icon-badge">
                                            <i className={`fa-solid ${habit.icon || 'fa-bullseye'}`}></i>
                                        </div>
                                        <div>
                                            <h4>{habit.title}</h4>
                                            <span className="habit-category-tag">
                                                {getCategoryLabel(habit.category)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-actions-menu">
                                        <button
                                            type="button"
                                            className="btn-icon"
                                            onClick={() => onEditHabit(habit)}
                                            aria-label={`Edit habit ${habit.title}`}
                                            title="Edit"
                                        >
                                            <i className="fa-solid fa-pen"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-icon"
                                            onClick={() => onDeleteHabit(habit.id)}
                                            aria-label={`Delete habit ${habit.title}`}
                                            title="Delete"
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="habit-progress-section">
                                    <div className="habit-counter-bar">
                                        <div className="counter-text">
                                            {habit.current} <span>/ {habit.target} {habit.unit}</span>
                                        </div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isCompleted ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                                            {isCompleted ? 'Goal Met' : `${pct}%`}
                                        </span>
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                                    </div>
                                </div>

                                <div className="habit-footer">
                                    <div className="streak-badge" title="Consecutive days completing this habit">
                                        <i className="fa-solid fa-fire"></i>
                                        <span>{habit.streak || 0} {habit.streak === 1 ? 'day' : 'days'} streak</span>
                                    </div>
                                    <div className="counter-controls">
                                        <button
                                            type="button"
                                            className="btn-counter"
                                            onClick={() => onAdjustHabit(habit.id, -1)}
                                            aria-label={`Decrease counter for ${habit.title}`}
                                        >
                                            -
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-counter"
                                            onClick={() => onAdjustHabit(habit.id, 1)}
                                            aria-label={`Increase counter for ${habit.title}`}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
}
