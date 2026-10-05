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
                        {isEdit ? 'Editar Tarefa' : 'Nova Tarefa Diaria'}
                    </h3>
                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Fechar modal"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="task-title">Titulo da Tarefa *</label>
                        <input
                            id="task-title"
                            type="text"
                            placeholder="Ex: Enviar relatorio mensal, Comprar cafe, Ligar para cliente"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-row-2">
                        <div className="form-group">
                            <label htmlFor="task-priority">Prioridade</label>
                            <select
                                id="task-priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="high">Alta Prioridade</option>
                                <option value="medium">Media Prioridade</option>
                                <option value="low">Baixa Prioridade</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="task-status">Status Inicial</label>
                            <select
                                id="task-status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="todo">A Fazer</option>
                                <option value="in-progress">Em Andamento</option>
                                <option value="done">Concluida</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="task-tag">Categoria / Tag (Opcional)</label>
                        <input
                            id="task-tag"
                            type="text"
                            placeholder="Ex: Trabalho, Pessoal, Urgente"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Salvar Tarefa
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
