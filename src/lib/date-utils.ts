// Lightweight date formatting utilities (replaces date-fns)

export function formatDate(date: Date | string, formatType: 'short' | 'long' | 'datetime' = 'short'): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    if (formatType === 'short') {
        // e.g., "Nov 26, 2025"
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    if (formatType === 'long') {
        // e.g., "November 26, 2025"
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    if (formatType === 'datetime') {
        // e.g., "November 26, 2025 at 12:16 PM"
        const datePart = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const timePart = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return `${datePart} at ${timePart}`;
    }

    return d.toLocaleDateString();
}

export function formatMonthYear(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
