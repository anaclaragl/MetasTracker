/**
 * Date utility functions using local time zone.
 */

export function getTodayDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getYesterdayDateString() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return getTodayDateString(date);
}

export function formatDate(dateString) {
    if (!dateString) return 'No deadline';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
}

export function formatDateToBR(dateString) {
    return formatDate(dateString);
}
