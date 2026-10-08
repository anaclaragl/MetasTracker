import React, { useState, useEffect, useRef } from 'react';

/**
 * CommandPalette Component
 * High-precision command menu inspired by Raycast and Linear.
 * Allows quick navigation, action execution, and item search via keyboard or mouse.
 */
export default function CommandPalette({
    isOpen,
    onClose,
    onSwitchTab,
    onOpenNewHabit,
    onOpenNewTask,
    onOpenNewProject,
    onOpenNewMilestone,
    onOpenAiModal,
    onToggleTheme,
    onOpenBackupModal,
    state
}) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Build actions & searchable items
    const navigationActions = [
        {
            id: 'nav-dashboard',
            category: 'Navigation',
            title: 'Go to Dashboard',
            icon: 'fa-chart-pie',
            shortcut: 'Alt + 1',
            action: () => { onSwitchTab('dashboard'); onClose(); }
        },
        {
            id: 'nav-habits',
            category: 'Navigation',
            title: 'Go to Daily Habits',
            icon: 'fa-fire',
            shortcut: 'Alt + 2',
            action: () => { onSwitchTab('habits'); onClose(); }
        },
        {
            id: 'nav-tasks',
            category: 'Navigation',
            title: 'Go to Daily Tasks',
            icon: 'fa-list-check',
            shortcut: 'Alt + 3',
            action: () => { onSwitchTab('tasks'); onClose(); }
        },
        {
            id: 'nav-projects',
            category: 'Navigation',
            title: 'Go to Projects & Ideas',
            icon: 'fa-diagram-project',
            shortcut: 'Alt + 4',
            action: () => { onSwitchTab('projects'); onClose(); }
        },
        {
            id: 'nav-milestones',
            category: 'Navigation',
            title: 'Go to Major Goals',
            icon: 'fa-trophy',
            shortcut: 'Alt + 5',
            action: () => { onSwitchTab('milestones'); onClose(); }
        },
        {
            id: 'nav-analytics',
            category: 'Navigation',
            title: 'Go to Analytics & Insights',
            icon: 'fa-chart-line',
            shortcut: 'Alt + 6',
            action: () => { onSwitchTab('analytics'); onClose(); }
        }
    ];

    const creationActions = [
        {
            id: 'create-habit',
            category: 'Quick Actions',
            title: 'Create New Daily Habit',
            icon: 'fa-plus',
            shortcut: 'Habit',
            action: () => { onOpenNewHabit(); onClose(); }
        },
        {
            id: 'create-task',
            category: 'Quick Actions',
            title: 'Create New Task',
            icon: 'fa-plus',
            shortcut: 'Task',
            action: () => { onOpenNewTask(); onClose(); }
        },
        {
            id: 'create-project',
            category: 'Quick Actions',
            title: 'Create New Project',
            icon: 'fa-plus',
            shortcut: 'Project',
            action: () => { onOpenNewProject(); onClose(); }
        },
        {
            id: 'create-milestone',
            category: 'Quick Actions',
            title: 'Create Major Goal',
            icon: 'fa-plus',
            shortcut: 'Goal',
            action: () => { onOpenNewMilestone(); onClose(); }
        },
        {
            id: 'ai-assistant',
            category: 'Quick Actions',
            title: 'Open AI Assistant',
            icon: 'fa-wand-magic-sparkles',
            shortcut: 'AI',
            action: () => { onOpenAiModal(); onClose(); }
        },
        {
            id: 'toggle-theme',
            category: 'Preferences',
            title: 'Toggle Light / Dark Theme',
            icon: 'fa-circle-half-stroke',
            shortcut: 'Theme',
            action: () => { onToggleTheme(); onClose(); }
        },
        {
            id: 'backup-data',
            category: 'Preferences',
            title: 'Backup & Data Management',
            icon: 'fa-database',
            shortcut: 'JSON',
            action: () => { onOpenBackupModal(); onClose(); }
        }
    ];

    // Filter items based on query
    const lowerQuery = query.toLowerCase().trim();
    const allActions = [...navigationActions, ...creationActions];

    const filteredActions = lowerQuery
        ? allActions.filter(item =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.category.toLowerCase().includes(lowerQuery)
        )
        : allActions;

    // Search existing user items if query is typed
    const searchResults = [];
    if (lowerQuery.length >= 2 && state) {
        (state.habits || []).forEach(h => {
            if (h.title.toLowerCase().includes(lowerQuery)) {
                searchResults.push({
                    id: `search-habit-${h.id}`,
                    category: 'Matching Habits',
                    title: h.title,
                    icon: 'fa-fire',
                    shortcut: `${h.current}/${h.target}`,
                    action: () => { onSwitchTab('habits'); onClose(); }
                });
            }
        });

        (state.tasks || []).forEach(t => {
            if (t.title.toLowerCase().includes(lowerQuery)) {
                searchResults.push({
                    id: `search-task-${t.id}`,
                    category: 'Matching Tasks',
                    title: t.title,
                    icon: 'fa-list-check',
                    shortcut: t.status,
                    action: () => { onSwitchTab('tasks'); onClose(); }
                });
            }
        });

        (state.projects || []).forEach(p => {
            if (p.title.toLowerCase().includes(lowerQuery)) {
                searchResults.push({
                    id: `search-proj-${p.id}`,
                    category: 'Matching Projects',
                    title: p.title,
                    icon: 'fa-diagram-project',
                    shortcut: p.status,
                    action: () => { onSwitchTab('projects'); onClose(); }
                });
            }
        });

        (state.milestones || []).forEach(m => {
            if (m.title.toLowerCase().includes(lowerQuery)) {
                searchResults.push({
                    id: `search-mile-${m.id}`,
                    category: 'Matching Goals',
                    title: m.title,
                    icon: 'fa-trophy',
                    shortcut: m.targetDate || 'Goal',
                    action: () => { onSwitchTab('milestones'); onClose(); }
                });
            }
        });
    }

    const items = [...filteredActions, ...searchResults];

    // Arrow navigation
    const handleInputKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % (items.length || 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + items.length) % (items.length || 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (items[selectedIndex]) {
                items[selectedIndex].action();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="command-palette-backdrop" onClick={onClose}>
            <div className="command-palette-container" onClick={(e) => e.stopPropagation()}>
                <div className="command-palette-header">
                    <i className="fa-solid fa-magnifying-glass command-search-icon"></i>
                    <input
                        ref={inputRef}
                        type="text"
                        className="command-palette-input"
                        placeholder="Type a command, page, or search query..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        onKeyDown={handleInputKeyDown}
                    />
                    <span className="command-badge-esc" onClick={onClose}>ESC</span>
                </div>

                <div className="command-palette-list" ref={listRef}>
                    {items.length === 0 ? (
                        <div className="command-palette-empty">
                            <i className="fa-solid fa-ghost"></i>
                            <p>No results found for "{query}"</p>
                        </div>
                    ) : (
                        items.map((item, index) => {
                            const isSelected = index === selectedIndex;
                            return (
                                <div
                                    key={item.id}
                                    className={`command-item ${isSelected ? 'selected' : ''}`}
                                    onClick={item.action}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <div className="command-item-left">
                                        <div className="command-item-icon">
                                            <i className={`fa-solid ${item.icon}`}></i>
                                        </div>
                                        <div className="command-item-text">
                                            <span className="command-item-title">{item.title}</span>
                                            <span className="command-item-category">{item.category}</span>
                                        </div>
                                    </div>
                                    {item.shortcut && (
                                        <div className="command-item-shortcut">
                                            <span className="kbd-pill">{item.shortcut}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="command-palette-footer">
                    <div className="command-footer-tip">
                        <span className="kbd-pill">↑</span>
                        <span className="kbd-pill">↓</span>
                        <span>Navigate</span>
                    </div>
                    <div className="command-footer-tip">
                        <span className="kbd-pill">↵</span>
                        <span>Execute</span>
                    </div>
                    <div className="command-footer-tip">
                        <span className="kbd-pill">ESC</span>
                        <span>Close</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
