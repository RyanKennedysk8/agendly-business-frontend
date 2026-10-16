import { create } from 'zustand';

export type ItemType = 'APPOINTMENT' | 'PRODUCT' | 'CUSTOM';

export interface CartItem {
  localId: string; // ID temporário gerado no app para o FlatList/FlashList
  type: ItemType;
  referenceId?: string | null; // ID do agendamento ou do produto real (null para CUSTOM)
  description: string;
  quantity: number;
  unitPrice: number;
}

interface CartState {
  // Identificadores de Contexto
  companyId: string | null;
  clientId: string | null;
  employeeId: string | null;
  
  // Transação
  items: CartItem[];
  discount: number;
  tip: number;
  paymentMethod: string | null;

  // Ações de Contexto
  setContext: (
    companyId?: string | null, 
    clientId?: string | null, 
    employeeId?: string | null
  ) => void;
  
  // Ações de Itens
  addItem: (item: Omit<CartItem, 'localId'>) => void;
  removeItem: (localId: string) => void;
  updateItemQuantity: (localId: string, quantity: number) => void;
  updateItemPrice: (localId: string, newPrice: number) => void;
  
  // Ações Financeiras
  setDiscount: (discount: number) => void;
  setTip: (tip: number) => void;
  setPaymentMethod: (method: string) => void;
  
  // Utilitários Matemáticos (Getters lidos sob demanda)
  getSubtotal: () => number;
  getTotal: () => number;
  
  // Finalização
  clearCart: () => void;
  buildCheckoutPayload: () => any;
}

export const useCartStore = create<CartState>((set, get) => ({
  companyId: null,
  clientId: null,
  employeeId: null,

  items: [], 
  discount: 0,
  tip: 0,
  paymentMethod: null,

  setContext: (companyId = null, clientId = null, employeeId = null) => 
    set({ companyId, clientId, employeeId }),

  addItem: (item) => 
    set((state) => {
      // Impede duplicação de agendamento
      if (item.type === 'APPOINTMENT' && item.referenceId) {
        const exists = state.items.some(i => i.referenceId === item.referenceId);
        if (exists) return state;
      }

      // Se for um PRODUTO ou SERVIÇO de catálogo já inserido, apenas incrementa a quantidade
      if (item.referenceId && item.type !== 'APPOINTMENT') {
        const existingIndex = state.items.findIndex(
          i => i.referenceId === item.referenceId && i.type === item.type
        );
        if (existingIndex > -1) {
          const updated = [...state.items];
          updated[existingIndex].quantity += item.quantity;
          return { items: updated };
        }
      }
      
      const newItem: CartItem = {
        ...item,
        localId: Math.random().toString(36).substring(2, 9),
      };
      return { items: [...state.items, newItem] };
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

  setDiscount: (discount) => set({ discount: Math.max(0, discount) }),
  setTip: (tip) => set({ tip: Math.max(0, tip) }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const { discount, tip } = get();
    return Math.max(0, subtotal - discount) + tip;
  },

  clearCart: () => set({
    items: [],
    discount: 0,
    tip: 0,
    paymentMethod: null,
    clientId: null, // Limpa o cliente, mas mantém a companyId e employeeId (o caixa continua aberto)
  }),

  // Monta o objeto exato esperado pelo CheckoutRequestDTO do Java
  buildCheckoutPayload: () => {
    const state = get();
    return {
      companyId: state.companyId || null,
      clientId: state.clientId || null,
      employeeId: state.employeeId || null,
      discount: state.discount,
      tip: state.tip,
      paymentMethod: state.paymentMethod || 'PIX',
      items: state.items.map(i => ({
        type: i.type,
        referenceId: i.referenceId || null,
        description: i.description,
        quantity: i.quantity,
        unitPrice: i.unitPrice
      }))
    };
  }
}));