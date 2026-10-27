import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  Pressable,
  ActivityIndicator,
  StatusBar,
  Keyboard,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

// O Sucessor moderno do Modalize
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetFlatList
} from '@gorhom/bottom-sheet';

import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { FormInput } from '@/components/shared/FormInput';
import { FormSelectTile } from '@/components/shared/FormSelectTile';
import { EditeProfileHeader } from '@/components/layout/header';
import { useCompanyCategories } from '@/hooks/useCompanyCategories';
import { useCompanyServices } from '@/hooks/useCompanyServices';
import { useCompanyEmployees } from '@/hooks/useCompanyEmployees'; // <-- IMPORT ADICIONADO AQUI
import { useServiceMutations } from '@/hooks/useServiceMutations';
import { ServiceRequestDTO } from '@/types/company';
import { useServiceFormStore } from '@/store/useServiceFormStore';

interface FormErrors {
  name?: boolean;
  price?: boolean;
  duration?: boolean;
  category?: boolean;
}

export default function NovoServicoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const { createService, updateService, deleteService} = useServiceMutations();
  const { data: categoriesData = [] } = useCompanyCategories();
  const { data: services = [] } = useCompanyServices();
  const { data: employees = [] } = useCompanyEmployees(); // <-- BUSCA DE FUNCIONÁRIOS ADICIONADA AQUI

  const form = useServiceFormStore();

  const [errors, setErrors] = useState<FormErrors>({});
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Ref e SnapPoints para o Bottom Sheet (Modal)
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '75%'], []); // Alturas que o modal pode assumir

  useEffect(() => {
    if (isEditing && !isHydrated && services.length > 0) {
      const serviceToEdit = services.find((s) => s.id === id);

      if (serviceToEdit) {
        const category = categoriesData.find(
          (c) => c.id === serviceToEdit.categoryId
        );

        const empIds =
          !serviceToEdit.employeeIds ||
          serviceToEdit.employeeIds.length === 0
            ? ['ALL']
            : serviceToEdit.employeeIds;

        const empNames = empIds.includes('ALL')
          ? 'Todos (Padrão)'
          : `${empIds.length} profissionais selecionados`;

        form.hydrate({
          name: serviceToEdit.name,
          price: serviceToEdit.price.toFixed(2).replace('.', ','),
          durationInMinutes: serviceToEdit.durationInMinutes,
          isHomeService: serviceToEdit.isHomeService,
          isPetService: serviceToEdit.isPetService,
          categoryId: serviceToEdit.categoryId || null,
          categoryName: category?.name || '',
          employeeIds: empIds,
          employeeNames: empNames,
        });

        setIsHydrated(true);
      }
    } else if (!isEditing && !isHydrated) {
      form.reset();
      setIsHydrated(true);
    }
  }, [id, services, categoriesData, isEditing, isHydrated]);

  useEffect(() => {
    return () => form.reset();
  }, []);

  const handlePriceChange = (text: string) => {
    const rawText = text.replace(/\D/g, '');
    if (!rawText) {
      form.setField('price', '');
      return;
    }
    form.setField('price', text);
    setErrors((prev) => ({ ...prev, price: false }));
  };

  const formatDurationText = (minutes: number) => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) newErrors.name = true;
    if (!form.price || parseFloat(form.price.replace(',', '.')) <= 0) newErrors.price = true;
    if (!form.durationInMinutes) newErrors.duration = true;
    if (!form.categoryId) newErrors.category = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // LÓGICA DE SALVAR CORRIGIDA
  // ==========================================
  const handleSave = async () => {
    Keyboard.dismiss();

    if (!validate()) {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    let finalEmployeeIds = form.employeeIds;

    // Se estiver marcado como 'ALL' ou o array vier vazio, mapeamos todos os IDs da loja
    if (finalEmployeeIds.includes('ALL') || finalEmployeeIds.length === 0) {
      finalEmployeeIds = employees.map(emp => emp.id);
    }

    const payload: ServiceRequestDTO = {
      name: form.name.trim(),
      price: parseFloat(form.price.replace(',', '.')),
      durationInMinutes: form.durationInMinutes,
      categoryId: form.categoryId as string,
      employeeIds: finalEmployeeIds, // AGORA O SPRING BOOT RECEBE A LISTA CHEIA!
      isHomeService: form.isHomeService,
      isPetService: form.isPetService,
    };

    try {
      if (isEditing && id) {
        await updateService.mutateAsync({ id, data: payload });
        Toast.show({ type: 'success', text1: 'Serviço atualizado', text2: 'As alterações foram salvas com sucesso.' });
      } else {
        await createService.mutateAsync(payload);
        Toast.show({ type: 'success', text1: 'Serviço criado', text2: 'O novo serviço foi adicionado ao catálogo.' });
      }

      form.reset();
      router.replace('/(main)/(stack)/servicos');
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Falha na operação', text2: 'Ocorreu um erro ao tentar salvar.' });
      console.error('Falha ao salvar serviço', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Serviço',
      'Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              if (id) {
                await deleteService.mutateAsync(id);
                Toast.show({ type: 'success', text1: 'Serviço excluído', text2: 'O serviço foi removido do catálogo.' });
                router.replace('/(main)/(stack)/servicos');
              }
            } catch (error) {
              Toast.show({ type: 'error', text1: 'Erro ao excluir', text2: 'Não foi possível remover o serviço.' });
            }
          }
        }
      ]
    );
  };

  const openCategoryModal = useCallback(() => {
    Keyboard.dismiss();
    bottomSheetModalRef.current?.present();
  }, []);

  const selectCategory = (categoryId: string, categoryName: string) => {
    form.setField('categoryId', categoryId);
    form.setField('categoryName', categoryName);
    setErrors(prev => ({ ...prev, category: false }));
    bottomSheetModalRef.current?.dismiss(); 
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  const isPending = createService.isPending || updateService.isPending;

  return (
    <BottomSheetModalProvider>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <Stack.Screen options={{ headerShown: false }} />

        <EditeProfileHeader
          title={isEditing ? 'Editar Serviço' : 'Novo Serviço'}
          onBack={() => router.back()}
        />

        <StatusBar barStyle="dark-content" />

        {isHydrated && (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            onScrollBeginDrag={Keyboard.dismiss}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <FormInput
                label="Serviço *"
                placeholder="Nome do serviço"
                returnKeyType="done"
                value={form.name}
                onChangeText={(t) => {
                  form.setField('name', t);
                  setErrors((prev) => ({ ...prev, name: false }));
                }}
                error={errors.name}
              />

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <FormInput
                    label="Preço *"
                    placeholder="0,00"
                    prefix="R$"
                    keyboardType="numeric"
                    returnKeyType="done"
                    value={form.price}
                    onChangeText={handlePriceChange}
                    onBlur={() => {
                      const value = form.price.replace(',', '.');
                      const numericValue = Number(value);

                      if (!Number.isNaN(numericValue) && numericValue > 0) {
                        form.setField('price', numericValue.toFixed(2).replace('.', ','));
                      }
                    }}
                    error={errors.price}
                  />
                </View>

                <View style={styles.halfInput}>
                  <FormSelectTile
                    label="Duração *"
                    value={formatDurationText(form.durationInMinutes)}
                    placeholder="00 min"
                    error={errors.duration}
                    onPress={() => router.push('/(main)/(stack)/servicos/more/selecao-tempo' as any)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <FormSelectTile
                label="Categoria"
                placeholder="Selecione uma categoria"
                value={form.categoryName}
                error={errors.category}
                onPress={openCategoryModal} 
              />

              <FormSelectTile
                label="Profissionais Habilitados"
                placeholder="Selecione os profissionais"
                value={form.employeeNames}
                onPress={() =>
                  router.push({ pathname: '/(main)/(stack)/servicos/more/selecionar-funcionarios' } as any)
                }
              />
            </View>

            <View style={styles.card}>
              <View style={styles.switchGroup}>
                <View style={styles.switchTextContainer}>
                  <Text style={styles.switchTitle}>Atendimento em Domicílio</Text>
                  <Text style={styles.switchSubtitle}>Profissional atende no local do cliente</Text>
                </View>

                <Switch
                  value={form.isHomeService}
                  onValueChange={(val) => form.setField('isHomeService', val)}
                  trackColor={{
                    true: Colors.corButton,
                    false: Colors.corButtonOff || '#E2E8F0',
                  }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={[styles.switchGroup, { borderBottomWidth: 0 }]}>
                <View style={styles.switchTextContainer}>
                  <Text style={styles.switchTitle}>Serviço para Pets</Text>
                  <Text style={styles.switchSubtitle}>Requer identificação do animal</Text>
                </View>

                <Switch
                  value={form.isPetService}
                  onValueChange={(val) => form.setField('isPetService', val)}
                  trackColor={{
                    true: Colors.corButton,
                    false: Colors.corButtonOff || '#E2E8F0',
                  }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </ScrollView>
        )}

        <View style={styles.footer}>
          {isEditing && (
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={handleDelete}
              disabled={isPending}
            >
              <Ionicons name="trash-outline" size={td(22)} color="#F43F5E" />
            </TouchableOpacity>
          )}

          <Pressable
            style={[styles.saveButton, isPending && styles.saveButtonPending]}
            onPress={handleSave}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Salvar Alterações' : 'Criar Serviço'}
              </Text>
            )}
          </Pressable>
        </View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0} 
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={styles.bottomSheetIndicator}
          backgroundStyle={styles.bottomSheetBackground}
        >
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.modalTitle}>Selecione a Categoria</Text>
          </View>

          {categoriesData.length === 0 ? (
            <View style={styles.emptyCategory}>
              <Ionicons name="folder-open-outline" size={td(40)} color={Colors.corTextLight} />
              <Text style={styles.emptyCategoryText}>Nenhuma categoria cadastrada.</Text>
            </View>
          ) : (
            <BottomSheetFlatList
              data={categoriesData.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingBottom: a(40), paddingHorizontal: l(20) }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = form.categoryId === item.id;
                return (
                  <TouchableOpacity
                    style={styles.categoryOption}
                    onPress={() => selectCategory(item.id, item.name)}
                  >
                    <Text style={[
                      styles.categoryOptionText, 
                      isSelected && { color: Colors.corButton, fontFamily: fonts?.robotoBold }
                    ]}>
                      {item.name}
                    </Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={td(22)} color={Colors.corButton} />}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </BottomSheetModal>

      </KeyboardAvoidingView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.white 
  },
  scroll: { 
    flex: 1 
  },
  scrollContent: { 
    paddingVertical: l(10), 
    gap: a(10), 
    paddingBottom: a(20) 
  },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: td(12), 
    paddingHorizontal: l(15), 
    paddingVertical: a(10), 
    gap: a(15) 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    gap: l(10) 
  },
  halfInput: { 
    flex: 1 
  },
  switchGroup: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: a(8), 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    borderBottomColor: Colors.border 
  },
  switchTextContainer: { 
    flex: 1, 
    paddingRight: l(12) 
  },
  switchTitle: { 
    fontSize: td(14), 
    fontFamily: fonts?.robotoMedium || 'System',
    color: Colors.corText 
  },
  switchSubtitle: { 
    fontSize: td(12), 
    fontFamily: fonts?.robotoRegular, 
    color: Colors.corTextSecondary 
  },
  footer: { 
    flexDirection: 'row', 
    gap: l(12), 
    backgroundColor: Colors.white, 
    paddingHorizontal: l(16), 
    paddingTop: a(12), 
    paddingBottom: a(24) 
  },
  saveButton: { 
    flex: 1, 
    backgroundColor: Colors.corButton, 
    height: a(40), 
    borderRadius: td(10), 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  deleteButton: {
    width: a(40), 
    height: a(40),
    backgroundColor: '#FFF1F2',
    borderRadius: td(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3', 
  },
  saveButtonPending: { 
    opacity: 0.7 
  },
  saveButtonText: { 
    fontSize: td(15), 
    fontFamily: fonts?.robotoBold,
    color: '#FFFFFF' 
  },
  bottomSheetBackground: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: td(24),
    borderTopRightRadius: td(24),
  },
  bottomSheetIndicator: {
    backgroundColor: '#E2E8F0',
    width: l(40),
    height: a(5),
  },
  bottomSheetHeader: {
    paddingHorizontal: l(20),
    paddingBottom: a(16),
    paddingTop: a(8),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    marginBottom: a(8),
  },
  modalTitle: { 
    fontSize: td(18), 
    fontFamily: fonts?.robotoBold, 
    color: Colors.corText 
  },
  categoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: a(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  categoryOptionText: {
    fontSize: td(15),
    fontFamily: fonts?.robotoMedium,
    color: Colors.corText,
  },
  emptyCategory: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: a(40),
    gap: a(10),
  },
  emptyCategoryText: {
    fontSize: td(16),
    fontFamily: fonts?.robotoMedium,
    color: Colors.corTextLight,
  },
});