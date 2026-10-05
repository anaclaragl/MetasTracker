import React, { useEffect, useRef } from 'react';

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirmar',
    isDanger = false,
    onConfirm,
    onClose
}) {
    const cancelBtnRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            cancelBtnRef.current?.focus();
        }
    }, [isOpen]);

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

    return (
        <div
            className="modal-overlay active"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-desc"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="modal-card confirm-modal-card">
                <div className="modal-header">
                    <h3 id="confirm-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className={`fa-solid ${isDanger ? 'fa-triangle-exclamation' : 'fa-circle-question'}`} style={{ color: isDanger ? '#ef4444' : 'var(--primary)' }}></i>
                        {title}
                    </h3>
                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        &times;
                    </button>
                </div>
                <div className="confirm-modal-body">
                    <p id="confirm-modal-desc" style={{ color: 'var(--text-secondary)', lineHeight: 1.5, margin: '1rem 0' }}>
                        {message}
                    </p>
                </div>
                <div className="modal-actions">
                    <button
                        type="button"
                        ref={cancelBtnRef}
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
