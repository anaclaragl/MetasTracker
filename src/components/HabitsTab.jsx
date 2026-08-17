import React, { useState } from 'react';

export default function HabitsTab({
    state,
    onAdjustHabit,
    onEditHabit,
    onDeleteHabit,
    onAddHabitBtnClick
}) {
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredHabits = state.habits.filter(h => {
        const matchesSearch = h.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || h.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <section id="tab-habits" className="tab-content active">
            <div className="section-toolbar">
                <div className="search-filter">
                    <div className="input-with-icon" style={{ marginRight: '1rem' }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            placeholder="Buscar hábito..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        id="habit-filter-category"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">Todas as Categorias</option>
                        <option value="carreira">Carreira / Emprego</option>
                        <option value="estudo">Estudo & Aprendizado</option>
                        <option value="saude">Saúde & Bem-Estar</option>
                        <option value="produtividade">Produtividade</option>
                    </select>
                </div>
                <button className="btn btn-primary" onClick={onAddHabitBtnClick}>
                    <i className="fa-solid fa-plus"></i> Criar Hábito
                </button>
            </div>

            <div className="habits-grid" id="habits-cards-container">
                {filteredHabits.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        <i className="fa-solid fa-fire-burner" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}></i>
                        <p>Nenhum hábito encontrado com esses filtros.</p>
                    </div>
                ) : (
                    filteredHabits.map(habit => {
                        const pct = Math.min(100, Math.round((habit.current / habit.target) * 100));
                        const isCompleted = habit.current >= habit.target;

                        return (
                            <div key={habit.id} className={`habit-card category-${habit.category} ${isCompleted ? 'completed' : ''}`}>
                                <div className="habit-header">
                                    <div className="habit-title-area">
                                        <div className="habit-icon-badge">
                                            <i className={`fa-solid ${habit.icon || 'fa-bullseye'}`}></i>
                                        </div>
                                        <div>
                                            <h4>{habit.title}</h4>
                                            <span className="habit-category-tag" style={{ textTransform: 'capitalize' }}>
                                                {habit.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-actions-menu">
                                        <button className="btn-icon" onClick={() => onEditHabit(habit)} title="Editar">
                                            <i className="fa-solid fa-pen"></i>
                                        </button>
                                        <button className="btn-icon" onClick={() => onDeleteHabit(habit.id)} title="Excluir">
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="habit-progress-section">
                                    <div className="habit-counter-bar">
                                        <div className="counter-text">
                                            {habit.current} <span>/ {habit.target} {habit.unit}</span>
                                        </div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isCompleted ? 'var(--emerald)' : 'var(--text-secondary)' }}>
                                            {isCompleted ? '✓ Meta Concluída' : `${pct}%`}
                                        </span>
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                                    </div>
                                </div>

                                <div className="habit-footer">
                                    <div className="streak-badge" title="Dias seguidos completando este hábito">
                                        <i className="fa-solid fa-fire"></i>
                                        <span>{habit.streak || 0} dias em sequência</span>
                                    </div>
                                    <div className="counter-controls">
                                        <button className="btn-counter" onClick={() => onAdjustHabit(habit.id, -1)}>-</button>
                                        <button className="btn-counter" onClick={() => onAdjustHabit(habit.id, 1)}>+</button>
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
