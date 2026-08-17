import React, { useRef } from 'react';

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
        } catch (e) {
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
                    alert('Arquivo JSON inválido. Estrutura incorreta.');
                }
            } catch (err) {
                alert('Erro ao ler o arquivo de backup.');
            }
        };
        reader.readAsText(file);
        // Reset file value to allow importing the same file again
        e.target.value = null;
    };

    const handleReset = () => {
        if (confirm('Restaurar dados de exemplo? Isso substituirá suas alterações atuais.')) {
            onResetState();
            showToast('Dados de exemplo restaurados!', 'info');
            onClose();
        }
    };

    const handleClear = () => {
        if (confirm('ATENÇÃO: Deseja apagar TODOS os seus hábitos, tarefas, projetos e metas?')) {
            onClearState();
            showToast('Todos os dados foram zerados.', 'warning');
            onClose();
        }
    };

    return (
        <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-card" style={{ maxWidth: '450px' }}>
                <div className="modal-header">
                    <h3><i className="fa-solid fa-database"></i> Backup & Gerenciamento de Dados</h3>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {/* Export */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4>Exportar Backup (JSON)</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            Baixe um arquivo contendo todas as suas metas, hábitos e projetos.
                        </p>
                        <button className="btn btn-primary btn-block" onClick={handleExport}>
                            Exportar Arquivo
                        </button>
                    </div>

                    {/* Import */}
                    <div style={{ marginBottom: '1.5rem', borderTop: '2px dashed var(--border-color)', paddingTop: '1.25rem' }}>
                        <h4>Importar Backup (JSON)</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            ATENÇÃO: Isso substituirá todos os seus dados atuais pelo arquivo importado.
                        </p>
                        <input
                            type="file"
                            id="import-json-input"
                            accept=".json"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <button className="btn btn-secondary btn-block" onClick={handleImportClick}>
                            Carregar Arquivo
                        </button>
                    </div>

                    {/* Actions */}
                    <div style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '1.25rem' }}>
                        <h4>Outras Ações</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleReset}>
                                Resetar Exemplo
                            </button>
                            <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleClear}>
                                Apagar Tudo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
