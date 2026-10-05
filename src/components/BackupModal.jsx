import React, { useRef, useState } from 'react';

export default function BackupModal({
    isOpen,
    onClose,
    state,
    onImportState,
    onResetState,
    onClearState,
    getTodayDateString,
    showToast
}) {
    const fileInputRef = useRef(null);
    const [confirmingAction, setConfirmingAction] = useState(null); // 'reset' | 'clear' | null

    if (!isOpen) return null;

    const handleExport = () => {
        try {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `metas_tracker_backup_${getTodayDateString()}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            showToast('Backup exportado com sucesso!', 'success');
        } catch {
            showToast('Erro ao exportar backup.', 'error');
        }
    };

    const handleImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                if (parsed.habits && parsed.projects && parsed.milestones) {
                    if (!Array.isArray(parsed.tasks)) parsed.tasks = [];
                    onImportState(parsed);
                    showToast('Dados importados com sucesso!', 'success');
                    onClose();
                } else {
                    showToast('Arquivo JSON invalido. Estrutura incorreta.', 'error');
                }
            } catch {
                showToast('Erro ao ler o arquivo de backup.', 'error');
            }
        };
        reader.readAsText(file);
        e.target.value = null;
    };

    const handleExecuteReset = () => {
        onResetState();
        setConfirmingAction(null);
        onClose();
    };

    const handleExecuteClear = () => {
        onClearState();
        setConfirmingAction(null);
        onClose();
    };

    return (
        <div
            className="modal-overlay active"
            role="dialog"
            aria-modal="true"
            aria-labelledby="backup-modal-title"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="modal-card" style={{ maxWidth: '480px' }}>
                <div className="modal-header">
                    <h3 id="backup-modal-title">
                        <i className="fa-solid fa-database" style={{ marginRight: '8px' }}></i>
                        Backup & Gerenciamento de Dados
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
                <div className="modal-body">
                    {confirmingAction === 'reset' ? (
                        <div className="backup-confirm-box">
                            <h4>Restaurar Dados Padrao?</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.75rem 0' }}>
                                Isso substituira suas tarefas, habitos e metas atuais pelos dados de exemplo iniciais.
                            </p>
                            <div className="modal-actions" style={{ marginTop: '1rem' }}>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setConfirmingAction(null)}
                                >
                                    Voltar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={handleExecuteReset}
                                >
                                    Confirmar Restauracao
                                </button>
                            </div>
                        </div>
                    ) : confirmingAction === 'clear' ? (
                        <div className="backup-confirm-box">
                            <h4 style={{ color: '#ef4444' }}>
                                <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '6px' }}></i>
                                Apagar Todos os Dados?
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.75rem 0' }}>
                                ATENCAO: Esta acao ira remover permanentemente todos os seus habitos, tarefas, projetos e historicos salvos neste navegador.
                            </p>
                            <div className="modal-actions" style={{ marginTop: '1rem' }}>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setConfirmingAction(null)}
                                >
                                    Voltar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleExecuteClear}
                                >
                                    Apagar Tudo Definitivamente
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Export */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>Exportar Backup (JSON)</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                    Baixe um arquivo seguro contendo todas as suas metas, habitos e projetos.
                                </p>
                                <button type="button" className="btn btn-primary btn-block" onClick={handleExport}>
                                    <i className="fa-solid fa-download"></i> Exportar Arquivo
                                </button>
                            </div>

                            {/* Import */}
                            <div style={{ marginBottom: '1.5rem', borderTop: '2px dashed var(--border-color)', paddingTop: '1.25rem' }}>
                                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>Importar Backup (JSON)</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                    Carregue um arquivo JSON exportado previamente para restaurar seus dados.
                                </p>
                                <input
                                    type="file"
                                    id="import-json-input"
                                    accept=".json"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                <button type="button" className="btn btn-secondary btn-block" onClick={handleImportClick}>
                                    <i className="fa-solid fa-upload"></i> Carregar Arquivo
                                </button>
                            </div>

                            {/* Danger Zone Actions */}
                            <div style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '1.25rem' }}>
                                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>Outras Acoes</h4>
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        style={{ flex: 1 }}
                                        onClick={() => setConfirmingAction('reset')}
                                    >
                                        Restaurar Padrao
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        style={{ flex: 1 }}
                                        onClick={() => setConfirmingAction('clear')}
                                    >
                                        Apagar Tudo
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
