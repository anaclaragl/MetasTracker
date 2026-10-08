import React, { useState } from 'react';

export default function TasksTab({
    state,
    onMoveTask,
    onEditTask,
    onDeleteTask,
    onAddTaskBtnClick
}) {
    const [searchTerm, setSearchTerm] = useState('');

    const priorityLabels = {
        high: 'HIGH PRIORITY',
        medium: 'MEDIUM PRIORITY',
        low: 'LOW PRIORITY'
    };

    const tasks = state.tasks || [];

    const filteredTasks = tasks.filter(task => {
        return task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
               (task.tag && task.tag.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    const todoTasks = filteredTasks.filter(t => t.status === 'todo');
    const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress');
    const doneTasks = filteredTasks.filter(t => t.status === 'done');

    return (
        <section id="tab-tasks" className="tab-content active">
            <div className="section-toolbar">
                <div className="search-filter">
                    <div className="input-with-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            placeholder="Search tasks or tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Search tasks or tags"
                        />
                    </div>
                </div>
                <button className="btn btn-primary" onClick={onAddTaskBtnClick}>
                    <i className="fa-solid fa-plus"></i> New Task
                </button>
            </div>

            {/* Daily Tasks Kanban Board */}
            {filteredTasks.length === 0 ? (
                <div className="empty-state-box">
                    <div className="empty-state-icon">
                        <i className="fa-solid fa-clipboard-list"></i>
                    </div>
                    <h4>No tasks found</h4>
                    <p>Add new tasks to organize your daily routine on the Kanban board.</p>
                    <button className="btn btn-primary btn-sm" onClick={onAddTaskBtnClick}>
                        <i className="fa-solid fa-plus"></i> Create New Task
                    </button>
                </div>
            ) : (
                <div className="kanban-board">
                    {/* Column 1: To Do */}
                    <div className="kanban-col">
                        <div className="col-header header-todo">
                            <span className="col-title"><i className="fa-regular fa-clipboard"></i> To Do</span>
                            <span className="col-count">{todoTasks.length}</span>
                        </div>
                        <div className="col-body">
                            {todoTasks.length === 0 ? (
                                <p className="col-empty-msg">No tasks to do</p>
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
                                                    aria-label={`Edit task ${task.title}`}
                                                    title="Edit"
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-icon"
                                                    onClick={() => onDeleteTask(task.id)}
                                                    aria-label={`Delete task ${task.title}`}
                                                    title="Delete"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="task-meta-row">
                                            <span className={`priority-badge priority-${task.priority || 'medium'}`}>
                                                {priorityLabels[task.priority] || 'MEDIUM'}
                                            </span>
                                            {task.tag && <span className="tag-pill">{task.tag}</span>}
                                        </div>
                                        <div className="card-status-mover">
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => onMoveTask(task.id, 'in-progress')}
                                            >
                                                Start <i className="fa-solid fa-arrow-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Column 2: In Progress */}
                    <div className="kanban-col">
                        <div className="col-header header-progress">
                            <span className="col-title"><i className="fa-solid fa-spinner"></i> In Progress</span>
                            <span className="col-count">{inProgressTasks.length}</span>
                        </div>
                        <div className="col-body">
                            {inProgressTasks.length === 0 ? (
                                <p className="col-empty-msg">No tasks in progress</p>
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
                                                    aria-label={`Edit task ${task.title}`}
                                                    title="Edit"
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-icon"
                                                    onClick={() => onDeleteTask(task.id)}
                                                    aria-label={`Delete task ${task.title}`}
                                                    title="Delete"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="task-meta-row">
                                            <span className={`priority-badge priority-${task.priority || 'medium'}`}>
                                                {priorityLabels[task.priority] || 'MEDIUM'}
                                            </span>
                                            {task.tag && <span className="tag-pill">{task.tag}</span>}
                                        </div>
                                        <div className="card-status-mover">
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => onMoveTask(task.id, 'todo')}
                                            >
                                                <i className="fa-solid fa-arrow-left"></i> To Do
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm"
                                                onClick={() => onMoveTask(task.id, 'done')}
                                            >
                                                Complete <i className="fa-solid fa-check"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Column 3: Completed */}
                    <div className="kanban-col">
                        <div className="col-header header-completed">
                            <span className="col-title"><i className="fa-solid fa-circle-check"></i> Completed</span>
                            <span className="col-count">{doneTasks.length}</span>
                        </div>
                        <div className="col-body">
                            {doneTasks.length === 0 ? (
                                <p className="col-empty-msg">No tasks completed yet</p>
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
                                                    aria-label={`Edit task ${task.title}`}
                                                    title="Edit"
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-icon"
                                                    onClick={() => onDeleteTask(task.id)}
                                                    aria-label={`Delete task ${task.title}`}
                                                    title="Delete"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="task-meta-row">
                                            <span className={`priority-badge priority-${task.priority || 'medium'}`}>
                                                {priorityLabels[task.priority] || 'MEDIUM'}
                                            </span>
                                            {task.tag && <span className="tag-pill">{task.tag}</span>}
                                        </div>
                                        <div className="card-status-mover">
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => onMoveTask(task.id, 'todo')}
                                            >
                                                <i className="fa-solid fa-rotate-left"></i> Reopen
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
