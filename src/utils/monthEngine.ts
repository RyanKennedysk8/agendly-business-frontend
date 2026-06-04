/**
 * Gera uma matriz flat de 42 objetos Date para representar o mês completo na grade 6x7.
 */
export function generateMonthMatrix(targetDate: Date): Date[] {
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();

    // Primeiro dia do mês selecionado
    const firstDayOfMonth = new Date(year, month, 1);
    // Determina o dia da semana em que o mês começa (0 = Domingo, 1 = Segunda...)
    const startDayOfWeek = firstDayOfMonth.getDay();

    // Ponto de partida do calendário (retrocede até o Domingo correspondente)
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDayOfWeek);

    const matrix: Date[] = [];

    // Preenche as 6 semanas fixas obrigatórias do layout mobile
    for (let i = 0; i < 42; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        matrix.push(d);
    }

    return matrix;
}

/**
 * Cria um mapa de indexação rápida O(1) para contagem de agendamentos por dia.
 */
export function computeAppointmentsCache(appointments: any[]): Record<string, number> {
    return appointments.reduce((acc, appt) => {
        if (!appt.startTime) return acc;
        const dateKey = appt.startTime.split('T')[0];
        acc[dateKey] = (acc[dateKey] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
}