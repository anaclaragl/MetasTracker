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
            showToast('Gemini API key saved successfully!', 'success');
        } else {
            localStorage.removeItem('gemini_api_key');
            showToast('API key removed.', 'info');
        }
    };

    const extractJsonFromText = (text) => {
        if (!text) throw new Error('AI returned an empty response.');

        // 1. Direct parse
        try {
            return JSON.parse(text.trim());
        } catch (e) { }

        // 2. Remove markdown code block syntax
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

        throw new Error('Unable to extract a valid JSON structure from AI output.');
    };

    const handleGenerate = async () => {
        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt) {
            showToast('Please describe your routines, tasks, or goals.', 'warning');
            return;
        }

        const savedKey = localStorage.getItem('gemini_api_key') || apiKey.trim();
        if (!savedKey) {
            showToast('Please enter your free Google Gemini API key.', 'warning');
            return;
        }

        setIsGenerating(true);

        try {
            const systemInstruction = `You are an AI assistant for MetasTracker.
Analyze the user's input and extract habits, daily tasks, projects (with subtasks), and long-term milestones.
All output titles, descriptions, and labels must be written in English.
Do NOT use emojis in any generated content.
Respond ONLY with a valid JSON object matching this schema:
{
  "habits": [
    { "title": "...", "target": 5, "unit": "resumes|minutes|pages|times", "category": "carreira|estudo|saude|produtividade", "icon": "fa-bullseye" }
  ],
  "tasks": [
    { "title": "...", "priority": "high|medium|low", "tag": "Career|Engineering|Personal" }
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
                        lastError = errData.error?.message || `HTTP ${response.status} when querying model ${model}`;
                    }
                } catch (err) {
                    lastError = err.message;
                }
            }

            if (!rawText) {
                throw new Error(lastError || 'Unable to generate content with the available models for this key.');
            }

            const parsed = extractJsonFromText(rawText);
            setGeneratedItems(parsed);
            showToast('Items generated successfully! Review them below.', 'success');
        } catch (err) {
            console.error('Gemini error:', err);
            showToast(`AI Error: ${err.message}`, 'error');
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
                previewList.push({ type: 'Daily Habit', title: h.title, subtitle: `${h.target} ${h.unit || 'times'} / day`, key: `h-${i}` });
            });
        }
        if (Array.isArray(generatedItems.tasks)) {
            generatedItems.tasks.forEach((t, i) => {
                const priorityLabels = { high: 'high', medium: 'medium', low: 'low' };
                previewList.push({ type: 'Daily Task', title: t.title, subtitle: `Priority: ${priorityLabels[t.priority] || 'medium'}`, key: `t-${i}` });
            });
        }
        if (Array.isArray(generatedItems.projects)) {
            generatedItems.projects.forEach((p, i) => {
                const subCount = p.subtasks ? p.subtasks.length : 0;
                previewList.push({ type: 'Project', title: p.title, subtitle: `${subCount} subtasks`, key: `p-${i}` });
            });
        }
        if (Array.isArray(generatedItems.milestones)) {
            generatedItems.milestones.forEach((m, i) => {
                const stepsCount = m.steps ? m.steps.length : 0;
                previewList.push({ type: 'Major Goal', title: m.title, subtitle: `${stepsCount} steps`, key: `m-${i}` });
            });
        }
    }

    return (
        <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-card" style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h3><i className="fa-solid fa-wand-magic-sparkles"></i> AI Plan Generator</h3>
                    <button className="modal-close" onClick={onClose} aria-label="Close modal">&times;</button>
                </div>
                <div className="modal-body">
                    {/* Setup API Key Section */}
                    <div className="setup-box" style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--border-color)', background: 'var(--bg-main)', borderRadius: '8px' }}>
                        <div style={{ marginBottom: '0.75rem' }}>
                            <strong><i className="fa-solid fa-key"></i> Free Google Gemini API Key</strong>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                Stored locally in your browser. Get a free API key at Google AI Studio.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="password"
                                placeholder="Paste your API key here (AIzaSy...)"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button className="btn btn-secondary" onClick={handleSaveKey}>Save Key</button>
                        </div>
                    </div>

                    {/* Generator prompt */}
                    <div className="form-group">
                        <label htmlFor="ai-prompt-input">Describe your routines, objectives, or projects:</label>
                        <textarea
                            id="ai-prompt-input"
                            rows="4"
                            placeholder="e.g. I want to study algorithms for 60 min, send 5 job applications, and drink 2L of water daily. I also want to land a senior developer role in 3 months by updating my resume and practicing interview questions."
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
                            <><i className="fa-solid fa-spinner fa-spin"></i> Analyzing with Gemini...</>
                        ) : (
                            <><i className="fa-solid fa-wand-magic-sparkles"></i> Generate Items with AI</>
                        )}
                    </button>

                    {/* Preview Section */}
                    {generatedItems && (
                        <div id="ai-preview-container" style={{ display: 'block', marginTop: '1.5rem' }}>
                            <div style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '1.25rem', marginBottom: '1rem' }}>
                                <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>Generated Items Preview:</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Review and accept</span>
                                </h4>
                            </div>
                            <div id="ai-preview-items-list" className="preview-items-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {previewList.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        No items recognized. Try providing more descriptive details.
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
                                    Confirm and Add All {previewList.length} Items
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
