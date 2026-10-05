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
    const [unit, setUnit] = useState('unidades');
    const [category, setCategory] = useState('produtividade');
    const [icon, setIcon] = useState('fa-bullseye');

    useEffect(() => {
        if (habit && isEdit) {
            setTitle(habit.title || '');
            setTarget(habit.target || 1);
            setUnit(habit.unit || 'unidades');
            setCategory(habit.category || 'produtividade');
            setIcon(habit.icon || 'fa-bullseye');
        } else {
            setTitle('');
            setTarget(1);
            setUnit('unidades');
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
            unit: unit.trim() || 'unidades',
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
                        {isEdit ? 'Editar Habito' : 'Novo Habito / Meta Diaria'}
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
                        <label htmlFor="habit-title">Nome do Habito / Meta *</label>
                        <input
                            id="habit-title"
                            type="text"
                            placeholder="Ex: Mandar curriculos, Estudar React, Beber agua"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-row-2">
                        <div className="form-group">
                            <label htmlFor="habit-target">Meta Diaria (Quantidade)</label>
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
                            <label htmlFor="habit-unit">Unidade de Medida</label>
                            <input
                                id="habit-unit"
                                type="text"
                                placeholder="Ex: curriculos, minutos, paginas"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-row-2">
                        <div className="form-group">
                            <label htmlFor="habit-category">Categoria</label>
                            <select
                                id="habit-category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="carreira">Carreira / Emprego</option>
                                <option value="estudo">Estudo & Aprendizado</option>
                                <option value="saude">Saude & Bem-Estar</option>
                                <option value="produtividade">Produtividade</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="habit-icon">Icone Visual</label>
                            <select
                                id="habit-icon"
                                value={icon}
                                onChange={(e) => setIcon(e.target.value)}
                            >
                                <option value="fa-file-lines">Curriculo / Documento</option>
                                <option value="fa-laptop-code">Programacao / Codigo</option>
                                <option value="fa-book">Leitura / Livro</option>
                                <option value="fa-dumbbell">Exercicio / Saude</option>
                                <option value="fa-briefcase">Trabalho / Carreira</option>
                                <option value="fa-bullseye">Foco / Meta</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Salvar Habito
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
