import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, 
  FlatList, Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { SearchHeaderScreens } from '@/components/layout/header';

// Zustand Store (Onde os dados do formulário vivem)
import { useServiceFormStore } from '@/store/useServiceFormStore';

// Hook real de buscar os funcionários da empresa
import { useCompanyEmployees } from '@/hooks/useCompanyEmployees'; 

export default function SelecionarFuncionariosScreen() {
  const router = useRouter();
  
  // 1. Conexão com o Zustand
  const form = useServiceFormStore();
  
  // 2. Busca de dados reais da API
  const { data: employees = [], isLoading } = useCompanyEmployees();
  
  const [searchText, setSearchText] = useState('');
  
  // Estado local dos IDs selecionados enquanto o usuário mexe na tela
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const hasInitialized = useRef(false);

  // 3. Sincronização Inicial: Lê do Zustand e preenche a tela
  useEffect(() => {
    if (employees.length > 0 && !hasInitialized.current) {
      if (form.employeeIds.includes('ALL')) {
        // Se no Zustand estiver ALL, marca todos os reais que vieram da API
        setSelectedIds(new Set(employees.map(emp => emp.id)));
      } else {
        // Senão, marca apenas os que estão no Zustand
        setSelectedIds(new Set(form.employeeIds));
      }
      hasInitialized.current = true;
    }
  }, [employees, form.employeeIds]);

  // Filtro de busca
  const filteredEmployees = useMemo(() => {
    if (!searchText.trim()) return employees;
    return employees.filter(emp => emp.name.toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText, employees]);

  // Cálculos de Estado para o "Selecionar Todos" e o "Ícone de Menos"
  const totalEmployees = employees.length;
  const totalSelected = selectedIds.size;
  const isAllSelected = totalEmployees > 0 && totalSelected === totalEmployees;
  const isIndeterminate = totalSelected > 0 && totalSelected < totalEmployees;

  // Lógica de clicar no "Todos os Profissionais"
  const toggleSelectAll = () => {
    if (isAllSelected || isIndeterminate) {
      // Se todos ou alguns estiverem marcados, limpar tudo
      setSelectedIds(new Set());
    } else {
      // Se nenhum estiver marcado, marcar todos
      setSelectedIds(new Set(employees.map(emp => emp.id)));
    }
  };

  // Lógica de clicar em 1 profissional específico
  const toggleEmployee = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // 4. Salvar: Escreve de volta no Zustand e volta pra tela de formulário
  const handleSave = () => {
    const selectedArray = Array.from(selectedIds);
    
    if (selectedArray.length === totalEmployees || selectedArray.length === 0) {
      // Se marcou todos (ou não marcou nenhum, assumimos "Todos" como padrão para não quebrar o app)
      form.setField('employeeIds', ['ALL']);
      form.setField('employeeNames', 'Todos (Padrão)');
    } else {
      // Se marcou alguns específicos
      form.setField('employeeIds', selectedArray);
      form.setField('employeeNames', `${selectedArray.length} profissional(is) selecionado(s)`);
    }
    
    router.back();
  };

  // Renderização do Avatar (Foto real ou Inicial do Nome)
  const renderAvatar = (emp: any) => {
    // Tenta usar a URL da foto (ajuste "profileImageUrl" ou "photoUrl" de acordo com seu DTO real)
    const photoUrl = emp.profileImageUrl || emp.photoUrl; 
    
    if (photoUrl) {
      return <Image source={{ uri: photoUrl }} style={styles.avatarImage} />;
    }
    
    // Fallback: Primeira letra do nome
    return (
      <View style={styles.avatarFallback}>
        <Text style={styles.avatarInitial}>
          {emp.name ? emp.name.charAt(0).toUpperCase() : '?'}
        </Text>
      </View>
    );
  };

  // Componente de Checkbox Customizado (Lida com check e traço)
  const CustomCheckbox = ({ isChecked, isIndeterminate }: { isChecked: boolean, isIndeterminate?: boolean }) => (
    <View style={[styles.checkboxBase, (isChecked || isIndeterminate) && styles.checkboxActive]}>
      {isChecked && !isIndeterminate && <Ionicons name="checkmark" size={td(14)} color="#FFF" />}
      {isIndeterminate && <Ionicons name="remove" size={td(16)} color="#FFF" />}
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <SearchHeaderScreens
        title="Profissionais"
        placeHolder='Buscar profissional...'
        onBack={() => router.back()}
        searchValue={searchText}
        onSearchChange={setSearchText}
        scrollY={new (require('react-native').Animated.Value)(0)} 
      />

      {isLoading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#FF7A00" /></View>
      ) : employees.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="people-outline" size={td(48)} color={Colors.corTextLight} />
          <Text style={styles.emptyText}>Nenhum profissional cadastrado.</Text>
        </View>
      ) : (
        <>
          <View style={styles.selectAllContainer}>
            <TouchableOpacity 
              style={styles.employeeRow} 
              activeOpacity={0.7}
              onPress={toggleSelectAll}
            >
              <CustomCheckbox isChecked={isAllSelected} isIndeterminate={isIndeterminate} />
              <Text style={styles.employeeName}>Selecionar todos ({totalEmployees})</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredEmployees}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = selectedIds.has(item.id);
              return (
                <TouchableOpacity 
                  style={styles.employeeRow} 
                  activeOpacity={0.7}
                  onPress={() => toggleEmployee(item.id)}
                >
                  <CustomCheckbox isChecked={isSelected} />
                  {renderAvatar(item)}
                  <Text style={styles.employeeName}>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
              <Text style={styles.btnSaveText}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: a(10) 
  },
  emptyText: { 
    fontSize: td(15), 
    fontFamily: fonts?.robotoMedium, 
    color: Colors.corTextLight 
  },
  listContent: { 
    paddingBottom: a(100) 
  },
  selectAllContainer: {
    borderBottomWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#F8FAFC',
  },
  employeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: a(14),
    paddingHorizontal: l(16),
    borderBottomWidth: 1,
    borderColor: Colors.border
  },
  employeeName: {
    flex: 1,
    fontSize: td(15),
    fontFamily: fonts?.robotoMedium,
    color: '#1E293B',
    marginLeft: l(12),
  },
  avatarImage: {
    width: l(40),
    height: l(40),
    borderRadius: l(20),
    marginLeft: l(12),
    backgroundColor: Colors.corContainer,
  },
  avatarFallback: {
    width: l(40),
    height: l(40),
    borderRadius: l(20),
    marginLeft: l(12),
    backgroundColor: Colors.corContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: td(16),
    fontFamily: fonts?.robotoBold,
    color: '#0284C7', 
  },
  checkboxBase: {
    width: l(20),
    height: l(20),
    borderRadius: td(6),
    borderWidth: 2,
    borderColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxActive: {
    backgroundColor: Colors.corButton,
    borderColor: Colors.corButton,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: l(16),
    paddingTop: a(16),
    paddingBottom: a(32),
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10,
  },
  btnSave: {
    height: a(40),
    backgroundColor: Colors.corButton,
    borderRadius: td(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSaveText: {
    fontSize: td(16),
    fontFamily: fonts?.robotoBold,
    color: '#FFFFFF',
  }
});