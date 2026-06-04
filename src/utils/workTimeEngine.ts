import { COMPANY_MOCK } from '../mocks/company';

// Mapeamento do getDay() do JS para o padrão da sua API
const MAP_DAY_INDEX_TO_STRING: Record<number, string> = {
    0: 'SUNDAY',
    1: 'MONDAY',
    2: 'TUESDAY',
    3: 'WEDNESDAY',
    4: 'THURSDAY',
    5: 'FRIDAY',
    6: 'SATURDAY'
};

/**
 * Converte strings "HH:mm:ss" ou "HH:mm" em minutos totais desde o início do dia
 */
function timeStringToMinutes(timeStr: string): number {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

/**
 * Varre todos os períodos de funcionamento do seu DTO para achar a menor hora de abertura 
 * e a maior hora de fechamento configuradas na empresa inteira.
 */
export function getGlobalWorkBounds() {
    let minMinutes = 24 * 60;
    let maxMinutes = 0;
    const hoursConfig = COMPANY_MOCK.operatingHours || [];

    hoursConfig.forEach(period => {
        if (period.openingTime && period.closingTime) {
            const openMin = timeStringToMinutes(period.openingTime);
            const closeMin = timeStringToMinutes(period.closingTime);

            if (openMin < minMinutes) minMinutes = openMin;
            if (closeMin > maxMinutes) maxMinutes = closeMin;
        }
    });

    // Se o mock estiver vazio por algum motivo, usa fallbacks seguros
    const startHour = minMinutes === 24 * 60 ? 8 : Math.floor(minMinutes / 60);
    const endHour = maxMinutes === 0 ? 20 : Math.ceil(maxMinutes / 60);

    return { startHour, endHour };
}

/**
 * Verifica se um slot específico de 30 minutos deve ser pintado de cinza (fechado ou almoço)
 */
export function isSlotClosed(date: Date, timeStr: string): boolean {
    const dayStr = MAP_DAY_INDEX_TO_STRING[date.getDay()];
    const hoursConfig = COMPANY_MOCK.operatingHours || [];

    // Busca o período de funcionamento que engloba o dia da semana atual
    const currentPeriod = hoursConfig.find(p => p.daysOfWeek?.includes(dayStr));

    // Se não há configuração para este dia, a loja está fechada
    if (!currentPeriod || !currentPeriod.openingTime || !currentPeriod.closingTime) {
        return true;
    }

    const currentMinutes = timeStringToMinutes(timeStr);
    const openMinutes = timeStringToMinutes(currentPeriod.openingTime);
    const closeMinutes = timeStringToMinutes(currentPeriod.closingTime);

    // Bloqueia se estiver antes do horário de abertura ou depois/igual ao de fechamento
    if (currentMinutes < openMinutes || currentMinutes >= closeMinutes) {
        return true;
    }

    // Bloqueia se estiver dentro do intervalo de almoço do dia
    if (currentPeriod.breakStartTime && currentPeriod.breakEndTime) {
        const breakStart = timeStringToMinutes(currentPeriod.breakStartTime);
        const breakEnd = timeStringToMinutes(currentPeriod.breakEndTime);

        if (currentMinutes >= breakStart && currentMinutes < breakEnd) {
            return true;
        }
    }

    return false;
}