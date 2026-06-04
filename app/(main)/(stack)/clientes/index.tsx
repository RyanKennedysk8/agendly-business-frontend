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
    const initials = item.name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  
    return (
      <Pressable
        style={styles.card}
        onPress={() => handleEditCustomer(item.id)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
  
        <View style={styles.infoContainer}>
          <Text style={styles.customerName} numberOfLines={1}>
            {item.name}
          </Text>
  
          <Text style={styles.customerPhone}>
            {item.phone}
          </Text>
        </View>
  
        <View style={styles.metaContainer}>
          <Text style={styles.metaLabel}>Última visita</Text>
          <Text style={styles.metaValue}>
            {item.lastVisit || 'Nunca'}
          </Text>
        </View>
  
        <View style={styles.chevronWrapper}>
          <Ionicons
            name="chevron-forward"
            size={td(16)}
            color="#CBD5E1"
          />
        </View>
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
        placeHolder='Buscar por nome ou telefone...'
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
  listContainer: {
    flex: 1
  },
  listContent: {
    paddingBottom: a(100),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: l(20),
    paddingVertical: a(15),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  separator: {
    height: 0,
  },
  avatar: {
    width: td(42),
    height: td(42),
    borderRadius: td(21),
    backgroundColor: Colors.corButtonDisable,
    justifyContent: 'center',
    alignItems: 'center',

    marginRight: l(14),
  },

  avatarText: {
    fontSize: td(14),
    fontFamily: fonts?.robotoMedium,
    color: Colors.corButton,
  },

  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: l(12),
  },

  customerName: {
    fontSize: td(15),
    fontFamily: fonts?.robotoMedium,
    color: Colors.corText,
    marginBottom: a(4),
  },

  customerPhone: {
    fontSize: td(13),
    fontFamily: fonts?.robotoRegular,
    color: Colors.corTextLight,
  },

  metaContainer: {
    alignItems: 'flex-end',
    marginRight: l(12),
    minWidth: l(72),
  },

  metaLabel: {
    fontSize: td(11),
    fontFamily: fonts?.robotoRegular,
    color: Colors.corTextLight,
    marginBottom: a(2),
  },

  metaValue: {
    fontSize: td(12.5),
    fontFamily: fonts?.robotoMedium,
    color: Colors.corTextStrong,
  },

  chevronWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  fab: {
    position: 'absolute',
    bottom: a(24),
    right: l(20),
    width: td(54),
    height: td(54),
    borderRadius: td(27),

    backgroundColor: Colors.corButton,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,

    elevation: 4,
  },
});