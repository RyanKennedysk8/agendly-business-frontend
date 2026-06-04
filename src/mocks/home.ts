import { QuickActionItem } from "@/components/features/home/QuickActionsPanel";

export const QUICK_ACTIONS: QuickActionItem[] = [ 
  { id: 'calendar', title: 'Agenda', icon: 'calendar-outline',  route: '/(tabs)/agendamento' },
  { id: 'client', title: 'Clientes', icon: 'person-add-outline',  route: '/(stack)/clientes' },
  { id: 'expense', title: 'Financeiro', icon: 'trending-up-outline',  route: '/nova-despesa' },
  { id: 'services', title: 'Serviços', icon: 'briefcase-outline', route: '/(stack)/servicos' },
  { id: 'employe', title: 'Funcionarios', icon: 'people-outline',  route: '/(stack)/funcionarios' },
  { id: 'new_appointment', title: 'Agendamento Manual', icon: 'create-outline',  route: '/(stack)/servicos' },
  { id: 'service', title: 'Atendimento', icon: 'cart-outline',  route: '/(stack)/servicos' },
  { id: 'reviews', title: 'Avaliações', icon: 'star-outline',  route: '/(stack)/servicos' },
];