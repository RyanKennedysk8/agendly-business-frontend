import { a } from "@/constants/responsive";

export const HOUR_HEIGHT = a(80); 
export const MINUTE_HEIGHT = HOUR_HEIGHT / 60;

/**
 * Gera o array de horários para a régua lateral (ex: ["08:00", "08:30", ...])
 */
export function generateTimeSlots(intervalMinutes = 30, startHour = 0, endHour = 24): string[] {
    const slots: string[] = [];
    const startMin = startHour * 60;
    const endMin = endHour * 60;

    for (let i = startMin; i < endMin; i += intervalMinutes) {
        const hours = Math.floor(i / 60).toString().padStart(2, '0');
        const minutes = (i % 60).toString().padStart(2, '0');
        slots.push(`${hours}:${minutes}`);
    }
    return slots;
}