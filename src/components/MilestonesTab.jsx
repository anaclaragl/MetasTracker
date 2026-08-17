import React from 'react';

export default function MilestonesTab({
    state,
    onToggleMilestoneStep,
    onEditMilestone,
    onDeleteMilestone,
    onAddMilestoneBtnClick
}) {
    const formatDateToBR = (dateString) => {
        if (!dateString) return 'Sem prazo';
        const parts = dateString.split('-');
        if (parts.length !== 3) return dateString;
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    const milestones = state.milestones || [];

    return (
        <section id="tab-milestones" className="tab-content active">
            <div className="section-toolbar" style={{ justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={onAddMilestoneBtnClick}>
                    <i className="fa-solid fa-plus"></i> Nova Grande Meta
                </button>
            </div>

            <div className="milestones-grid" id="milestones-cards-container">
                {milestones.length === 0 ? (
                    <div style={{ textAlignment: 'center', padding: '3rem', color: 'var(--text-secondary)', gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <i className="fa-solid fa-trophy" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}></i>
                        <p>Nenhuma grande meta definida. Clique em "Nova Grande Meta" para criar seu plano de ação.</p>
                    </div>
                ) : (
                    milestones.map(m => {
                        const totalSteps = m.steps ? m.steps.length : 0;
                        const doneSteps = m.steps ? m.steps.filter(s => s.done).length : 0;
                        const pct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

                        return (
                            <div key={m.id} className={`milestone-card milestone-category-${m.category}`}>
                                <div className="milestone-header">
                                    <div className="milestone-info">
                                        <h3>{m.title}</h3>
                                        <div className="milestone-meta">
                                            <span><i className="fa-regular fa-calendar"></i> Prazo: {formatDateToBR(m.targetDate)}</span>
                                            <span style={{ textTransform: 'capitalize' }}><i className="fa-solid fa-tag"></i> {m.category}</span>
                                        </div>
                                    </div>
                                    <div className="card-actions-menu">
                                        <button className="btn-icon" onClick={() => onEditMilestone(m)} title="Editar">
                                            <i className="fa-solid fa-pen"></i>
                                        </button>
                                        <button className="btn-icon" onClick={() => onDeleteMilestone(m.id)} title="Excluir">
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                {m.notes && (
                                    <div className="milestone-notes">
                                        <i className="fa-solid fa-lightbulb" style={{ color: 'var(--amber)', marginRight: '6px' }}></i>
                                        {m.notes}
                                    </div>
                                )}

                                <div className="habit-progress-section">
                                    <div className="habit-counter-bar">
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Progresso Geral</span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: pct === 100 ? 'var(--emerald)' : 'var(--primary)' }}>{pct}%</span>
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                                    </div>
                                </div>

                                {totalSteps > 0 && (
                                    <div className="steps-list">
                                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Plano de Ação ({doneSteps}/{totalSteps}):</strong>
                                        {m.steps.map(step => (
                                            <div key={step.id} className="step-row">
                                                <input
                                                    type="checkbox"
                                                    checked={!!step.done}
                                                    onChange={() => onToggleMilestoneStep(m.id, step.id)}
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
