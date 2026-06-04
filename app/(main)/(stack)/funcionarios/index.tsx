// app/(main)/(stack)/funcionarios/index.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

import { COMPANY_MOCK } from '@/mocks/company';
import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { SearchHeaderScreens } from '@/components/layout/header';
import { Colors } from '@/colors/color';

export interface EmployeeDTO {
  name: string;
  photoUrl: string;
  daysOff: string[];
  specificOperatingHours: any[];
}

export default function FuncionariosScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const filteredEmployees = useMemo(() => {
    const allEmployees = COMPANY_MOCK.employees;
    
    if (!searchText.trim()) return allEmployees;
    
    const lowerSearch = searchText.toLowerCase().trim();
    return allEmployees.filter(emp => emp.name.toLowerCase().includes(lowerSearch));
  }, [searchText]);

  const handleNewEmployee = () => {
    router.push('/(main)/(stack)/novo-funcionario' as any);
  };

  const handleEditEmployee = (employeeName: string) => {
    console.log('Editar funcionário:', employeeName);
  };

  const renderItem = useCallback(({ item }: { item: EmployeeDTO }) => {
    const initials = item.name.substring(0, 2).toUpperCase();
    const hasCustomHours = item.specificOperatingHours && item.specificOperatingHours.length > 0;

    return (
      <Pressable 
        style={styles.card}
        onPress={() => handleEditEmployee(item.name)}
      >
        <View style={styles.avatarContainer}>
          {item.photoUrl ? (
            <Image source={{ uri: item.photoUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.employeeName} numberOfLines={1}>{item.name}</Text>
          
          <View style={styles.metaRow}>
            {hasCustomHours ? (
              <View style={styles.statusWrapper}>
                <Ionicons name="time" size={td(14)} color={Colors.green}/>
                <Text style={styles.metaText}>Horários personalizados</Text>
              </View>
            ) : (
              <View style={styles.statusWrapper}>
                <Ionicons name="calendar-outline" size={td(14)} color={Colors.corTextLight} />
                <Text style={[styles.metaText, { color: Colors.corTextLight }]}>Horário padrão da loja</Text>
              </View>
            )}
          </View>
        </View>

        <Ionicons name="chevron-forward" size={td(18)} color="#CBD5E1" />
      </Pressable>
    );
  }, []);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ headerShown: false }} />
      
      <SearchHeaderScreens
        title="Minha Equipe"
        onBack={() => router.back()}
        filtered={filteredEmployees.length}
        searchValue={searchText}
        onSearchChange={setSearchText}
        placeHolder='Buscar por nome ou telefone...'
      />

      <View style={styles.listContainer}>
        <FlashList
          data={filteredEmployees}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          extraData={searchText}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-circle-outline" size={td(48)} color="#E2E8F0" />
              <Text style={styles.emptyTitle}>Nenhum profissional encontrado</Text>
              <Text style={styles.emptySubtitle}>
                {searchText ? 'Tente buscar por outro nome.' : 'Cadastre sua equipe para começar os agendamentos.'}
              </Text>
            </View>
          }
        />
      </View>

      <Pressable style={styles.fab} onPress={handleNewEmployee}>
        <Ionicons name="add" size={td(28)} color="#FFFFFF" />
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    listContainer: {
      flex: 1
    },
    listContent: {
      paddingBottom: a(100),
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: l(20),
      paddingVertical: a(14),
    },
    separator: {
      height: 1,
      backgroundColor: Colors.border,
      marginLeft: l(76),
    },
    avatarContainer: {
      marginRight: l(16),
    },
    avatarImage: {
      width: td(44),
      height: td(44),
      borderRadius: td(22),
      backgroundColor: Colors.corButtonDisable,
    },
    avatarFallback: {
      width: td(44),
      height: td(44),
      borderRadius: td(22),
      backgroundColor: '#F8FAFC',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#F1F5F9',
    },
    avatarText: {
      fontSize: td(16),
      fontFamily: fonts?.robotoBold,
      color: '#FF7A00',
    },
    infoContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    employeeName: {
      fontSize: td(16),
      fontFamily: fonts?.robotoBold || 'System',
      color: '#1E293B',
      marginBottom: a(4),
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: l(6),
    },
    metaText: {
      fontSize: td(13),
      fontFamily: fonts?.robotoMedium || 'System',
      color: Colors.green,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: a(80),
      paddingHorizontal: l(40),
    },
    emptyTitle: {
      marginTop: a(16),
      fontSize: td(16),
      fontFamily: fonts?.robotoBold || 'System',
      color: '#1E293B',
    },
    emptySubtitle: {
      marginTop: a(8),
      fontSize: td(14),
      fontFamily: fonts?.robotoRegular || 'System',
      color: '#64748B',
      textAlign: 'center',
      lineHeight: td(20),
    },
    fab: {
      position: 'absolute',
      bottom: a(24),
      right: l(20),
      width: td(56),
      height: td(56),
      borderRadius: td(28),
      backgroundColor: '#FF7A00',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#FF7A00',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
  });