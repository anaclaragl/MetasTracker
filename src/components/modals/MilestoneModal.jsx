import React, { useState, useEffect } from 'react';

export default function MilestoneModal({
    isOpen,
    isEdit,
    milestone,
    onClose,
    onSave
}) {
    const [title, setTitle] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [category, setCategory] = useState('carreira');
    const [notes, setNotes] = useState('');
    const [stepTitles, setStepTitles] = useState(['']);

    useEffect(() => {
        if (milestone && isEdit) {
            setTitle(milestone.title || '');
            setTargetDate(milestone.targetDate || '');
            setCategory(milestone.category || 'carreira');
            setNotes(milestone.notes || '');
            const titles = milestone.steps && milestone.steps.length > 0
                ? milestone.steps.map(s => s.title)
                : [''];
            setStepTitles(titles);
        } else {
            setTitle('');
            setTargetDate('');
            setCategory('carreira');
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
                        {isEdit ? 'Editar Grande Meta' : 'Nova Grande Meta'}
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
                        <label htmlFor="milestone-title">Titulo da Meta *</label>
                        <input
                            id="milestone-title"
                            type="text"
                            placeholder="Ex: Conseguir um Emprego Melhor como Dev, Certificacao Cloud"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-row-2">
                        <div className="form-group">
                            <label htmlFor="milestone-target-date">Data Alvo / Prazo Desejado</label>
                            <input
                                id="milestone-target-date"
                                type="date"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="milestone-category">Categoria</label>
                            <select
                                id="milestone-category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="carreira">Carreira & Profissional</option>
                                <option value="financas">Financas & Economia</option>
                                <option value="conhecimento">Conhecimento & Estudos</option>
                                <option value="pessoal">Projeto Pessoal & Vida</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="milestone-notes">Plano de Acao / Anotacoes Estrategicas</label>
                        <textarea
                            id="milestone-notes"
                            rows="3"
                            placeholder="O que voce precisa fazer para alcancar esta meta? (Ex: Ajustar curriculo, aplicar para 50 vagas, treinar entrevistas)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Etapas de Conclusao (Checklist)</label>
                        <div id="milestone-step-inputs-list">
                            {stepTitles.map((sTitle, idx) => (
                                <div className="dynamic-input-row" key={idx}>
                                    <input
                                        type="text"
                                        className="milestone-step-input-val"
                                        placeholder="Ex: Passo de acao..."
                                        value={sTitle}
                                        onChange={(e) => handleStepChange(idx, e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn-icon"
                                        onClick={() => handleRemoveStepField(idx)}
                                        aria-label="Remover etapa"
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
                            <i className="fa-solid fa-plus"></i> Adicionar Etapa
                        </button>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Salvar Meta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
