import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export type ExpenseCategory = 'SUPPLIES' | 'OPERATIONAL' | 'UTILITIES' | 'OTHER';

export interface ExpenseItem {
  id: string;
  companyId: string | null;
  description: string;
  category: ExpenseCategory;
  amount: number;
  createdAt: string;
}

const formatLocalISO = (date: Date) => {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`;
};

export const useCompanyExpenses = (companyId?: string | null) => {
  return useQuery({
    queryKey: ['company-expenses', companyId],
    queryFn: async () => {
      const now = new Date();
      const startOfRange = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30, 0, 0, 0);
      const endOfRange = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

      const { data } = await api.get<ExpenseItem[]>('/expenses', {
        params: {
          companyId,
          start: formatLocalISO(startOfRange),
          end: formatLocalISO(endOfRange),
        },
      });
      return data;
    },
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Omit<ExpenseItem, 'id' | 'createdAt'>) => {
      const { data } = await api.post<ExpenseItem>('/expenses', payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['company-expenses', variables.companyId] });
    },
  });
};