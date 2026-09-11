import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, 
  Platform, KeyboardAvoidingView, LayoutAnimation, UIManager 
} from 'react-native';
import DraggableFlatList, { ScaleDecorator, RenderItemParams } from 'react-native-draggable-flatlist';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { SearchHeaderScreens } from '@/components/layout/header';
import { Colors } from '@/colors/color';

import { useCompanyServices } from '@/hooks/useCompanyServices';
import { useCompanyCategories } from '@/hooks/useCompanyCategories';
import { useServiceMutations } from '@/hooks/useServiceMutations';
import { useCategoryMutations } from '@/hooks/useCategoryMutations';

import { FabCustom } from '@/components/shared/FabCustom';
import { ServiceResponseDTO, ServiceCategoryResponseDTO } from '@/types/company';

// Habilita animações fluidas no Android para transição suave ao entrar/sair do modo organização
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Prevenção de loop de renderização (Maximum update depth) fixando a referência dos arrays vazios
const EMPTY_SERVICES: ServiceResponseDTO[] = [];
const EMPTY_CATEGORIES: ServiceCategoryResponseDTO[] = [];

type ListItem = 
  | { type: 'CATEGORY'; id: string; name: string; displayOrder: number }
  | { type: 'SERVICE'; id: string; name: string; price: number; duration: number; categoryId: string | null; displayOrder: number };

export default function ServicosScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  
  // Controle de UX: Modo focado em organização de categorias
  const [isCategoryMode, setIsCategoryMode] = useState(false);
  
  const { data: services = EMPTY_SERVICES, isLoading: isLoadingSvc } = useCompanyServices();
  const { data: categories = EMPTY_CATEGORIES, isLoading: isLoadingCat } = useCompanyCategories();
  
  const { deleteService, reorderServices } = useServiceMutations();
  const { reorderCategories } = useCategoryMutations();

  const isMutating = reorderServices.isPending || reorderCategories.isPending;

  // Estados locais para permitir atualizações otimistas instantâneas sem esperar a rede
  const [localServices, setLocalServices] = useState<ServiceResponseDTO[]>([]);
  const [localCategories, setLocalCategories] = useState<ServiceCategoryResponseDTO[]>([]);
  const [localData, setLocalData] = useState<ListItem[]>([]);

  // Sincroniza dados do backend apenas quando não houver mutações em andamento
  useEffect(() => {
    if (!isMutating) {
      setLocalServices(services);
      setLocalCategories(categories);
    }
  }, [services, categories, isMutating]);

  // 1. ACHATAMENTO (FLATTEN) DA LISTA
  // Agrupa os serviços ou exibe apenas categorias baseado no modo atual
  useEffect(() => {
    if (isLoadingSvc || isLoadingCat) return;

    let flatList: ListItem[] = [];

    // 1.1 Grupo: Sem Categoria (Sempre visível)
    flatList.push({ type: 'CATEGORY', id: 'NO_CATEGORY', name: 'Sem categoria', displayOrder: -1 });
    
    // Anexa serviços se não estiver no modo de organização
    if (!isCategoryMode) {
      const noCatServices = localServices.filter(s => !s.categoryId).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      noCatServices.forEach(s => {
        flatList.push({ type: 'SERVICE', id: s.id, name: s.name, price: s.price, duration: s.durationInMinutes, categoryId: null, displayOrder: s.displayOrder || 0 });
      });
    }

    // 1.2 Grupo: Categorias Dinâmicas
    const sortedCategories = [...localCategories].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    sortedCategories.forEach(cat => {
      flatList.push({ type: 'CATEGORY', id: cat.id, name: cat.name, displayOrder: cat.displayOrder || 0 });
      
      // Anexa serviços da categoria se não estiver no modo organização
      if (!isCategoryMode) {
        const catServices = localServices.filter(s => s.categoryId === cat.id).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        catServices.forEach(s => {
          flatList.push({ type: 'SERVICE', id: s.id, name: s.name, price: s.price, duration: s.durationInMinutes, categoryId: cat.id, displayOrder: s.displayOrder || 0 });
        });
      }
    });

    setLocalData(flatList);
  }, [localServices, localCategories, isLoadingSvc, isLoadingCat, isCategoryMode]);

  // 2. FILTRO DE BUSCA
  const filteredData = useMemo(() => {
    if (!searchText.trim()) return localData;
    const lowerSearch = searchText.toLowerCase().trim();
    return localData.filter(item => 
      item.type === 'SERVICE' && item.name.toLowerCase().includes(lowerSearch)
    );
  }, [searchText, localData]);

  // 3. MOTOR DE REORDENAÇÃO (ON DROP)
  const handleDragEnd = ({ data }: { data: ListItem[] }) => {
    setLocalData(data); // Atualiza UI imediatamente

    if (isCategoryMode) {
      // Processa a reordenação exclusiva de categorias
      const updatedCategories: { id: string; position: number }[] = [];
      let cOrder = 0;
      data.forEach(item => {
        if (item.id !== 'NO_CATEGORY') {
          updatedCategories.push({ id: item.id, position: cOrder++ });
        }
      });

      if (updatedCategories.length > 0) reorderCategories.mutate(updatedCategories);

      // Atualiza o estado local para preservar a nova ordem ao sair do modo de organização
      const newLocalCats = localCategories.map(c => {
        const up = updatedCategories.find(uc => uc.id === c.id);
        return up ? { ...c, displayOrder: up.position } : c;
      });
      setLocalCategories(newLocalCats);

    } else {
      // Processa a reordenação de serviços e transferências entre categorias
      const updatedServices: { id: string; position: number; categoryId: string | null }[] = [];
      let currentCategoryId: string | null = null;
      let sOrder = 0;

      data.forEach((item) => {
        if (item.type === 'CATEGORY') {
          currentCategoryId = item.id === 'NO_CATEGORY' ? null : item.id;
        } else if (item.type === 'SERVICE') {
          updatedServices.push({ 
            id: item.id, 
            position: sOrder++, 
            categoryId: currentCategoryId 
          });
        }
      });

      if (updatedServices.length > 0) reorderServices.mutate(updatedServices);

      const newLocalSvcs = localServices.map(s => {
        const up = updatedServices.find(us => us.id === s.id);
        return up ? { ...s, displayOrder: up.position, categoryId: up.categoryId } : s;
      });
      setLocalServices(newLocalSvcs);
    }
  };

  const toggleCategoryMode = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsCategoryMode(prev => !prev);
  };

  const handleEditService = useCallback((id: string) => {
    router.push({ pathname: '/(main)/(stack)/servicos/novo-servico', params: { id } } as any);
  }, [router]);

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatDuration = (min: number) => min < 60 ? `${min} min` : `${Math.floor(min/60)}h ${min%60 > 0 ? min%60+'m' : ''}`;

  // 4. RENDERIZAÇÃO
  const renderItem = ({ item, drag, isActive }: RenderItemParams<ListItem>) => {
    if (item.type === 'CATEGORY') {
      const isNoCategory = item.id === 'NO_CATEGORY';
      return (
        <ScaleDecorator>
          <TouchableOpacity 
            activeOpacity={0.9}
            delayLongPress={150}
            // Arrasta apenas se estiver no modo categoria e não for a "Sem categoria"
            onLongPress={isCategoryMode && !isNoCategory ? drag : undefined}
            disabled={isNoCategory}
            style={[styles.categoryHeader, isActive && styles.activeItem]}
          >
            <View style={styles.dragHandle}>
              {/* Exibe o ícone de arraste apenas quando o modo de organização estiver ativo */}
              {isCategoryMode && !isNoCategory && <Ionicons name="reorder-three" size={td(24)} color="#FF7A00" />}
            </View>
            <Text style={[styles.categoryTitle, (isNoCategory || !isCategoryMode) && { marginLeft: 0 }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        </ScaleDecorator>
      );
    }

    return (
      <ScaleDecorator>
        <TouchableOpacity 
          activeOpacity={0.9}
          delayLongPress={150}
          onLongPress={drag}
          onPress={() => handleEditService(item.id)}
          style={[styles.serviceCard, isActive && styles.activeItem]}
        >
          <View style={styles.dragHandle}>
            <Ionicons name="reorder-two" size={td(22)} color="#94A3B8" />
          </View>
          
          <View style={styles.verticalBar} />
          
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.serviceDuration}>{formatDuration(item.duration)}</Text>
          </View>
          
          <View style={styles.priceWrapper}>
            <Text style={styles.servicePrice}>{formatCurrency(item.price)}</Text>
            <Ionicons name="chevron-forward" size={td(16)} color="#CBD5E1" />
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  if (isLoadingSvc || isLoadingCat) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#FF7A00" /></View>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <SearchHeaderScreens
        title="Serviços"
        placeHolder='Pesquisar serviços'
        onBack={() => router.back()}
        searchValue={searchText}
        onSearchChange={setSearchText}
        scrollY={new (require('react-native').Animated.Value)(0)} 
      />

      <View style={styles.createCategoryRow}>
        <TouchableOpacity style={styles.btnNewCategory} onPress={() => {/* Modal Lógica */}}>
          <Ionicons name="add" size={td(20)} color="#1E293B" />
          <Text style={styles.txtNewCategory}>Nova categoria</Text>
        </TouchableOpacity>

        {/* Toggle do Modo de Organização */}
        <TouchableOpacity 
          style={styles.btnToggleMode} 
          onPress={toggleCategoryMode}
        >
          <Ionicons 
            name={isCategoryMode ? "checkmark-done" : "options-outline"} 
            size={td(18)} 
            color={isCategoryMode ? "#FF7A00" : "#64748B"} 
          />
          <Text style={[styles.txtToggleMode, isCategoryMode && { color: '#FF7A00', fontFamily: fonts?.robotoBold }]}>
            {isCategoryMode ? "Concluir Organização" : "Organizar Categorias"}
          </Text>
        </TouchableOpacity>
      </View>

      <DraggableFlatList
        data={filteredData}
        keyExtractor={(item) => item.type + '_' + item.id}
        renderItem={renderItem}
        onDragEnd={handleDragEnd}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        activationDistance={searchText.length > 0 ? 9999 : 0} 
      />

      {/* Esconde o FabCustom durante a organização para não poluir a interface */}
      {!isCategoryMode && (
        <FabCustom onPress={() => router.push('/(main)/(stack)/servicos/novo-servico' as any)} label=''  />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingBottom: a(100) },
  
  createCategoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: a(15),
    paddingHorizontal: l(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  btnNewCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: l(6),
  },
  txtNewCategory: {
    fontSize: td(15),
    fontFamily: fonts?.robotoMedium || 'System',
    color: '#1E293B',
  },
  
  btnToggleMode: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: l(4), 
    backgroundColor: '#F8FAFC', 
    paddingHorizontal: l(12), 
    paddingVertical: a(8), 
    borderRadius: td(20) 
  },
  txtToggleMode: { 
    fontSize: td(12), 
    fontFamily: fonts?.robotoMedium || 'System', 
    color: '#64748B' 
  },

  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: a(18),
    paddingHorizontal: l(16),
    backgroundColor: '#FFFFFF',
  },
  categoryTitle: {
    fontSize: td(15),
    fontFamily: fonts?.robotoBold || 'System',
    color: '#0F172A',
    marginLeft: l(8),
  },

  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: a(16),
    paddingHorizontal: l(16),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#F1F5F9',
  },
  dragHandle: {
    width: l(30),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  verticalBar: {
    width: l(3),
    height: a(32),
    backgroundColor: '#06B6D4', 
    borderRadius: td(2),
    marginRight: l(12),
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: td(15),
    fontFamily: fonts?.robotoMedium || 'System',
    color: '#1E293B',
    marginBottom: a(2),
  },
  serviceDuration: {
    fontSize: td(12),
    fontFamily: fonts?.robotoRegular || 'System',
    color: '#94A3B8',
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: l(8),
  },
  servicePrice: {
    fontSize: td(15),
    fontFamily: fonts?.robotoBold || 'System',
    color: '#0F172A',
  },
  activeItem: {
    backgroundColor: '#F8FAFC',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  }
});