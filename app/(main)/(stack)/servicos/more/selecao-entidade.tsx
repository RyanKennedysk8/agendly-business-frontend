// app/(main)/(stack)/servicos/selecao-entidade.tsx
import React, { useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Pressable, Animated, Keyboard } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { EditeProfileHeader, SearchHeaderScreens } from '@/components/layout/header';
import { FabCustom } from '@/components/shared/FabCustom';
import { useCompanyCategories } from '@/hooks/useCompanyCategories';
import { useCompanyEmployees } from '@/hooks/useCompanyEmployees';
import { useServiceFormStore } from '@/store/useServiceFormStore';
import { FlashList } from '@shopify/flash-list';

export default function SelecaoEntidadeScreen() {
  const router = useRouter();
  
  const params = useLocalSearchParams<{ type: 'categoria' | 'profissionais' }>();

  const isMultiSelect = params.type === 'profissionais';
  const scrollY = useRef(new Animated.Value(0)).current;
  const form = useServiceFormStore(); // Consome a store

  const [multiSelection, setMultiSelection] = useState<string[]>(
    isMultiSelect ? form.employeeIds : []
  );

  const { data: categoriesData = [] } = useCompanyCategories();
  const { data: employeesData = [] } = useCompanyEmployees();

  const [search, setSearch] = useState('');


  // Mapeamento Dinâmico de Entidade
  const sourceData = useMemo(() => {
    if (params.type === 'categoria') {
      return categoriesData.map(c => ({ id: c.id, name: c.name }));
    } else {
      return [
        { id: 'ALL', name: 'Todos os profissionais' }, // Injeção lógica do item padrão
        ...employeesData.map(e => ({ id: e.id, name: e.name }))
      ];
    }
  }, [params.type, categoriesData, employeesData]);

  // Motor de Busca
  const filteredData = sourceData.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  // Manipulador de Clique
  const handleSelect = (item: { id: string; name: string }) => {
    if (!isMultiSelect) {
      // Categoria (Single Select)
      form.setField('categoryId', item.id);
      form.setField('categoryName', item.name);
      router.back(); // Apenas volta
    } else {
      // Multi-Select (Profissionais): Alterna estados (Toggle)
      let newSelection = [...multiSelection];

      if (item.id === 'ALL') {
        newSelection = ['ALL'];
      } else {
        // Se clicar em um específico, remove a flag ALL
        newSelection = newSelection.filter(id => id !== 'ALL');
        
        if (newSelection.includes(item.id)) {
          newSelection = newSelection.filter(id => id !== item.id);
        } else {
          newSelection.push(item.id);
        }

        // Se desmarcou todos, fallback pro ALL nativo
        if (newSelection.length === 0) {
          newSelection = ['ALL'];
        }
      }
      setMultiSelection(newSelection);
    }
  };

  // Botão Concluir (Aparece apenas no modo de múltipla escolha)
  const handleConfirmMultiSelection = () => {
    // Monta a string descritiva visual (ex: "João, Maria" ou "3 profissionais")
    let employeeNames = '';
    
    if (multiSelection.includes('ALL')) {
      employeeNames = 'Todos (Padrão)';
    } else {
      const selectedNames = sourceData
        .filter(e => multiSelection.includes(e.id))
        .map(e => e.name);

      employeeNames = selectedNames.length > 2 
        ? `${selectedNames.length} profissionais selecionados` 
        : selectedNames.join(', ');
    }

    form.setField('employeeIds', multiSelection);
    form.setField('employeeNames', employeeNames);
    router.back();
  };

  const handleAddNew = () => {
    if (params.type === 'categoria') {
      router.push('/(main)/(stack)/categorias/nova-categoria' as any);
    } else {
      router.push('/(main)/(stack)/funcionarios/novo-funcionario' as any);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <SearchHeaderScreens
        title={params.type === 'categoria' ? 'Selecionar Categoria' : 'Selecionar Profissionais'}
        placeHolder={params.type === "categoria" ? 'Buscar por categoria...' : 'Buscar por profissionais...'}
        onBack={() => router.back()}
        searchValue={search}
        onSearchChange={setSearch}
        scrollY={scrollY}
      />

      <FlashList
        data={filteredData}
        keyExtractor={(item) => item.id}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
        contentContainerStyle={{ paddingBottom: a(100) }}
        renderItem={({ item }) => {
          // Lógica visual do Check (Modo Single ou Modo Multi)
          const isSelected = isMultiSelect 
            ? multiSelection.includes(item.id) 
            : params.type === item.id;
          return (
            <TouchableOpacity
              style={styles.rowItem}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
            >
              <Text style={[styles.rowText, isSelected && styles.rowTextSelected]}>
                {item.name}
              </Text>
              
              {isMultiSelect ? (
                <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                  {isSelected && <Ionicons name="checkmark" size={td(14)} color="#FFFFFF" />}
                </View>
              ) : (
                isSelected && <Ionicons name="checkmark" size={td(20)} color={Colors.corButton} />
              )}
            </TouchableOpacity>
          );
        }}
      />
      {params.type === "profissionais" && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmMultiSelection} activeOpacity={0.8}>
            <Text style={styles.confirmText}>Confirmar Duração</Text>
          </TouchableOpacity>
        </View>
      )}

      <FabCustom 
        onPress={handleAddNew} 
        label={params.type === 'categoria' ? 'Nova Categoria' : 'Novo Funcionário'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: l(16),
    paddingHorizontal: l(12),
    height: a(40),
    backgroundColor: Colors.corBoxSearch || '#F8FAFC',
    borderRadius: td(8),
    borderWidth: 1,
    borderColor: Colors.border || '#E2E8F0',
  },
  searchInput: { 
    flex: 1, 
    marginLeft: l(8), 
    fontSize: td(14), 
    color: Colors.corText 
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: a(16),
    paddingHorizontal: l(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border || '#E2E8F0',
  },
  rowText: { 
    fontSize: td(15), 
    fontFamily: fonts?.robotoMedium || 'System', 
    color: Colors.corText 
  },
  rowTextSelected: {
    color: Colors.corButton, // Destaca o texto quando selecionado
    fontFamily: fonts?.robotoBold || 'System',
  },
  checkbox: { 
    width: td(22), 
    height: td(22), 
    borderRadius: td(6), 
    borderWidth: 1.5, 
    borderColor: '#CBD5E1', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  checkboxActive: { 
    backgroundColor: Colors.corButton, 
    borderColor: Colors.corButton 
  },
  btnConfirm: {
    paddingHorizontal: l(8),
    justifyContent: 'center'
  },
  btnConfirmText: {
    fontSize: td(14),
    fontFamily: fonts?.robotoBold || 'System',
    color: Colors.corButton
  },
  footer: {
    paddingHorizontal: l(20),
    paddingTop: a(14),
    paddingBottom: a(28),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderHairLine,
    backgroundColor: '#FFFFFF',
    gap: a(12),
  },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: l(4),
  },
  summaryLabel: {
    fontSize: td(13),
    fontFamily: fonts?.robotoRegular || 'System',
    color: Colors.corTextSecondary,
  },
  summaryValue: {
    fontSize: td(15),
    fontFamily: fonts?.robotoBold || 'System',
    color: Colors.corButton,
  },
  confirmButton: {
    backgroundColor: Colors.corButton,
    height: a(48),
    borderRadius: td(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    fontSize: td(15),
    fontFamily: fonts?.robotoBold || 'System',
    color: '#FFFFFF',
  },
});