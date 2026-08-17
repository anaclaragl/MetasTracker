import React from 'react';

export default function AnalyticsTab({ state }) {
    // 1. Weekly completion calculations
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const today = new Date();
    const weeklyData = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = dayNames[d.getDay()];

        const count = state.dailyLog && state.dailyLog[dateStr] ? state.dailyLog[dateStr] : 0;
        const maxVal = 10;
        const heightPct = Math.min(100, Math.max(10, Math.round((count / maxVal) * 100)));

        weeklyData.push({
            dayName,
            count,
            heightPct
        });
    }

    // 2. Category distribution calculations
    const catMap = {
        carreira: { name: 'Carreira & Emprego', count: 0, color: 'var(--accent-blue)' },
        estudo: { name: 'Estudo & Conhecimento', count: 0, color: 'var(--accent-purple)' },
        saude: { name: 'Saúde & Bem-Estar', count: 0, color: 'var(--accent-green)' },
        produtividade: { name: 'Produtividade Geral', count: 0, color: 'var(--accent-yellow)' }
    };

    const habits = state.habits || [];
    habits.forEach(h => {
        if (catMap[h.category]) catMap[h.category].count++;
    });

    const totalHabits = habits.length || 1;

    return (
        <section id="tab-analytics" className="tab-content active">
            <div className="analytics-grid">
                {/* Weekly Habit Completion History */}
                <div className="content-box">
                    <h3><i className="fa-solid fa-chart-bar icon-primary"></i> Desempenho dos Últimos 7 Dias</h3>
                    <div className="chart-bars-container" id="weekly-bars-chart">
                        {weeklyData.map((day, idx) => (
                            <div key={idx} className="bar-col">
                                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{day.count}</span>
                                <div className="bar-wrapper">
                                    <div className="bar-fill" style={{ height: `${day.heightPct}%` }}></div>
                                </div>
                                <span className="bar-day">{day.dayName}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="content-box">
                    <h3><i className="fa-solid fa-pie-chart icon-primary"></i> Distribuição por Categorias</h3>
                    <div className="category-distribution-list" id="category-distribution">
                        {Object.entries(catMap).map(([key, cat]) => {
                            const pct = Math.round((cat.count / totalHabits) * 100);
                            return (
                                <div key={key} className="cat-item">
                                    <div className="cat-info">
                                        <span>{cat.name}</span>
                                        <span>{cat.count} ({pct}%)</span>
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill" style={{ width: `${pct}%`, background: cat.color }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
