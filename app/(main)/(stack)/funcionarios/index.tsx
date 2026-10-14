import { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Image, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { SearchHeaderScreens } from '@/components/layout/header';
import { Colors } from '@/colors/color';
import { FabCustom } from '@/components/shared/FabCustom';

import { useCompanyEmployees, EmployeeSummaryDTO } from '@/hooks/useCompanyEmployees';
import { SkeletonList, EmployeeSkeleton } from '@/components/shared/SkeletonList';


export default function FuncionariosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);


  // Extraímos o refetch da API
  const { data: employees = [], isLoading, refetch } = useCompanyEmployees();

  const filteredEmployees = useMemo(() => {
    if (!searchText.trim()) return employees;
    const lowerSearch = searchText.toLowerCase().trim();
    return employees.filter(emp => emp.name.toLowerCase().includes(lowerSearch));
  }, [searchText, employees]);

  const handleNewEmployee = () => {
    router.push('/(main)/(stack)/funcionarios/novo-funcionario' as any);
  };

  const handleEditEmployee = (id: string) => {
    router.push({ pathname: '/(main)/(stack)/funcionarios/novo-funcionario', params: { id } } as any);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const renderItem = useCallback(({ item }: { item: EmployeeSummaryDTO }) => {
    const initials = item.name ? item.name.substring(0, 2).toUpperCase() : '?';
    const hasCustomHours = item.specificOperatingHours && item.specificOperatingHours.length > 0;

    return (
      <Pressable 
        style={styles.card}
        onPress={() => handleEditEmployee(item.id)}
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
        searchValue={searchText}
        onSearchChange={setSearchText}
        placeHolder='Buscar profissional...'
      />

      <View style={styles.listContainer}>
        {isLoading ? (
          <SkeletonList 
            count={7} 
            ItemComponent={EmployeeSkeleton} 
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <FlashList
            data={filteredEmployees}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            extraData={searchText}
            contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + a(100) }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode='on-drag'
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            alwaysBounceVertical={false}
            overScrollMode="never"
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                colors={[Colors.corButton ]} 
                tintColor={Colors.corButton } 
              />
            }
            scrollEventThrottle={16} 
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="people-circle-outline" size={td(48)} color="#E2E8F0" />
                <Text style={styles.emptyTitle}>Nenhum profissional encontrado</Text>
                <Text style={styles.emptySubtitle}>
                  {searchText 
                    ? 'Tente buscar por outro nome.' 
                    : 'Cadastre sua equipe para começar os agendamentos.'}
                </Text>
              </View>
            }
          />
        )}
      </View>

      <FabCustom onPress={handleNewEmployee} label='Novo Funcionário'/>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  listContainer: { flex: 1 },
  listContent: { paddingTop: a(10) },
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
  avatarContainer: { marginRight: l(16) },
  avatarImage: {
    width: td(44),
    height: td(44),
    borderRadius: td(22),
    backgroundColor: Colors.corButtonDisable || '#E2E8F0',
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
  infoContainer: { flex: 1, justifyContent: 'center' },
  employeeName: {
    fontSize: td(16),
    fontFamily: fonts?.robotoBold || 'System',
    color: '#1E293B',
    marginBottom: a(4),
  },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  statusWrapper: { flexDirection: 'row', alignItems: 'center', gap: l(6) },
  metaText: {
    fontSize: td(13),
    fontFamily: fonts?.robotoMedium || 'System',
    color: Colors.green || '#10B981',
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
});