export function darkenColor(hex: string, amount = 20) {
    const color = hex.replace('#', '');

    const r = Math.max(0, parseInt(color.substring(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(color.substring(2, 4), 16) - amount);
    const b = Math.max(0, parseInt(color.substring(4, 6), 16) - amount);

    return `#${[r, g, b]
        .map(c => c.toString(16).padStart(2, '0'))
        .join('')}`;
}