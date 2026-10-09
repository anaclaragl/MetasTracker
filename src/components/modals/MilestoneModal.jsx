import React, { useState, useEffect } from 'react';
import { normalizeCategory } from '../../utils/categoryUtils';

export default function MilestoneModal({
    isOpen,
    isEdit,
    milestone,
    onClose,
    onSave
}) {
    const [title, setTitle] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [category, setCategory] = useState('career');
    const [notes, setNotes] = useState('');
    const [stepTitles, setStepTitles] = useState(['']);

    useEffect(() => {
        if (milestone && isEdit) {
            setTitle(milestone.title || '');
            setTargetDate(milestone.targetDate || '');
            setCategory(normalizeCategory(milestone.category || 'career'));
            setNotes(milestone.notes || '');
            const titles = milestone.steps && milestone.steps.length > 0
                ? milestone.steps.map(s => s.title)
                : [''];
            setStepTitles(titles);
        } else {
            setTitle('');
            setTargetDate('');
            setCategory('career');
            setNotes('');
            setStepTitles(['']);
        }
    }, [milestone, isEdit, isOpen]);

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

    const handleAddStepField = () => {
        setStepTitles(prev => [...prev, '']);
    };

    const handleRemoveStepField = (index) => {
        setStepTitles(prev => {
            const updated = prev.filter((_, i) => i !== index);
            return updated.length > 0 ? updated : [''];
        });
    };

    const handleStepChange = (index, value) => {
        setStepTitles(prev => prev.map((item, i) => i === index ? value : item));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        const steps = stepTitles
            .map((stepTitle, idx) => {
                if (isEdit && milestone?.steps?.[idx] && milestone.steps[idx].title === stepTitle) {
                    return milestone.steps[idx];
                }
                return {
                    id: 'milestone-step-' + Date.now() + '-' + idx,
                    title: stepTitle.trim(),
                    done: false
                };
            })
            .filter(step => step.title.length > 0);

        onSave({
            ...(isEdit && milestone ? { id: milestone.id } : {}),
            title: title.trim(),
            targetDate,
            category,
            notes: notes.trim(),
            steps
        });
        onClose();
    };

    return (
        <div
            className="modal-overlay active"
            role="dialog"
            aria-modal="true"
            aria-labelledby="milestone-modal-title"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="modal-card">
                <div className="modal-header">
                    <h3 id="milestone-modal-title">
                        {isEdit ? 'Edit Major Goal' : 'New Major Goal'}
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
                        <label htmlFor="milestone-title">Goal Title *</label>
                        <input
                            id="milestone-title"
                            type="text"
                            placeholder="e.g. Land a Senior Tech Engineering Role, Cloud DevOps Certification"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-row-2">
                        <div className="form-group">
                            <label htmlFor="milestone-target-date">Target Date / Deadline</label>
                            <input
                                id="milestone-target-date"
                                type="date"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="milestone-category">Category</label>
                            <select
                                id="milestone-category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="career">Career & Professional</option>
                                <option value="finance">Finance & Savings</option>
                                <option value="knowledge">Knowledge & Learning</option>
                                <option value="personal">Personal & Life</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="milestone-notes">Action Notes / Strategic Summary</label>
                        <textarea
                            id="milestone-notes"
                            rows="3"
                            placeholder="What key strategy will help you reach this goal? (e.g. Optimize portfolio, apply to targeted roles, practice mock interviews)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Action Plan Roadmap (Checklist)</label>
                        <div id="milestone-step-inputs-list">
                            {stepTitles.map((sTitle, idx) => (
                                <div className="dynamic-input-row" key={idx}>
                                    <input
                                        type="text"
                                        className="milestone-step-input-val"
                                        placeholder="e.g. Complete 5 mock interview sessions"
                                        value={sTitle}
                                        onChange={(e) => handleStepChange(idx, e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn-icon"
                                        onClick={() => handleRemoveStepField(idx)}
                                        aria-label="Remove step"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm mt-2"
                            onClick={handleAddStepField}
                        >
                            <i className="fa-solid fa-plus"></i> Add Step
                        </button>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Goal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
