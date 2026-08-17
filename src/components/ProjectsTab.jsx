import React, { useState } from 'react';

export default function ProjectsTab({
    state,
    onMoveProject,
    onEditProject,
    onDeleteProject,
    onToggleSubtask,
    onAddProjectBtnClick
}) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProjects = state.projects.filter(proj => {
        return proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (proj.description && proj.description.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    const ideaProjects = filteredProjects.filter(p => p.status === 'idea');
    const inProgressProjects = filteredProjects.filter(p => p.status === 'in-progress');
    const completedProjects = filteredProjects.filter(p => p.status === 'completed');

    return (
        <section id="tab-projects" className="tab-content active">
            <div className="section-toolbar">
                <div className="search-filter">
                    <div className="input-with-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            id="project-search"
                            placeholder="Buscar projeto ou ideia..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <button className="btn btn-primary" onClick={onAddProjectBtnClick}>
                    <i className="fa-solid fa-plus"></i> Novo Projeto / Ideia
                </button>
            </div>

            {/* Kanban Board Columns */}
            <div className="kanban-board">
                {/* Column 1: Ideas / Backlog */}
                <div className="kanban-col">
                    <div className="col-header header-idea">
                        <span className="col-title"><i className="fa-regular fa-lightbulb"></i> Ideias em Mente</span>
                        <span className="col-count">{ideaProjects.length}</span>
                    </div>
                    <div className="col-body">
                        {ideaProjects.map(proj => {
                            const totalSub = proj.subtasks ? proj.subtasks.length : 0;
                            const doneSub = proj.subtasks ? proj.subtasks.filter(s => s.done).length : 0;

                            return (
                                <div key={proj.id} className="project-card">
                                    <div className="project-card-header">
                                        <h4>{proj.title}</h4>
                                        <div className="card-actions-menu">
                                            <button className="btn-icon" onClick={() => onEditProject(proj)} title="Editar">
                                                <i className="fa-solid fa-pen"></i>
                                            </button>
                                            <button className="btn-icon" onClick={() => onDeleteProject(proj.id)} title="Excluir">
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                    {proj.description && <p className="project-desc">{proj.description}</p>}
                                    {proj.tags && proj.tags.length > 0 && (
                                        <div className="tags-list">
                                            {proj.tags.map((t, idx) => <span key={idx} className="tag-pill">{t}</span>)}
                                        </div>
                                    )}
                                    {totalSub > 0 && (
                                        <div className="subtasks-progress">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                                                <span>Tarefas</span>
                                                <span>{doneSub}/{totalSub}</span>
                                            </div>
                                            {proj.subtasks.map(st => (
                                                <div key={st.id} className={`subtask-item ${st.done ? 'checked' : ''}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={!!st.done}
                                                        onChange={() => onToggleSubtask(proj.id, st.id)}
                                                    />
                                                    <span>{st.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="card-status-mover">
                                        <button className="btn btn-secondary btn-sm" onClick={() => onMoveProject(proj.id, 'in-progress')}>
                                            Mover p/ Em Produção <i className="fa-solid fa-arrow-right"></i>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Column 2: In Production */}
                <div className="kanban-col">
                    <div className="col-header header-progress">
                        <span className="col-title"><i className="fa-solid fa-spinner"></i> Em Produção</span>
                        <span className="col-count">{inProgressProjects.length}</span>
                    </div>
                    <div className="col-body">
                        {inProgressProjects.map(proj => {
                            const totalSub = proj.subtasks ? proj.subtasks.length : 0;
                            const doneSub = proj.subtasks ? proj.subtasks.filter(s => s.done).length : 0;

                            return (
                                <div key={proj.id} className="project-card">
                                    <div className="project-card-header">
                                        <h4>{proj.title}</h4>
                                        <div className="card-actions-menu">
                                            <button className="btn-icon" onClick={() => onEditProject(proj)} title="Editar">
                                                <i className="fa-solid fa-pen"></i>
                                            </button>
                                            <button className="btn-icon" onClick={() => onDeleteProject(proj.id)} title="Excluir">
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                    {proj.description && <p className="project-desc">{proj.description}</p>}
                                    {proj.tags && proj.tags.length > 0 && (
                                        <div className="tags-list">
                                            {proj.tags.map((t, idx) => <span key={idx} className="tag-pill">{t}</span>)}
                                        </div>
                                    )}
                                    {totalSub > 0 && (
                                        <div className="subtasks-progress">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                                                <span>Tarefas</span>
                                                <span>{doneSub}/{totalSub}</span>
                                            </div>
                                            {proj.subtasks.map(st => (
                                                <div key={st.id} className={`subtask-item ${st.done ? 'checked' : ''}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={!!st.done}
                                                        onChange={() => onToggleSubtask(proj.id, st.id)}
                                                    />
                                                    <span>{st.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="card-status-mover">
                                        <button className="btn btn-secondary btn-sm" onClick={() => onMoveProject(proj.id, 'idea')}>
                                            <i className="fa-solid fa-arrow-left"></i> Ideia
                                        </button>
                                        <button className="btn btn-primary btn-sm" onClick={() => onMoveProject(proj.id, 'completed')}>
                                            Concluir <i className="fa-solid fa-check"></i>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Column 3: Completed / Launched */}
                <div className="kanban-col">
                    <div className="col-header header-completed">
                        <span className="col-title"><i className="fa-solid fa-circle-check"></i> Concluídos</span>
                        <span className="col-count">{completedProjects.length}</span>
                    </div>
                    <div className="col-body">
                        {completedProjects.map(proj => {
                            const totalSub = proj.subtasks ? proj.subtasks.length : 0;
                            const doneSub = proj.subtasks ? proj.subtasks.filter(s => s.done).length : 0;

                            return (
                                <div key={proj.id} className="project-card completed">
                                    <div className="project-card-header">
                                        <h4>{proj.title}</h4>
                                        <div className="card-actions-menu">
                                            <button className="btn-icon" onClick={() => onEditProject(proj)} title="Editar">
                                                <i className="fa-solid fa-pen"></i>
                                            </button>
                                            <button className="btn-icon" onClick={() => onDeleteProject(proj.id)} title="Excluir">
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                    {proj.description && <p className="project-desc">{proj.description}</p>}
                                    {proj.tags && proj.tags.length > 0 && (
                                        <div className="tags-list">
                                            {proj.tags.map((t, idx) => <span key={idx} className="tag-pill">{t}</span>)}
                                        </div>
                                    )}
                                    {totalSub > 0 && (
                                        <div className="subtasks-progress">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                                                <span>Tarefas</span>
                                                <span>{doneSub}/{totalSub}</span>
                                            </div>
                                            {proj.subtasks.map(st => (
                                                <div key={st.id} className={`subtask-item ${st.done ? 'checked' : ''}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={!!st.done}
                                                        onChange={() => onToggleSubtask(proj.id, st.id)}
                                                        disabled
                                                    />
                                                    <span>{st.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="card-status-mover">
                                        <button className="btn btn-secondary btn-sm" onClick={() => onMoveProject(proj.id, 'in-progress')}>
                                            <i className="fa-solid fa-rotate-left"></i> Reabrir
                                        </button>
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
