import React, { useState, useEffect } from 'react';

export default function TaskModal({
    isOpen,
    isEdit,
    task,
    onClose,
    onSave
}) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('medium');
    const [status, setStatus] = useState('todo');
    const [tag, setTag] = useState('');

    useEffect(() => {
        if (task && isEdit) {
            setTitle(task.title || '');
            setPriority(task.priority || 'medium');
            setStatus(task.status || 'todo');
            setTag(task.tag || '');
        } else {
            setTitle('');
            setPriority('medium');
            setStatus('todo');
            setTag('');
        }
    }, [task, isEdit, isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        onSave({
            ...(isEdit && task ? { id: task.id } : {}),
            title: title.trim(),
            priority,
            status,
            tag: tag.trim()
        });
        onClose();
    };

    return (
        <div
            className="modal-overlay active"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="modal-card">
                <div className="modal-header">
                    <h3 id="task-modal-title">
                        {isEdit ? 'Edit Task' : 'New Daily Task'}
                    </h3>
                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="task-title">Task Title *</label>
                        <input
                            id="task-title"
                            type="text"
                            placeholder="e.g. Review pull request, Draft proposal, Prepare meeting slides"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-row-2">
                        <div className="form-group">
                            <label htmlFor="task-priority">Priority</label>
                            <select
                                id="task-priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="high">High Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="low">Low Priority</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="task-status">Initial Status</label>
                            <select
                                id="task-status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="task-tag">Category / Tag (Optional)</label>
                        <input
                            id="task-tag"
                            type="text"
                            placeholder="e.g. Career, Engineering, Urgent"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
