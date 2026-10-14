import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface SaleReceipt {
  saleId: string;
  createdAt: string;
  clientName: string;
  employeeName: string;
  subtotal: number;
  discount: number;
  tip: number;
  totalAmount: number;
  paymentMethod: string;
  items: {
    id: string;
    type: 'APPOINTMENT' | 'PRODUCT' | 'CUSTOM';
    description: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
}

export const useSaleReceipt = (appointmentId?: string) => {
  return useQuery({
    queryKey: ['sale-receipt', appointmentId],
    queryFn: async () => {
      const { data } = await api.get<SaleReceipt>(`/sales/by-appointment/${appointmentId}`);
      return data;
    },
    enabled: !!appointmentId,
  });
};