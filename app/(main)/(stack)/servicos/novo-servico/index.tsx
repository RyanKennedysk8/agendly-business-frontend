import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Switch, KeyboardAvoidingView, Platform, ScrollView, Text, Pressable, ActivityIndicator, StatusBar, Keyboard } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { FormInput } from '@/components/shared/FormInput';
import { FormSelectTile } from '@/components/shared/FormSelectTile';
import { EditeProfileHeader } from '@/components/layout/header';
import { useCompanyCategories } from '@/hooks/useCompanyCategories';
import { useCompanyServices } from '@/hooks/useCompanyServices';
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

  const { createService, updateService } = useServiceMutations();
  const { data: categoriesData = [] } = useCompanyCategories();
  const { data: services = [] } = useCompanyServices();

  // Conectando a Store Global de Rascunho
  const form = useServiceFormStore();

  const [errors, setErrors] = useState<FormErrors>({});
  const [isHydrated, setIsHydrated] = useState(false);

  // HIDRATAÇÃO INICIAL (Acontece apenas 1 vez ao entrar na tela para edição)
  useEffect(() => {
    if (isEditing && !isHydrated && services.length > 0) {
      const serviceToEdit = services.find((s) => s.id === id);
      
      if (serviceToEdit) {
        const category = categoriesData.find((c) => c.id === serviceToEdit.categoryId);
        const empIds = (!serviceToEdit.employeeIds || serviceToEdit.employeeIds.length === 0) ? ['ALL'] : serviceToEdit.employeeIds;
        const empNames = empIds.includes('ALL') ? 'Todos (Padrão)' : `${empIds.length} profissionais selecionados`;

        // Preenche a Store com os dados do servidor
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
      // Se for criação nova, reseta a store de lixos de navegações anteriores
      form.reset();
      setIsHydrated(true);
    }
  }, [id, services, categoriesData, isEditing, isHydrated]);

  // Limpeza ao sair definitivamente da tela de criação/edição
  useEffect(() => {
    return () => form.reset();
  }, []);

  const handlePriceChange = (text: string) => {
    const rawText = text.replace(/\D/g, '');
    if (!rawText) {
      form.setField('price', '');
      return;
    }
    const numericValue = (Number(rawText) / 100).toFixed(2);
    form.setField('price', numericValue.replace('.', ','));
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

  const handleSave = async () => {
    if (!validate()) return;
    const payloadEmployeeIds = form.employeeIds.includes('ALL') ? [] : form.employeeIds;

    const payload: ServiceRequestDTO = {
      name: form.name.trim(),
      price: parseFloat(form.price.replace(',', '.')),
      durationInMinutes: form.durationInMinutes,
      categoryId: form.categoryId as string,
      employeeIds: payloadEmployeeIds,
      isHomeService: form.isHomeService,
      isPetService: form.isPetService,
    };

    try {
      if (isEditing && id) {
        await updateService.mutateAsync({ id, data: payload });
      } else {
        await createService.mutateAsync(payload);
      }
      form.reset();
      router.replace("/(main)/(stack)/servicos");
    } catch (error) {
      console.error("Falha ao salvar serviço", error);
    }
  };

  const isPending = createService.isPending || updateService.isPending;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <EditeProfileHeader title={isEditing ? 'Editar Serviço' : 'Novo Serviço'} onBack={() => router.back()} />
          ),
        }}
      />
      <StatusBar barStyle="dark-content" />

      {isHydrated && (
        <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled" 
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={Keyboard.dismiss}
        showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <FormInput
              label="Nome do Serviço *"
              placeholder="Ex: Corte de Cabelo"
              value={form.name}
              onChangeText={(t) => {
                form.setField('name', t);
                setErrors((prev) => ({ ...prev, name: false }));
              }}
              error={errors.name}
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: l(10) }}>
                <FormInput
                  label="Preço *"
                  placeholder="Preço"
                  prefix="R$"
                  keyboardType="numeric"
                  value={form.price}
                  onChangeText={handlePriceChange}
                  error={errors.price}
                />
              </View>

              <View style={{ flex: 1 }}>
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
              label="Categoria *"
              placeholder="Selecione uma categoria"
              value={form.categoryName}
              error={errors.category}
              onPress={() => router.push({ pathname: '/(main)/(stack)/servicos/more/selecao-entidade', params: { type: 'categoria' } } as any)}
            />

            <FormSelectTile
              label="Profissionais Habilitados"
              placeholder="Selecione os profissionais"
              value={form.employeeNames}
              onPress={() => router.push({ pathname: '/(main)/(stack)/servicos/more/selecao-entidade', params: { type: 'profissionais' } } as any)}
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
                trackColor={{ true: Colors.corButton, false: Colors.corButtonOff || '#E2E8F0' }}
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
                trackColor={{ true: Colors.corButton, false: Colors.corButtonOff || '#E2E8F0' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </ScrollView>
      )}

      <View style={styles.footer}>
        <Pressable style={[styles.saveButton, isPending && { opacity: 0.7 }]} onPress={handleSave} disabled={isPending}>
          {isPending ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.saveButtonText}>{isEditing ? 'Salvar Alterações' : 'Criar Serviço'}</Text>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.corContainer
  },
  scrollContent: {
    paddingHorizontal: l(15),
    paddingVertical: l(10),
    gap: a(10),
    paddingBottom: a(100),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: td(12),
    padding: l(16),
    gap: a(15),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: a(8),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  switchTextContainer: { flex: 1, paddingRight: l(12) },
  switchTitle: {
    fontSize: td(14),
    fontFamily: fonts?.robotoMedium || 'System',
    color: Colors.corText,
  },
  switchSubtitle: {
    fontSize: td(12),
    fontFamily: fonts?.robotoRegular || 'System',
    color: Colors.corTextSecondary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: l(16),
    paddingTop: a(12),
    paddingBottom: a(24)
  },
  saveButton: {
    backgroundColor: Colors.corButton,
    height: a(48),
    borderRadius: td(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: td(15),
    fontFamily: fonts?.robotoBold || 'System',
    color: '#FFFFFF',
  },
});