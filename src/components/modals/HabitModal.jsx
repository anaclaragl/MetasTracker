import React, { useState, useEffect } from 'react';

export default function HabitModal({
    isOpen,
    isEdit,
    habit,
    onClose,
    onSave
}) {
    const [title, setTitle] = useState('');
    const [target, setTarget] = useState(1);
    const [unit, setUnit] = useState('times');
    const [category, setCategory] = useState('produtividade');
    const [icon, setIcon] = useState('fa-bullseye');

    useEffect(() => {
        if (habit && isEdit) {
            setTitle(habit.title || '');
            setTarget(habit.target || 1);
            setUnit(habit.unit || 'times');
            setCategory(habit.category || 'produtividade');
            setIcon(habit.icon || 'fa-bullseye');
        } else {
            setTitle('');
            setTarget(1);
            setUnit('times');
            setCategory('produtividade');
            setIcon('fa-bullseye');
        }
    }, [habit, isEdit, isOpen]);

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
            ...(isEdit && habit ? { id: habit.id } : {}),
            title: title.trim(),
            target: parseInt(target, 10) || 1,
            unit: unit.trim() || 'times',
            category,
            icon
        });
        onClose();
    };

    return (
        <div
            className="modal-overlay active"
            role="dialog"
            aria-modal="true"
            aria-labelledby="habit-modal-title"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="modal-card">
                <div className="modal-header">
                    <h3 id="habit-modal-title">
                        {isEdit ? 'Edit Habit' : 'New Habit / Daily Goal'}
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
                        <label htmlFor="habit-title">Habit / Goal Name *</label>
                        <input
                            id="habit-title"
                            type="text"
                            placeholder="e.g. Send resumes, Study system design, Drink water"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-row-2">
                        <div className="form-group">
                            <label htmlFor="habit-target">Daily Target (Count)</label>
                            <input
                                id="habit-target"
                                type="number"
                                min="1"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="habit-unit">Unit of Measurement</label>
                            <input
                                id="habit-unit"
                                type="text"
                                placeholder="e.g. resumes, minutes, pages, reps"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-row-2">
                        <div className="form-group">
                            <label htmlFor="habit-category">Category</label>
                            <select
                                id="habit-category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="carreira">Career / Jobs</option>
                                <option value="estudo">Study & Learning</option>
                                <option value="saude">Health & Wellness</option>
                                <option value="produtividade">Productivity</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="habit-icon">Visual Icon</label>
                            <select
                                id="habit-icon"
                                value={icon}
                                onChange={(e) => setIcon(e.target.value)}
                            >
                                <option value="fa-file-lines">Resume / Document</option>
                                <option value="fa-laptop-code">Programming / Code</option>
                                <option value="fa-book">Reading / Book</option>
                                <option value="fa-dumbbell">Exercise / Health</option>
                                <option value="fa-briefcase">Work / Career</option>
                                <option value="fa-bullseye">Focus / Target</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Habit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
