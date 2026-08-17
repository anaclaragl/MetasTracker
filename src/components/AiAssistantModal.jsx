import React, { useState, useEffect } from 'react';

export default function AiAssistantModal({
    isOpen,
    onClose,
    onAcceptAiItems,
    showToast
}) {
    const [apiKey, setApiKey] = useState('');
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedItems, setGeneratedItems] = useState(null);

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key') || '';
        setApiKey(savedKey);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSaveKey = () => {
        if (apiKey.trim()) {
            localStorage.setItem('gemini_api_key', apiKey.trim());
            showToast('Chave da API Gemini salva com sucesso!', 'success');
        } else {
            localStorage.removeItem('gemini_api_key');
            showToast('Chave removida.', 'info');
        }
    };

    const extractJsonFromText = (text) => {
        if (!text) throw new Error('A IA não retornou nenhum conteúdo.');

        // 1. Direct parse
        try {
            return JSON.parse(text.trim());
        } catch (e) { }

        // 2. Remove markdown code block syntax (```json ... ``` or ``` ... ```)
        const codeMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        if (codeMatch && codeMatch[1]) {
            try {
                return JSON.parse(codeMatch[1].trim());
            } catch (e) { }
        }

        // 3. Extract JSON object substring between the first '{' and last '}'
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            let candidate = text.substring(firstBrace, lastBrace + 1);
            try {
                return JSON.parse(candidate);
            } catch (e) { }

            // Fix Python literals, comments & trailing commas
            candidate = candidate
                .replace(/:\s*True\b/g, ': true')
                .replace(/:\s*False\b/g, ': false')
                .replace(/:\s*None\b/g, ': null')
                .replace(/,\s*([\]}])/g, '$1')
                .replace(/\/\/.*$/gm, '');

            try {
                return JSON.parse(candidate);
            } catch (e) { }
        }

        throw new Error('Não foi possível extrair uma estrutura JSON válida dos resultados da IA.');
    };

    const handleGenerate = async () => {
        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt) {
            showToast('Por favor, digite suas rotinas, tarefas ou metas.', 'warning');
            return;
        }

        const savedKey = localStorage.getItem('gemini_api_key') || apiKey.trim();
        if (!savedKey) {
            showToast('Por favor, informe sua chave de API gratuita do Google Gemini.', 'warning');
            return;
        }

        setIsGenerating(true);

        try {
            const systemInstruction = `You are an AI assistant for MetasTracker.
Analyze the user's input and extract habits, daily tasks, projects (with subtasks), and long-term milestones.
Respond ONLY with a valid JSON object matching this schema:
{
  "habits": [
    { "title": "...", "target": 5, "unit": "currículos|minutos|páginas|vezes", "category": "carreira|estudo|saude|produtividade", "icon": "fa-bullseye" }
  ],
  "tasks": [
    { "title": "...", "priority": "high|medium|low", "tag": "Trabalho|Pessoal|..." }
  ],
  "projects": [
    { "title": "...", "description": "...", "tags": ["tag1", "tag2"], "subtasks": ["subtask 1", "subtask 2"] }
  ],
  "milestones": [
    { "title": "...", "category": "carreira|conhecimento|pessoal", "notes": "...", "steps": ["step 1", "step 2"] }
  ]
}`;

            let modelCandidates = ['gemini-3.1-flash-lite'];
            try {
                const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(savedKey)}`);
                if (listRes.ok) {
                    const listData = await listRes.json();
                    if (Array.isArray(listData.models)) {
                        const available = listData.models
                            .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
                            .map(m => m.name.replace('models/', ''));

                        const preferred = ['gemini-3.1-flash-lite'];
                        const found = preferred.filter(p => available.includes(p));
                        if (found.length > 0) {
                            modelCandidates = [...new Set([...found, ...modelCandidates])];
                        }
                    }
                }
            } catch (e) {
                console.warn('Could not auto-list Gemini models, using default candidates', e);
            }

            let rawText = null;
            let lastError = null;

            for (const model of modelCandidates) {
                try {
                    const url = 'https://generativelanguage.googleapis.com/v1beta/interactions';
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-goog-api-key': savedKey
                        },
                        body: JSON.stringify({
                            model: model,
                            input: systemInstruction + "\n\nUser Input: " + trimmedPrompt,
                            store: false
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const text = data.outputs?.[0]?.text ||
                            data.steps?.find(s => s.type === "model_output")?.content?.[0]?.text ||
                            data.steps?.[data.steps.length - 1]?.content?.[0]?.text;
                        if (text) {
                            rawText = text;
                            break;
                        }
                    } else {
                        const errData = await response.json().catch(() => ({}));
                        lastError = errData.error?.message || `HTTP ${response.status} ao consultar modelo ${model}`;
                    }
                } catch (err) {
                    lastError = err.message;
                }
            }

            if (!rawText) {
                throw new Error(lastError || 'Não foi possível gerar conteúdo com os modelos disponíveis para esta chave.');
            }

            const parsed = extractJsonFromText(rawText);
            setGeneratedItems(parsed);
            showToast('Itens gerados com sucesso! Confira a prévia abaixo.', 'success');
        } catch (err) {
            console.error('Gemini error:', err);
            showToast(`Erro na IA: ${err.message}`, 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAccept = () => {
        if (!generatedItems) return;
        onAcceptAiItems(generatedItems);
        setGeneratedItems(null);
        setPrompt('');
        onClose();
    };

    // Calculate totals for rendering preview list
    const previewList = [];
    if (generatedItems) {
        if (Array.isArray(generatedItems.habits)) {
            generatedItems.habits.forEach((h, i) => {
                previewList.push({ type: 'Hábito Diário', title: h.title, subtitle: `${h.target} ${h.unit || 'vezes'} / dia`, key: `h-${i}` });
            });
        }
        if (Array.isArray(generatedItems.tasks)) {
            generatedItems.tasks.forEach((t, i) => {
                const priorityLabels = { high: 'alta', medium: 'média', low: 'baixa' };
                previewList.push({ type: 'Tarefa Diária', title: t.title, subtitle: `Prioridade: ${priorityLabels[t.priority] || 'média'}`, key: `t-${i}` });
            });
        }
        if (Array.isArray(generatedItems.projects)) {
            generatedItems.projects.forEach((p, i) => {
                const subCount = p.subtasks ? p.subtasks.length : 0;
                previewList.push({ type: 'Projeto', title: p.title, subtitle: `${subCount} subtarefas`, key: `p-${i}` });
            });
        }
        if (Array.isArray(generatedItems.milestones)) {
            generatedItems.milestones.forEach((m, i) => {
                const stepsCount = m.steps ? m.steps.length : 0;
                previewList.push({ type: 'Grande Meta', title: m.title, subtitle: `${stepsCount} etapas`, key: `m-${i}` });
            });
        }
    }

    return (
        <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-card" style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h3><i className="fa-solid fa-wand-magic-sparkles"></i> Assistente com Inteligência Artificial</h3>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {/* Setup API Key Section */}
                    <div className="setup-box" style={{ marginBottom: '1.5rem', padding: '1rem', border: '2px solid var(--border-color)', background: 'var(--bg-card)' }}>
                        <div style={{ marginBottom: '0.75rem' }}>
                            <strong><i className="fa-solid fa-key"></i> Chave Gratuita do Google Gemini</strong>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                A chave é salva apenas no seu navegador. Obtenha uma no Google AI Studio.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="password"
                                placeholder="Cole sua chave API aqui (AIzaSy...)"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button className="btn btn-secondary" onClick={handleSaveKey}>Salvar Chave</button>
                        </div>
                    </div>

                    {/* Generator prompt */}
                    <div className="form-group">
                        <label htmlFor="ai-prompt-input">Descreva sua rotina, objetivos ou projeto:</label>
                        <textarea
                            id="ai-prompt-input"
                            rows="4"
                            placeholder="Ex: Quero estudar programação por 60 min, mandar 5 currículos e beber 2L de água por dia. Também tenho a meta de conseguir um emprego melhor em 3 meses, o que exige atualizar meu currículo e treinar para entrevistas."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        ></textarea>
                    </div>

                    <button
                        className="btn btn-primary btn-block"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <><i className="fa-solid fa-spinner fa-spin"></i> Analisando com Gemini...</>
                        ) : (
                            <><i className="fa-solid fa-wand-magic-sparkles"></i> Gerar Cartões com IA</>
                        )}
                    </button>

                    {/* Preview Section */}
                    {generatedItems && (
                        <div id="ai-preview-container" style={{ display: 'block', marginTop: '1.5rem' }}>
                            <div style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '1.25rem', marginBottom: '1rem' }}>
                                <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>Prévia de itens gerados:</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Verifique e adicione</span>
                                </h4>
                            </div>
                            <div id="ai-preview-items-list" className="preview-items-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {previewList.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        Nenhum item reconhecido. Tente descrever com mais detalhes.
                                    </p>
                                ) : (
                                    previewList.map(item => (
                                        <div key={item.key} className="ai-preview-item">
                                            <div className="ai-preview-item-info">
                                                <span className="ai-preview-type">{item.type}</span>
                                                <strong>{item.title}</strong>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.subtitle}</span>
                                            </div>
                                            <span style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>
                                                <i className="fa-solid fa-circle-check"></i>
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                            {previewList.length > 0 && (
                                <button className="btn btn-primary btn-block" onClick={handleAccept} style={{ marginTop: '1rem' }}>
                                    Confirmar e Adicionar Todos os {previewList.length} itens
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
