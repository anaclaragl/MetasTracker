import React, { useState, useEffect } from 'react';

export default function ProjectModal({
    isOpen,
    isEdit,
    project,
    onClose,
    onSave
}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('idea');
    const [tagsInput, setTagsInput] = useState('');
    const [subtaskTitles, setSubtaskTitles] = useState(['']);

    useEffect(() => {
        if (project && isEdit) {
            setTitle(project.title || '');
            setDescription(project.description || '');
            setStatus(project.status || 'idea');
            setTagsInput(project.tags ? project.tags.join(', ') : '');
            const titles = project.subtasks && project.subtasks.length > 0
                ? project.subtasks.map(s => s.title)
                : [''];
            setSubtaskTitles(titles);
        } else {
            setTitle('');
            setDescription('');
            setStatus('idea');
            setTagsInput('');
            setSubtaskTitles(['']);
        }
    }, [project, isEdit, isOpen]);

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

    const handleAddSubtaskField = () => {
        setSubtaskTitles(prev => [...prev, '']);
    };

    const handleRemoveSubtaskField = (index) => {
        setSubtaskTitles(prev => {
            const updated = prev.filter((_, i) => i !== index);
            return updated.length > 0 ? updated : [''];
        });
    };

    const handleSubtaskChange = (index, value) => {
        setSubtaskTitles(prev => prev.map((item, i) => i === index ? value : item));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        const tags = tagsInput
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);

        const subtasks = subtaskTitles
            .map((subTitle, idx) => {
                if (isEdit && project?.subtasks?.[idx] && project.subtasks[idx].title === subTitle) {
                    return project.subtasks[idx];
                }
                return {
                    id: 'sub-' + Date.now() + '-' + idx,
                    title: subTitle.trim(),
                    done: false
                };
            })
            .filter(sub => sub.title.length > 0);

        onSave({
            ...(isEdit && project ? { id: project.id } : {}),
            title: title.trim(),
            description: description.trim(),
            status,
            tags,
            subtasks
        });
        onClose();
    };

    return (
        <div
            className="modal-overlay active"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="modal-card">
                <div className="modal-header">
                    <h3 id="project-modal-title">
                        {isEdit ? 'Edit Project' : 'New Project / Idea'}
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
                        <label htmlFor="project-title">Project Name *</label>
                        <input
                            id="project-title"
                            type="text"
                            placeholder="e.g. MetasTracker App, Portfolio 2026, SaaS Analytics"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="project-description">Description / Concept</label>
                        <textarea
                            id="project-description"
                            rows="3"
                            placeholder="Describe project vision, features, and key architecture..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="form-row-2">
                        <div className="form-group">
                            <label htmlFor="project-status">Current Status</label>
                            <select
                                id="project-status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="idea">Idea / Backlog</option>
                                <option value="in-progress">In Development</option>
                                <option value="completed">Completed / Launched</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="project-tags">Technologies / Tags (comma separated)</label>
                            <input
                                id="project-tags"
                                type="text"
                                placeholder="React, TypeScript, Node.js, AI"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Subtasks Checklist</label>
                        <div id="subtask-inputs-list">
                            {subtaskTitles.map((stTitle, idx) => (
                                <div className="dynamic-input-row" key={idx}>
                                    <input
                                        type="text"
                                        className="subtask-input-val"
                                        placeholder="e.g. Implement landing page layout"
                                        value={stTitle}
                                        onChange={(e) => handleSubtaskChange(idx, e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn-icon"
                                        onClick={() => handleRemoveSubtaskField(idx)}
                                        aria-label="Remove subtask"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm mt-2"
                            onClick={handleAddSubtaskField}
                        >
                            <i className="fa-solid fa-plus"></i> Add Subtask
                        </button>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
