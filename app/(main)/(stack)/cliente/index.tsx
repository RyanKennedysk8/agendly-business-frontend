// app/(main)/(tabs)/clientes/index.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

import { l, a, td } from '@/constants/responsive';
import { Colors } from '@/colors/color';
import { fonts } from '@/assets/fonts/fonts';
import { ClientsDTO, MOCK_CLIENTS } from '@/mocks/clientes';
import { SearchHeaderScreens } from '@/components/layout/header';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyList } from '@/components/shared/EmptyList';


export default function ClientesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [searchText, setSearchText] = useState('');

  const filteredClients = useMemo(() => {
    if (!searchText.trim()) return MOCK_CLIENTS;
    
    const lowerSearch = searchText.toLowerCase().trim();
    const digitsOnlySearch = lowerSearch.replace(/\D/g, '');

    return MOCK_CLIENTS.filter(c => {
      const matchesName = c.name.toLowerCase().includes(lowerSearch);
      
      const matchesPhone = digitsOnlySearch.length > 0 
        ? c.phone.replace(/\D/g, '').includes(digitsOnlySearch) 
        : false;

      return matchesName || matchesPhone;
    });
  }, [searchText]);

  //Vou criar essas rotas no futuro
  const handleNewCustomer = () => {
    router.push('/(main)/(stack)/novo-cliente' as any);
  };
  const handleEditCustomer = (id: string) => {
    console.log('Navegar para o perfil do cliente:', id);
  };
  const renderItem = useCallback(({ item }: { item: ClientsDTO }) => {
    const initials = item.name.substring(0, 2).toUpperCase();

    return (
      <Pressable 
        style={styles.card}
        onPress={() => handleEditCustomer(item.id)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.customerName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.customerPhone}>{item.phone}</Text>
        </View>

        <View style={styles.metaContainer}>
          <Text style={styles.metaLabel}>Última visita</Text>
          <Text style={styles.metaValue}>{item.lastVisit || 'Nunca'}</Text>
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
      <Stack.Screen 
        options={{
          headerShown: false
      }as any}/>

      <SearchHeaderScreens
        title="Meus Clientes"
        onBack={() => router.back()}
        filtered={filteredClients.length}
        searchValue={searchText}
        onSearchChange={setSearchText}
      />
    
      <View style={styles.listContainer}>
        <FlashList
          data={filteredClients}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" 
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <EmptyList message="Nenhum cliente encontrado" subMessage= {searchText ? 'Tente buscar com outros termos.' : 'Cadastre seu primeiro cliente para começar.'}/>
          }
        />
      </View>

      <Pressable style={styles.fab} onPress={handleNewCustomer}>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: l(20),
    paddingBottom: a(16),
  },
  headerTitle: {
    fontSize: td(24),
    fontFamily: fonts?.robotoBold || 'System',
    color: '#0F172A',
    marginRight: l(8),
  },
  badge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: l(8),
    paddingVertical: a(2),
    borderRadius: td(12),
  },
  badgeText: {
    fontSize: td(12),
    fontFamily: fonts?.robotoBold || 'System',
    color: '#64748B',
  },
 
  listContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    paddingBottom: a(100), 
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: l(20),
    paddingVertical: a(16),
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: l(76), 
  },
  avatar: {
    width: td(44),
    height: td(44),
    borderRadius: td(22),
    backgroundColor: '#FF7A0015',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: l(12),
  },
  avatarText: {
    fontSize: td(16),
    fontFamily: fonts?.robotoBold || 'System',
    color: Colors.corButton,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  customerName: {
    fontSize: td(16),
    fontFamily: fonts?.robotoBold || 'System',
    color: '#1E293B',
    marginBottom: a(2),
  },
  customerPhone: {
    fontSize: td(13),
    fontFamily: fonts?.robotoRegular || 'System',
    color: '#64748B',
  },
  metaContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: l(12),
  },
  metaLabel: {
    fontSize: td(11),
    fontFamily: fonts?.robotoMedium || 'System',
    color: '#94A3B8',
    marginBottom: a(2),
  },
  metaValue: {
    fontSize: td(12),
    fontFamily: fonts?.robotoBold || 'System',
    color: '#475569',
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
    backgroundColor: '#FF7A00', // Sua cor de marca primária
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra leve nativa (único lugar da tela que justifica o custo de processamento de sombra)
    shadowColor: '#FF7A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});