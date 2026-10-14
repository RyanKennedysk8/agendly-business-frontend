const DAYS_MAP = [
    'SUNDAY', 
    'MONDAY', 
    'TUESDAY', 
    'WEDNESDAY', 
    'THURSDAY', 
    'FRIDAY', 
    'SATURDAY'
];


const extractBreaks = (schedule: any) => {
    if (!schedule) return [];

    // 1. Se o seu backend envia um Array de intervalos
    if (Array.isArray(schedule.breaks)) return schedule.breaks;
    if (Array.isArray(schedule.breakTimes)) return schedule.breakTimes;
    if (Array.isArray(schedule.intervals)) return schedule.intervals;

    const start = schedule.intervalStart || schedule.breakStart || schedule.lunchStart || schedule.breakStartTime;
    const end = schedule.intervalEnd || schedule.breakEnd || schedule.lunchEnd || schedule.breakEndTime;

    if (start && end) {
        return [{ startTime: start, endTime: end }];
    }

    return [];
};

export const getGlobalWorkBounds = () => {
    return { startHour: 8, endHour: 20 };
};

export const getDailyWorkBounds = (operatingHours: any[], date: Date) => {
    if (!operatingHours || operatingHours.length === 0) {
        return getGlobalWorkBounds();
    }

    const todayStr = DAYS_MAP[date.getDay()];
    const storeSchedule = operatingHours.find((h: any) => h.daysOfWeek?.includes(todayStr));

    if (!storeSchedule || !storeSchedule.openingTime || !storeSchedule.closingTime || storeSchedule.isDayOff) {
        return { startHour: 8, endHour: 18 };
    }

    const startHour = parseInt(storeSchedule.openingTime.split(':')[0], 10);
    const endHour = parseInt(storeSchedule.closingTime.split(':')[0], 10);

    return {
        startHour: Math.max(0, startHour - 1),
        endHour: Math.min(24, endHour + 1)
    };
};


export const isSlotClosedForEmployee = (
    employee: any, 
    date: Date, 
    timeStr: string, // Ex: '14:15'
    storeOperatingHours: any[]
): boolean => {
    const todayStr = DAYS_MAP[date.getDay()];
    
    const storeSchedule = storeOperatingHours?.find((h: any) => h.daysOfWeek?.includes(todayStr));
    const empSchedule = employee?.specificOperatingHours?.find((h: any) => h.daysOfWeek?.includes(todayStr));
    
    const isUsingStoreSchedule = !empSchedule;
    const scheduleToUse = isUsingStoreSchedule ? storeSchedule : empSchedule;

    if (!scheduleToUse || !scheduleToUse.openingTime || !scheduleToUse.closingTime || scheduleToUse.isDayOff) {
        return true; 
    }

    const parseTime = (str: string) => {
        const [h, m] = str.split(':').map(Number);
        return h * 60 + m;
    };

    const slotMinutes = parseTime(timeStr);
    const workStart = parseTime(scheduleToUse.openingTime);
    const workEnd = parseTime(scheduleToUse.closingTime);

    // Bloqueia antes e depois do expediente
    if (slotMinutes < workStart || slotMinutes >= workEnd) {
        return true;
    }

    // Busca os intervalos do funcionário
    let breaks = extractBreaks(scheduleToUse);
    
    // Herança inteligente: Se o funcionário tem horário específico mas não cadastrou pausa, puxa a pausa da loja
    if (!isUsingStoreSchedule && breaks.length === 0) {
        breaks = extractBreaks(storeSchedule);
    }

    // Aplica o bloqueio do intervalo (Hachuras diagonais)
    for (const brk of breaks) {
        if (brk.startTime && brk.endTime) {
            const bStart = parseTime(brk.startTime);
            const bEnd = parseTime(brk.endTime);
            
            if (slotMinutes >= bStart && slotMinutes < bEnd) {
                return true;
            }
        }
    }

    return false;
};


export const isSlotClosed = (
    date: Date, 
    timeStr: string, 
    storeOperatingHours: any[]
): boolean => {
    const todayStr = DAYS_MAP[date.getDay()];
    const storeSchedule = storeOperatingHours?.find((h: any) => h.daysOfWeek?.includes(todayStr));

    if (!storeSchedule || !storeSchedule.openingTime || !storeSchedule.closingTime || storeSchedule.isDayOff) {
        return true; 
    }

    const parseTime = (str: string) => {
        const [h, m] = str.split(':').map(Number);
        return h * 60 + m;
    };

    const slotMinutes = parseTime(timeStr);
    const workStart = parseTime(storeSchedule.openingTime);
    const workEnd = parseTime(storeSchedule.closingTime);

    if (slotMinutes < workStart || slotMinutes >= workEnd) {
        return true;
    }

    const breaks = extractBreaks(storeSchedule);
    
    for (const brk of breaks) {
        if (brk.startTime && brk.endTime) {
            const bStart = parseTime(brk.startTime);
            const bEnd = parseTime(brk.endTime);
            
            if (slotMinutes >= bStart && slotMinutes < bEnd) {
                return true;
            }
        }
    }

    return false;
};