import React from 'react';
import { formatDateToBR } from '../utils/dateUtils';

export default function MilestonesTab({
    state,
    onToggleMilestoneStep,
    onEditMilestone,
    onDeleteMilestone,
    onAddMilestoneBtnClick
}) {
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
                    <div className="empty-state-box">
                        <div className="empty-state-icon">
                            <i className="fa-solid fa-trophy"></i>
                        </div>
                        <h4>Nenhuma grande meta definida</h4>
                        <p>Defina suas grandes metas estrategicas de carreira, financas ou desenvolvimento pessoal com planos de acao passo a passo.</p>
                        <button className="btn btn-primary btn-sm" onClick={onAddMilestoneBtnClick}>
                            <i className="fa-solid fa-plus"></i> Criar Primeira Meta
                        </button>
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
                                        <button
                                            type="button"
                                            className="btn-icon"
                                            onClick={() => onEditMilestone(m)}
                                            aria-label={`Editar meta ${m.title}`}
                                            title="Editar"
                                        >
                                            <i className="fa-solid fa-pen"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-icon"
                                            onClick={() => onDeleteMilestone(m.id)}
                                            aria-label={`Excluir meta ${m.title}`}
                                            title="Excluir"
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
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Progresso Geral</span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: pct === 100 ? 'var(--accent-green)' : 'var(--primary)' }}>{pct}%</span>
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                                    </div>
                                </div>

                                {totalSteps > 0 && (
                                    <div className="steps-list">
                                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Plano de Acao ({doneSteps}/{totalSteps}):</strong>
                                        {m.steps.map(step => (
                                            <div key={step.id} className="step-row">
                                                <input
                                                    type="checkbox"
                                                    checked={!!step.done}
                                                    onChange={() => onToggleMilestoneStep(m.id, step.id)}
                                                    aria-label={`Marcar etapa ${step.title}`}
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
