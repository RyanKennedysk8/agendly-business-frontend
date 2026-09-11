import { create } from 'zustand';

interface ServiceFormState {
  name: string;
  price: string;
  durationInMinutes: number;
  categoryId: string | null;
  categoryName: string;
  employeeIds: string[];
  employeeNames: string;
  isHomeService: boolean;
  isPetService: boolean;
  

  setField: <K extends keyof Omit<ServiceFormState, 'setField' | 'hydrate' | 'reset'>>(field: K, value: ServiceFormState[K]) => void;
  hydrate: (data: Partial<ServiceFormState>) => void;
  reset: () => void;
}

const initialState = {
  name: '',
  price: '',
  durationInMinutes: 30,
  categoryId: null,
  categoryName: '',
  employeeIds: ['ALL'],
  employeeNames: 'Todos (Padrão)',
  isHomeService: false,
  isPetService: false,
};

export const useServiceFormStore = create<ServiceFormState>((set) => ({
  ...initialState,
  
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  
  hydrate: (data) => set((state) => ({ ...state, ...data })),
  
  reset: () => set(initialState),
}));