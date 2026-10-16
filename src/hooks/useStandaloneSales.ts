import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { SaleReceipt } from './useSaleReceipt';

const formatLocalISO = (date: Date) => {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`;
};

export const useStandaloneSales = (companyId?: string | null) => {
  return useQuery({
    queryKey: ['standalone-sales', companyId],
    queryFn: async () => {
      const now = new Date();
      const startOfRange = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30, 0, 0, 0);
      const endOfRange = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

      const { data } = await api.get<SaleReceipt[]>('/sales/standalone', {
        params: {
          companyId,
          start: formatLocalISO(startOfRange),
          end: formatLocalISO(endOfRange),
        },
      });
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};