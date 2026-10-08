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
            showToast('Backup exported successfully!', 'success');
        } catch {
            showToast('Failed to export backup.', 'error');
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
                    showToast('Data imported successfully!', 'success');
                    onClose();
                } else {
                    showToast('Invalid JSON file. Incompatible structure.', 'error');
                }
            } catch {
                showToast('Error reading the backup file.', 'error');
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
                        Backup & Data Management
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
                <div className="modal-body">
                    {confirmingAction === 'reset' ? (
                        <div className="backup-confirm-box">
                            <h4>Restore Default Data?</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.75rem 0' }}>
                                This will replace your current tasks, habits, and goals with the default sample data.
                            </p>
                            <div className="modal-actions" style={{ marginTop: '1rem' }}>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setConfirmingAction(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={handleExecuteReset}
                                >
                                    Confirm Restore
                                </button>
                            </div>
                        </div>
                    ) : confirmingAction === 'clear' ? (
                        <div className="backup-confirm-box">
                            <h4 style={{ color: '#ef4444' }}>
                                <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '6px' }}></i>
                                Erase All Data?
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.75rem 0' }}>
                                WARNING: This action will permanently remove all your habits, tasks, projects, and logs stored in this browser.
                            </p>
                            <div className="modal-actions" style={{ marginTop: '1rem' }}>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setConfirmingAction(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleExecuteClear}
                                >
                                    Erase Everything
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Export */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>Export Backup (JSON)</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                    Download a safe JSON copy containing your goals, habits, and active projects.
                                </p>
                                <button type="button" className="btn btn-primary btn-block" onClick={handleExport}>
                                    <i className="fa-solid fa-download"></i> Export File
                                </button>
                            </div>

                            {/* Import */}
                            <div style={{ marginBottom: '1.5rem', borderTop: '2px dashed var(--border-color)', paddingTop: '1.25rem' }}>
                                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>Import Backup (JSON)</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                    Load a previously exported JSON backup file to restore your tracker state.
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
                                    <i className="fa-solid fa-upload"></i> Load File
                                </button>
                            </div>

                            {/* Danger Zone Actions */}
                            <div style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '1.25rem' }}>
                                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>Maintenance Actions</h4>
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        style={{ flex: 1 }}
                                        onClick={() => setConfirmingAction('reset')}
                                    >
                                        Restore Defaults
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        style={{ flex: 1 }}
                                        onClick={() => setConfirmingAction('clear')}
                                    >
                                        Clear All Data
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
