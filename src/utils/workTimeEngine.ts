import { OperatingHourDTO } from '@/types/company'; // Ajuste o path

const MAP_DAY_INDEX_TO_STRING: Record<number, string> = {
    0: 'SUNDAY',
    1: 'MONDAY',
    2: 'TUESDAY',
    3: 'WEDNESDAY',
    4: 'THURSDAY',
    5: 'FRIDAY',
    6: 'SATURDAY'
};

function timeStringToMinutes(timeStr: string): number {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

export function getDailyWorkBounds(operatingHours: any[], date: Date) {
    const dayStr = MAP_DAY_INDEX_TO_STRING[date.getDay()];
    const hoursConfig = operatingHours || [];
    
    // Busca a regra APENAS para o dia que está na tela
    const todayConfig = hoursConfig.find(p => p.daysOfWeek?.includes(dayStr));

    let realStartHour = 8; // Default de segurança
    let realEndHour = 20;  // Default de segurança

    if (todayConfig && todayConfig.openingTime && todayConfig.closingTime) {
        const openMin = timeStringToMinutes(todayConfig.openingTime);
        const closeMin = timeStringToMinutes(todayConfig.closingTime);
        
        realStartHour = Math.floor(openMin / 60);
        realEndHour = Math.ceil(closeMin / 60);
    }

    // A MÁGICA DO ALÍVIO VISUAL (1h antes, 1h depois)
    const startHour = Math.max(0, realStartHour - 1);
    const endHour = Math.min(24, realEndHour + 1);

    return { startHour, endHour };
}

export function getGlobalWorkBounds(operatingHours: OperatingHourDTO[] = []) {
    let minMinutes = 24 * 60; 
    let maxMinutes = 0;

    if (!operatingHours || operatingHours.length === 0) {
        return { startHour: 8, endHour: 20 }; // Fallback de segurança
    }

    operatingHours.forEach(period => {
        if (period.openingTime && period.closingTime) {
            const openMin = timeStringToMinutes(period.openingTime);
            const closeMin = timeStringToMinutes(period.closingTime);

            if (openMin < minMinutes) minMinutes = openMin;
            if (closeMin > maxMinutes) maxMinutes = closeMin;
        }
    });

    const realStartHour = minMinutes === 24 * 60 ? 8 : Math.floor(minMinutes / 60);
    const realEndHour = maxMinutes === 0 ? 20 : Math.ceil(maxMinutes / 60);

    const startHour = Math.max(0, realStartHour - 1);
    const endHour = Math.min(24, realEndHour + 1);

    return { startHour, endHour };
}
/**
 * Verifica se um slot específico de 30 minutos deve ser pintado de cinza (fechado ou almoço)
 */
export function isSlotClosed(date: Date, timeStr: string, operatingHours: OperatingHourDTO[] = []): boolean {
    const dayStr = MAP_DAY_INDEX_TO_STRING[date.getDay()];

    const currentPeriod = operatingHours.find(p => p.daysOfWeek?.includes(dayStr));

    if (!currentPeriod || !currentPeriod.openingTime || !currentPeriod.closingTime) {
        return true;
    }

    const currentMinutes = timeStringToMinutes(timeStr);
    const openMinutes = timeStringToMinutes(currentPeriod.openingTime);
    const closeMinutes = timeStringToMinutes(currentPeriod.closingTime);

    if (currentMinutes < openMinutes || currentMinutes >= closeMinutes) {
        return true;
    }

    if (currentPeriod.breakStartTime && currentPeriod.breakEndTime) {
        const breakStart = timeStringToMinutes(currentPeriod.breakStartTime);
        const breakEnd = timeStringToMinutes(currentPeriod.breakEndTime);

        if (currentMinutes >= breakStart && currentMinutes < breakEnd) {
            return true;
        }
    }

    return false;
}