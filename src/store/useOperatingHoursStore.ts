import { create } from 'zustand';
import Toast from 'react-native-toast-message';

export type BreakTime = { id: string; start: string; end: string };

export type DaySchedule = {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breaks: BreakTime[];
};

export type WeekSchedule = Record<string, DaySchedule>;

interface OperatingHoursState {
  context: 'COMPANY' | 'EMPLOYEE';
  schedule: WeekSchedule;
  companyLimits?: WeekSchedule;
  
  initialize: (context: 'COMPANY' | 'EMPLOYEE', initialSchedule?: WeekSchedule, companyLimits?: WeekSchedule) => void;
  updateDay: (day: string, data: Partial<DaySchedule>) => void;
  updateTimeWithValidation: (day: string, field: 'openTime' | 'closeTime', time: string) => boolean;
  
  // Ações de Intervalo (Breaks)
  addBreak: (day: string) => void;
  removeBreak: (day: string, breakId: string) => void;
  updateBreakTimeWithValidation: (day: string, breakId: string, field: 'start' | 'end', time: string) => boolean;
  
  getFormattedPayload: () => any;
}

const timeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

export const useOperatingHoursStore = create<OperatingHoursState>((set, get) => ({
  context: 'COMPANY',
  schedule: {} as WeekSchedule,
  companyLimits: undefined,

  initialize: (context, initialSchedule, companyLimits) => {
    set({ context, schedule: initialSchedule || {} as WeekSchedule, companyLimits });
  },

  updateDay: (day, data) => {
    set((state) => ({
      schedule: { ...state.schedule, [day]: { ...state.schedule[day], ...data } },
    }));
  },

  addBreak: (day) => {
    set((state) => {
      const dayData = state.schedule[day];
      // Limite de 1 intervalo por dia para simplificar a lógica e UX do MVP
      if (dayData.breaks.length >= 1) {
        Toast.show({ type: 'info', text1: 'Limite', text2: 'Apenas 1 intervalo permitido.' });
        return state;
      }
      return {
        schedule: {
          ...state.schedule,
          [day]: {
            ...dayData,
            breaks: [...dayData.breaks, { id: Math.random().toString(), start: '12:00', end: '13:00' }],
          },
        },
      };
    });
  },

  removeBreak: (day, breakId) => {
    set((state) => ({
      schedule: {
        ...state.schedule,
        [day]: {
          ...state.schedule[day],
          breaks: state.schedule[day].breaks.filter((b) => b.id !== breakId),
        },
      },
    }));
  },

  updateTimeWithValidation: (day, field, time) => {
    const { context, companyLimits } = get();
    
    if (context === 'COMPANY' || !companyLimits) {
      get().updateDay(day, { [field]: time });
      return true;
    }

    const limitForDay = companyLimits[day];
    
    if (!limitForDay || !limitForDay.isOpen) {
      Toast.show({ type: 'error', text1: 'Dia Bloqueado', text2: 'A loja não abre neste dia da semana.' });
      return false;
    }

    const proposedMinutes = timeToMinutes(time);
    const storeOpenMins = timeToMinutes(limitForDay.openTime);
    const storeCloseMins = timeToMinutes(limitForDay.closeTime);

    if (field === 'openTime' && proposedMinutes < storeOpenMins) {
      Toast.show({ type: 'error', text1: 'Horário Inválido', text2: `A loja só abre às ${limitForDay.openTime}.` });
      return false;
    }

    if (field === 'closeTime' && proposedMinutes > storeCloseMins) {
      Toast.show({ type: 'error', text1: 'Horário Inválido', text2: `A loja fecha às ${limitForDay.closeTime}.` });
      return false;
    }

    get().updateDay(day, { [field]: time });
    return true;
  },

  updateBreakTimeWithValidation: (day, breakId, field, time) => {
    const { schedule } = get();
    const dayData = schedule[day];
    
    const proposedMinutes = timeToMinutes(time);
    const openMins = timeToMinutes(dayData.openTime);
    const closeMins = timeToMinutes(dayData.closeTime);

    if (proposedMinutes < openMins || proposedMinutes > closeMins) {
        Toast.show({ type: 'error', text1: 'Intervalo Inválido', text2: 'O intervalo deve estar dentro do expediente.' });
        return false;
    }

    set((state) => ({
      schedule: {
        ...state.schedule,
        [day]: {
          ...state.schedule[day],
          breaks: state.schedule[day].breaks.map((b) => (b.id === breakId ? { ...b, [field]: time } : b)),
        },
      },
    }));
    return true;
  },

  getFormattedPayload: () => {
    return get().schedule;
  },
}));