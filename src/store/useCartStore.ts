import { create } from 'zustand';

// Diferenciamos 'SERVICE' (serviço do catálogo) de 'CUSTOM' (venda avulsa sem item)
export type ItemType = 'APPOINTMENT' | 'SERVICE' | 'PRODUCT' | 'CUSTOM';

export interface CartItem {
  localId: string;
  type: ItemType;
  referenceId?: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  
  // Metadados visuais para Agendamento e Serviço
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  employeeName?: string;
  appointmentStatus?: string; 
}

interface CartState {
  companyId: string | null;
  clientId: string | null;
  employeeId: string | null;
  
  items: CartItem[];
  customSaleAmount: number;
  discount: number;
  tip: number;
  paymentMethod: string | null;

  setContext: (companyId?: string | null, clientId?: string | null, employeeId?: string | null) => void;
  
  addItem: (item: Omit<CartItem, 'localId'>) => void;
  removeItem: (localId: string) => void;
  updateItemQuantity: (localId: string, quantity: number) => void;
  updateItemPrice: (localId: string, newPrice: number) => void;
  setCustomSaleAmount: (amount: number) => void;
  
  setDiscount: (discount: number) => void;
  setTip: (tip: number) => void;
  setPaymentMethod: (method: string) => void;
  
  getSubtotal: () => number;
  getTotal: () => number;
  
  clearCart: () => void;
  buildCheckoutPayload: () => any;
}

export const useCartStore = create<CartState>((set, get) => ({
  companyId: null,
  clientId: null,
  employeeId: null,

  items: [],
  customSaleAmount: 0,
  discount: 0,
  tip: 0,
  paymentMethod: null,

  setContext: (companyId = null, clientId = null, employeeId = null) => 
    set({ companyId, clientId, employeeId }),

  addItem: (item) => 
    set((state) => {
      // Impede duplicar o mesmo agendamento
      if (item.type === 'APPOINTMENT' && item.referenceId) {
        const exists = state.items.some(i => i.referenceId === item.referenceId);
        if (exists) return state;
      }

      // Somente PRODUCT incrementa quantidade ao ser selecionado novamente
      if (item.type === 'PRODUCT' && item.referenceId) {
        const existingIndex = state.items.findIndex(
          i => i.referenceId === item.referenceId && i.type === 'PRODUCT'
        );
        if (existingIndex > -1) {
          const updated = [...state.items];
          updated[existingIndex].quantity += item.quantity;
          return { items: updated, customSaleAmount: 0 };
        }
      }
      
      const newItem: CartItem = {
        ...item,
        localId: Math.random().toString(36).substring(2, 9),
      };

      // Mantém APPOINTMENT sempre no topo da lista
      const nextItems = [...state.items, newItem].sort((a, b) => {
        if (a.type === 'APPOINTMENT' && b.type !== 'APPOINTMENT') return -1;
        if (a.type !== 'APPOINTMENT' && b.type === 'APPOINTMENT') return 1;
        return 0;
      });

      return { items: nextItems, customSaleAmount: 0 };
    }),

  removeItem: (localId) => 
    set((state) => ({
      items: state.items.filter((i) => i.localId !== localId)
    })),

  updateItemQuantity: (localId, quantity) => 
    set((state) => ({
      items: state.items.map((i) => 
        i.localId === localId ? { ...i, quantity: Math.max(1, quantity) } : i
      )
    })),

  updateItemPrice: (localId, newPrice) => 
    set((state) => ({
      items: state.items.map((i) => 
        i.localId === localId ? { ...i, unitPrice: Math.max(0, newPrice) } : i
      )
    })),

  setCustomSaleAmount: (amount) => set({ customSaleAmount: Math.max(0, amount) }),

  setDiscount: (discount) => set({ discount: Math.max(0, discount) }),
  setTip: (tip) => set({ tip: Math.max(0, tip) }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

  getSubtotal: () => {
    const state = get();
    // Se não há itens selecionados, o subtotal passa a ser o valor avulso digitado
    if (state.items.length === 0) {
      return state.customSaleAmount;
    }
    return state.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const { discount, tip } = get();
    return Math.max(0, subtotal - discount) + tip;
  },

  clearCart: () => set({
    items: [],
    customSaleAmount: 0,
    discount: 0,
    tip: 0,
    paymentMethod: null,
    clientId: null,
  }),

  buildCheckoutPayload: () => {
    const state = get();

    // Se o carrinho estiver vazio, mas houver um valor avulso definido, gera 1 item CUSTOM para o Backend
    const payloadItems = state.items.length > 0 
      ? state.items.map(i => ({
          // No Java o Enum aceita APPOINTMENT, PRODUCT ou CUSTOM (convertemos SERVICE -> CUSTOM no envio)
          type: i.type === 'SERVICE' ? 'CUSTOM' : i.type,
          referenceId: i.referenceId || null,
          description: i.description,
          quantity: i.quantity,
          unitPrice: i.unitPrice
        }))
      : [
          {
            type: 'CUSTOM',
            referenceId: null,
            description: 'Venda Avulsa',
            quantity: 1,
            unitPrice: state.customSaleAmount
          }
        ];

    return {
      companyId: state.companyId || null,
      clientId: state.clientId || null,
      employeeId: state.employeeId || null,
      discount: state.discount,
      tip: state.tip,
      paymentMethod: state.paymentMethod || 'PIX',
      items: payloadItems
    };
  }
}));