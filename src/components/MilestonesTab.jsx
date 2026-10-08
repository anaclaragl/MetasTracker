import React, { useState } from 'react';
import { formatDate } from '../utils/dateUtils';

export default function MilestonesTab({
    state,
    onToggleMilestoneStep,
    onEditMilestone,
    onDeleteMilestone,
    onAddMilestoneBtnClick
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const milestones = state.milestones || [];

    const filteredMilestones = milestones.filter(m => {
        return m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (m.notes && m.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
               (m.category && m.category.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    return (
        <section id="tab-milestones" className="tab-content active">
            <div className="section-toolbar">
                <div className="search-filter">
                    <div className="input-with-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            placeholder="Search major goals..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Search major goals"
                        />
                    </div>
                </div>
                <button className="btn btn-primary" onClick={onAddMilestoneBtnClick}>
                    <i className="fa-solid fa-plus"></i> New Major Goal
                </button>
            </div>

            <div className="milestones-grid" id="milestones-cards-container">
                {filteredMilestones.length === 0 ? (
                    <div className="empty-state-box">
                        <div className="empty-state-icon">
                            <i className="fa-solid fa-trophy"></i>
                        </div>
                        <h4>No major goals found</h4>
                        <p>Adjust your search query or set a new strategic milestone with actionable step-by-step roadmaps.</p>
                        <button className="btn btn-primary btn-sm" onClick={onAddMilestoneBtnClick}>
                            <i className="fa-solid fa-plus"></i> Create Goal
                        </button>
                    </div>
                ) : (
                    filteredMilestones.map(m => {
                        const totalSteps = m.steps ? m.steps.length : 0;
                        const doneSteps = m.steps ? m.steps.filter(s => s.done).length : 0;
                        const pct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

                        return (
                            <div key={m.id} className="milestone-card">
                                <div className="milestone-header">
                                    <div className="milestone-info">
                                        <h4>{m.title}</h4>
                                        <div className="milestone-meta">
                                            <span><i className="fa-regular fa-calendar"></i> Due: {formatDate(m.targetDate)}</span>
                                            {m.category && (
                                                <span className="tag-pill" style={{ textTransform: 'capitalize' }}>
                                                    <i className="fa-solid fa-tag"></i> {m.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="card-actions-menu">
                                        <button
                                            type="button"
                                            className="btn-icon"
                                            onClick={() => onEditMilestone(m)}
                                            aria-label={`Edit goal ${m.title}`}
                                            title="Edit"
                                        >
                                            <i className="fa-solid fa-pen"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-icon"
                                            onClick={() => onDeleteMilestone(m.id)}
                                            aria-label={`Delete goal ${m.title}`}
                                            title="Delete"
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                {m.notes && (
                                    <div className="milestone-notes">
                                        <i className="fa-solid fa-lightbulb" style={{ color: 'var(--accent-yellow)', marginRight: '6px' }}></i>
                                        {m.notes}
                                    </div>
                                )}

                                <div className="habit-progress-section">
                                    <div className="habit-counter-bar">
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Overall Progress</span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: pct === 100 ? 'var(--accent-green)' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{pct}%</span>
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                                    </div>
                                </div>

                                {totalSteps > 0 && (
                                    <div className="steps-list">
                                        <strong style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Action Plan ({doneSteps}/{totalSteps}):</strong>
                                        {m.steps.map(step => (
                                            <div key={step.id} className="step-row">
                                                <input
                                                    type="checkbox"
                                                    checked={!!step.done}
                                                    onChange={() => onToggleMilestoneStep(m.id, step.id)}
                                                    aria-label={`Mark step ${step.title}`}
                                                />
                                                <span style={step.done ? { textDecoration: 'line-through', color: 'var(--text-muted)' } : {}}>
                                                    {step.title}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
}
