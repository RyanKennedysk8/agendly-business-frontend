import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, 
  Platform, KeyboardAvoidingView, LayoutAnimation, UIManager, TextInput, Modal, Alert, RefreshControl
} from 'react-native';
import DraggableFlatList, { ScaleDecorator, RenderItemParams } from 'react-native-draggable-flatlist';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

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
import { SkeletonList, ServiceSkeleton } from '@/components/shared/SkeletonList';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const EMPTY_SERVICES: ServiceResponseDTO[] = [];
const EMPTY_CATEGORIES: ServiceCategoryResponseDTO[] = [];

type ListItem = 
  | { type: 'CATEGORY'; id: string; name: string; displayOrder: number }
  | { type: 'SERVICE'; id: string; name: string; price: number; duration: number; categoryId: string | null; displayOrder: number };

export default function ServicosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [searchText, setSearchText] = useState('');
  const [isCategoryMode, setIsCategoryMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  
  // Extraímos os refetchs das requisições
  const { data: services = EMPTY_SERVICES, isLoading: isLoadingSvc, refetch: refetchSvc } = useCompanyServices();
  const { data: categories = EMPTY_CATEGORIES, isLoading: isLoadingCat, refetch: refetchCat } = useCompanyCategories();
  
  const { reorderServices } = useServiceMutations();
  const { createCategory, updateCategory, deleteCategory, reorderCategories } = useCategoryMutations();

  const isMutating = reorderServices.isPending || reorderCategories.isPending;

  const [localServices, setLocalServices] = useState<ServiceResponseDTO[]>([]);
  const [localCategories, setLocalCategories] = useState<ServiceCategoryResponseDTO[]>([]);
  const [localData, setLocalData] = useState<ListItem[]>([]);

  useEffect(() => {
    if (!isMutating) {
      setLocalServices(services);
      setLocalCategories(categories);
    }
  }, [services, categories, isMutating]);

  useEffect(() => {
    if (isLoadingSvc || isLoadingCat) return;

    let flatList: ListItem[] = [];

    flatList.push({ type: 'CATEGORY', id: 'NO_CATEGORY', name: 'Sem categoria', displayOrder: -1 });
    
    if (!isCategoryMode) {
      const noCatServices = localServices.filter(s => !s.categoryId).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      noCatServices.forEach(s => {
        flatList.push({ type: 'SERVICE', id: s.id, name: s.name, price: s.price, duration: s.durationInMinutes, categoryId: null, displayOrder: s.displayOrder || 0 });
      });
    }

    const sortedCategories = [...localCategories].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    sortedCategories.forEach(cat => {
      flatList.push({ type: 'CATEGORY', id: cat.id, name: cat.name, displayOrder: cat.displayOrder || 0 });
      
      if (!isCategoryMode) {
        const catServices = localServices.filter(s => s.categoryId === cat.id).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        catServices.forEach(s => {
          flatList.push({ type: 'SERVICE', id: s.id, name: s.name, price: s.price, duration: s.durationInMinutes, categoryId: cat.id, displayOrder: s.displayOrder || 0 });
        });
      }
    });

    setLocalData(flatList);
  }, [localServices, localCategories, isLoadingSvc, isLoadingCat, isCategoryMode]);

  const filteredData = useMemo(() => {
    if (!searchText.trim()) return localData;
    const lowerSearch = searchText.toLowerCase().trim();
    return localData.filter(item => 
      item.type === 'SERVICE' && item.name.toLowerCase().includes(lowerSearch)
    );
  }, [searchText, localData]);

  const handleDragEnd = ({ data }: { data: ListItem[] }) => {
    setLocalData(data);

    if (isCategoryMode) {
      const updatedCategories: { id: string; position: number }[] = [];
      let cOrder = 0;
      data.forEach(item => {
        if (item.id !== 'NO_CATEGORY') {
          updatedCategories.push({ id: item.id, position: cOrder++ });
        }
      });

      if (updatedCategories.length > 0) {
        reorderCategories.mutate(updatedCategories);
        Toast.show({ type: 'success', text1: 'Ordem atualizada', text2: 'A nova ordem das categorias foi salva.' });
      }

      const newLocalCats = localCategories.map(c => {
        const up = updatedCategories.find(uc => uc.id === c.id);
        return up ? { ...c, displayOrder: up.position } : c;
      });
      setLocalCategories(newLocalCats);

    } else {
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

      if (updatedServices.length > 0) {
        reorderServices.mutate(updatedServices);
        Toast.show({ type: 'success', text1: 'Ordem atualizada', text2: 'A nova ordem dos serviços foi salva.' });
      }

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

  const handleCategoryPress = (id: string, name: string) => {
    Alert.alert(
      'Opções da Categoria',
      `O que deseja fazer com "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Editar Nome', 
          onPress: () => {
            setEditingCategory({ id, name });
            setNewCategoryName(name);
            setCategoryModalVisible(true);
          } 
        },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirmar Exclusão',
              'Os serviços desta categoria ficarão "Sem categoria". Deseja continuar?',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Sim, Excluir',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await deleteCategory.mutateAsync(id);
                      Toast.show({ type: 'success', text1: 'Categoria excluída' });
                    } catch (error) {
                      Toast.show({ type: 'error', text1: 'Erro ao excluir' });
                    }
                  }
                }
              ]
            )
          } 
        }
      ]
    );
  };

  const openNewCategoryModal = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setCategoryModalVisible(true);
  };

  // Dispatch de requests em paralelo para o pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchSvc(), refetchCat()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchSvc, refetchCat]);

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatDuration = (min: number) => min < 60 ? `${min} min` : `${Math.floor(min/60)}h ${min%60 > 0 ? min%60+'m' : ''}`;

  const renderItem = ({ item, drag, isActive }: RenderItemParams<ListItem>) => {
    if (item.type === 'CATEGORY') {
      const isNoCategory = item.id === 'NO_CATEGORY';
      return (
        <ScaleDecorator>
          <TouchableOpacity 
            activeOpacity={0.7}
            delayLongPress={150}
            onLongPress={isCategoryMode && !isNoCategory ? drag : undefined}
            onPress={() => {
              if (!isNoCategory && !isCategoryMode) handleCategoryPress(item.id, item.name);
            }}
            disabled={isNoCategory}
            style={[styles.categoryHeader, isActive && styles.activeItem]}
          >
            <View style={{flexDirection:"row", alignItems:"center"}}>
              {isCategoryMode && !isNoCategory && <Ionicons name="reorder-three-outline" size={td(24)} color={Colors.gray} />}
              <Text style={[styles.categoryTitle, (isNoCategory || !isCategoryMode) && { marginLeft: 0 }]}>
                {item.name}
              </Text>
            </View>
            {!isCategoryMode && !isNoCategory && (
              <Ionicons name="chevron-forward" size={td(20)} color={Colors.gray} />
            )}
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
            <Ionicons name="reorder-three-outline" size={td(26)} color={Colors.gray} />
          </View>
          <View style={styles.dragHandleBottom}>
            <View style={{flexDirection:"row"}}>
              <View style={styles.verticalBar} />
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.serviceDuration}>{formatDuration(item.duration)}</Text>
              </View>
            </View>
            <View style={styles.priceWrapper}>
              <Text style={styles.servicePrice}>{formatCurrency(item.price)}</Text>
              <Ionicons name="chevron-forward" size={td(16)} color={Colors.gray} />
            </View>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const isModalSaving = createCategory?.isPending || updateCategory?.isPending;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <SearchHeaderScreens
        title="Serviços"
        placeHolder='Pesquisar serviços'
        onBack={() => router.back()}
        searchValue={searchText}
        onSearchChange={setSearchText}
      />
      <View style={styles.createCategoryRow}>
        <TouchableOpacity style={styles.btnNewCategory} onPress={openNewCategoryModal}>
          <Ionicons name="add" size={td(20)} color={Colors.corText} />
          <Text style={styles.txtNewCategory}>Nova categoria</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnToggleMode} 
          onPress={toggleCategoryMode}
        >
          <Ionicons
            name={isCategoryMode ? "checkmark-done" : "options-outline"}
            size={td(18)}
            color={isCategoryMode ? Colors.corButton : Colors.corTextLight}
          />
          <Text style={[styles.txtToggleMode, isCategoryMode && { color: Colors.corButton, fontFamily: fonts?.robotoBold }]}>
            {isCategoryMode ? "Concluir Organização" : "Organizar Categorias"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {(isLoadingSvc || isLoadingCat) ? ( 
          <SkeletonList 
            count={6} 
            ItemComponent={ServiceSkeleton} 
            contentContainerStyle={{ paddingTop: a(10) }}
            separatorStyle={{ display: 'none' }} 
          />
        ) : (
          <DraggableFlatList
            data={filteredData}
            keyExtractor={(item) => item.type + '_' + item.id}
            renderItem={renderItem}
            onDragEnd={handleDragEnd}
            contentContainerStyle={{ paddingBottom: insets.bottom + a(50) }}
            showsVerticalScrollIndicator={false}
            activationDistance={searchText.length > 0 ? 9999 : 0}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                colors={[Colors.corButton || '#FF7A00']} 
                tintColor={Colors.corButton || '#FF7A00'}
              />
            }
          />
        )}
      </View>

      {!isCategoryMode && (
        <FabCustom onPress={() => router.push('/(main)/(stack)/servicos/novo-servico' as any)} label='Novo serviço'  />
      )}

      <Modal visible={isCategoryModalVisible} transparent animationType="fade" onRequestClose={() => setCategoryModalVisible(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Ex: Barba, Rosto..."
              placeholderTextColor={Colors.placeholder}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus
              editable={!isModalSaving}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalBtnCancel} 
                onPress={() => {
                  setNewCategoryName('');
                  setEditingCategory(null);
                  setCategoryModalVisible(false);
                }}
                disabled={isModalSaving}
              >
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalBtnSave} 
                onPress={async () => {
                  const categoryName = newCategoryName.trim();
                  if (!categoryName) return;
                  
                  try {
                    if (editingCategory) {
                      await updateCategory.mutateAsync({ id: editingCategory.id, data: { name: categoryName } });
                      Toast.show({ type: 'success', text1: 'Categoria atualizada' });
                    } else {
                      await createCategory.mutateAsync({ name: categoryName });
                      Toast.show({ type: 'success', text1: 'Categoria criada' });
                    }
                    
                    setNewCategoryName('');
                    setEditingCategory(null);
                    setCategoryModalVisible(false);
                  } catch (error) {
                    Toast.show({ type: 'error', text1: 'Erro ao salvar' });
                  }
                }} 
                disabled={isModalSaving}
              >
                {isModalSaving ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.modalBtnSaveText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  createCategoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: a(10),
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
    fontSize: td(14),
    fontFamily: fonts?.robotoMedium,
    color: Colors.corText,
  },
  btnToggleMode: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: l(4), 
    backgroundColor: Colors.corContainer, 
    paddingHorizontal: l(12), 
    paddingVertical: a(8), 
    borderRadius: td(20) 
  },
  txtToggleMode: { 
    fontSize: td(12), 
    fontFamily: fonts?.robotoMedium, 
    color: Colors.corTextLight 
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    paddingVertical: a(10),
    paddingHorizontal: l(10),
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.border
  },
  categoryTitle: {
    fontSize: td(14),
    fontFamily: fonts?.robotoMedium,
    color: Colors.corText,
    marginLeft: l(8),
  },
  serviceCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: l(10),
    marginRight: l(5)
  },
  dragHandle: {
    width: l(30),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  dragHandleBottom: {
    flexDirection: 'row',  
    alignItems: 'center', 
    justifyContent: "space-between", 
    flex: 1,
    borderBottomWidth: 1, 
    borderColor: Colors.border, 
    paddingVertical: a(10)
  },
  verticalBar: {
    width: l(2),
    height: a(32),
    backgroundColor: Colors.corButton, 
    borderRadius: td(2),
    marginRight: l(12),
  },
  serviceInfo: {},
  serviceName: {
    fontSize: td(14),
    fontFamily: fonts?.robotoRegular,
    color: Colors.corText,
    marginBottom: a(2),
  },
  serviceDuration: {
    fontSize: td(12),
    fontFamily: fonts?.robotoRegular || 'System',
    color: Colors.corTextLight,
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: l(8),
  },
  servicePrice: {
    fontSize: td(15),
    fontFamily: fonts?.robotoMedium,
    color: Colors.corTextStrong,
  },
  activeItem: {
    backgroundColor: Colors.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'center', 
    padding: l(20) 
  },
  modalContent: { 
    backgroundColor: '#FFF', 
    borderRadius: td(16), 
    padding: l(20) 
  },
  modalTitle: { 
    fontSize: td(16), 
    fontFamily: fonts?.robotoBold, 
    color: '#1E293B', 
    marginBottom: a(16), 
    textAlign: 'center' 
  },
  modalInput: { 
    height: a(46), 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: td(10), 
    paddingHorizontal: l(12), 
    marginBottom: a(20) 
  },
  modalActions: { 
    flexDirection: 'row', gap: l(10), justifyContent: 'center',
  },
  modalBtnCancel: { 
    height: a(40), width:"50%", justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: td(10) 
  },
  modalBtnCancelText: { 
    color: '#64748B', fontFamily: fonts?.robotoMedium 
  },
  modalBtnSave: { 
    height: a(40), width:"50%", justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.corButton, borderRadius: td(10) 
  },
  modalBtnSaveText: { 
    color: '#FFF', fontFamily: fonts?.robotoMedium 
  },
});