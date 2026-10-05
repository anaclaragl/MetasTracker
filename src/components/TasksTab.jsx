import React, { useState } from 'react';

export default function TasksTab({
    state,
    onMoveTask,
    onEditTask,
    onDeleteTask,
    onAddTaskBtnClick
}) {
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const priorityLabels = {
        high: 'Alta Prioridade',
        medium: 'Media Prioridade',
        low: 'Baixa Prioridade'
    };

    const tasks = state.tasks || [];

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (task.tag && task.tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
        return matchesSearch && matchesPriority;
    });

    const todoTasks = filteredTasks.filter(t => t.status === 'todo');
    const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress');
    const doneTasks = filteredTasks.filter(t => t.status === 'done');

    return (
        <section id="tab-tasks" className="tab-content active">
            <div className="section-toolbar">
                <div className="search-filter">
                    <div className="input-with-icon" style={{ marginRight: '1rem' }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            placeholder="Buscar tarefa ou tag..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Buscar tarefa ou tag"
                        />
                    </div>
                    <select
                        id="task-filter-priority"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        aria-label="Filtrar por prioridade"
                    >
                        <option value="all">Todas as Prioridades</option>
                        <option value="high">Alta Prioridade</option>
                        <option value="medium">Media Prioridade</option>
                        <option value="low">Baixa Prioridade</option>
                    </select>
                </div>
                <button className="btn btn-primary" onClick={onAddTaskBtnClick}>
                    <i className="fa-solid fa-plus"></i> Nova Tarefa
                </button>
            </div>

            {/* Daily Tasks Kanban Board */}
            {filteredTasks.length === 0 ? (
                <div className="empty-state-box">
                    <div className="empty-state-icon">
                        <i className="fa-solid fa-clipboard-list"></i>
                    </div>
                    <h4>Nenhuma tarefa encontrada</h4>
                    <p>Adicione novas tarefas para organizar sua rotina no quadro Kanban.</p>
                    <button className="btn btn-primary btn-sm" onClick={onAddTaskBtnClick}>
                        <i className="fa-solid fa-plus"></i> Criar Nova Tarefa
                    </button>
                </div>
            ) : (
                <div className="kanban-board">
                    {/* Column 1: A Fazer */}
                    <div className="kanban-col">
                        <div className="col-header header-todo">
                            <span className="col-title"><i className="fa-regular fa-clipboard"></i> A Fazer</span>
                            <span className="col-count">{todoTasks.length}</span>
                        </div>
                        <div className="col-body">
                            {todoTasks.length === 0 ? (
                                <p className="col-empty-msg">Nenhuma tarefa a fazer</p>
                            ) : (
                                todoTasks.map(task => (
                                    <div key={task.id} className="task-card">
                                        <div className="task-card-header">
                                            <h4>{task.title}</h4>
                                            <div className="card-actions-menu">
                                                <button
                                                    type="button"
                                                    className="btn-icon"
                                                    onClick={() => onEditTask(task)}
                                                    aria-label={`Editar tarefa ${task.title}`}
                                                    title="Editar"
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-icon"
                                                    onClick={() => onDeleteTask(task.id)}
                                                    aria-label={`Excluir tarefa ${task.title}`}
                                                    title="Excluir"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="task-meta-row">
                                            <span className={`priority-badge priority-${task.priority || 'medium'}`}>
                                                {priorityLabels[task.priority] || 'Media'}
                                            </span>
                                            {task.tag && <span className="tag-pill">{task.tag}</span>}
                                        </div>
                                        <div className="card-status-mover">
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => onMoveTask(task.id, 'in-progress')}
                                            >
                                                Iniciar <i className="fa-solid fa-arrow-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Column 2: Em Andamento */}
                    <div className="kanban-col">
                        <div className="col-header header-progress">
                            <span className="col-title"><i className="fa-solid fa-spinner"></i> Em Andamento</span>
                            <span className="col-count">{inProgressTasks.length}</span>
                        </div>
                        <div className="col-body">
                            {inProgressTasks.length === 0 ? (
                                <p className="col-empty-msg">Nenhuma tarefa em andamento</p>
                            ) : (
                                inProgressTasks.map(task => (
                                    <div key={task.id} className="task-card">
                                        <div className="task-card-header">
                                            <h4>{task.title}</h4>
                                            <div className="card-actions-menu">
                                                <button
                                                    type="button"
                                                    className="btn-icon"
                                                    onClick={() => onEditTask(task)}
                                                    aria-label={`Editar tarefa ${task.title}`}
                                                    title="Editar"
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-icon"
                                                    onClick={() => onDeleteTask(task.id)}
                                                    aria-label={`Excluir tarefa ${task.title}`}
                                                    title="Excluir"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="task-meta-row">
                                            <span className={`priority-badge priority-${task.priority || 'medium'}`}>
                                                {priorityLabels[task.priority] || 'Media'}
                                            </span>
                                            {task.tag && <span className="tag-pill">{task.tag}</span>}
                                        </div>
                                        <div className="card-status-mover">
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => onMoveTask(task.id, 'todo')}
                                            >
                                                <i className="fa-solid fa-arrow-left"></i> A Fazer
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm"
                                                onClick={() => onMoveTask(task.id, 'done')}
                                            >
                                                Concluir <i className="fa-solid fa-check"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Column 3: Concluidas */}
                    <div className="kanban-col">
                        <div className="col-header header-completed">
                            <span className="col-title"><i className="fa-solid fa-circle-check"></i> Concluidas</span>
                            <span className="col-count">{doneTasks.length}</span>
                        </div>
                        <div className="col-body">
                            {doneTasks.length === 0 ? (
                                <p className="col-empty-msg">Nenhuma tarefa concluida hoje</p>
                            ) : (
                                doneTasks.map(task => (
                                    <div key={task.id} className="task-card completed">
                                        <div className="task-card-header">
                                            <h4>{task.title}</h4>
                                            <div className="card-actions-menu">
                                                <button
                                                    type="button"
                                                    className="btn-icon"
                                                    onClick={() => onEditTask(task)}
                                                    aria-label={`Editar tarefa ${task.title}`}
                                                    title="Editar"
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-icon"
                                                    onClick={() => onDeleteTask(task.id)}
                                                    aria-label={`Excluir tarefa ${task.title}`}
                                                    title="Excluir"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="task-meta-row">
                                            <span className={`priority-badge priority-${task.priority || 'medium'}`}>
                                                {priorityLabels[task.priority] || 'Media'}
                                            </span>
                                            {task.tag && <span className="tag-pill">{task.tag}</span>}
                                        </div>
                                        <div className="card-status-mover">
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => onMoveTask(task.id, 'todo')}
                                            >
                                                <i className="fa-solid fa-rotate-left"></i> Reabrir
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
