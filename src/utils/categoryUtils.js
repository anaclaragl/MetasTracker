/**
 * Category utility functions for translation and normalization.
 * Supports legacy Portuguese keys and standard English keys.
 */

export const CATEGORY_MAP = {
    carreira: { id: 'career', label: 'Career' },
    career: { id: 'career', label: 'Career' },
    estudo: { id: 'study', label: 'Study' },
    study: { id: 'study', label: 'Study' },
    saude: { id: 'health', label: 'Health' },
    health: { id: 'health', label: 'Health' },
    produtividade: { id: 'productivity', label: 'Productivity' },
    productivity: { id: 'productivity', label: 'Productivity' },
    financas: { id: 'finance', label: 'Finance' },
    finance: { id: 'finance', label: 'Finance' },
    conhecimento: { id: 'knowledge', label: 'Knowledge' },
    knowledge: { id: 'knowledge', label: 'Knowledge' },
    pessoal: { id: 'personal', label: 'Personal' },
    personal: { id: 'personal', label: 'Personal' }
};

/**
 * Normalizes a category key to standard English (e.g., 'estudo' -> 'study').
 */
export function normalizeCategory(category) {
    if (!category) return 'productivity';
    const key = String(category).toLowerCase().trim();
    return CATEGORY_MAP[key]?.id || key;
}

/**
 * Returns a user-friendly English label for display (e.g., 'estudo' -> 'Study').
 */
export function getCategoryLabel(category) {
    if (!category) return '';
    const key = String(category).toLowerCase().trim();
    if (CATEGORY_MAP[key]) {
        return CATEGORY_MAP[key].label;
    }
    return category.charAt(0).toUpperCase() + category.slice(1);
}
