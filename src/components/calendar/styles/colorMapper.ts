export const getEmployeeColor = (employeeId?: string): { background: string, border: string } => {
    // Usando sua cor primária como fallback ou para a própria empresa
    const defaultColor = { background: '#FF7A00', border: '#CC6200' };
    
    if (!employeeId) return defaultColor;

    const colorMap: Record<string, { background: string, border: string }> = {
        'e1': { background: '#3B82F6', border: '#2563EB' }, // Azul (Ryan)
        'e2': { background: '#EC4899', border: '#DB2777' }, // Rosa (Maria)
        'e3': { background: '#10B981', border: '#059669' }, // Verde (Bruno)
    };

    return colorMap[employeeId] || defaultColor;
};