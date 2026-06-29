// app/(main)/(tabs)/clientes/index.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { l, a, td } from '@/constants/responsive';
import { Colors } from '@/colors/color';
import { fonts } from '@/assets/fonts/fonts';
import { ClientsDTO, MOCK_CLIENTS } from '@/mocks/clientes';
import { SearchHeaderScreens } from '@/components/layout/header';
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

    return (
      <Pressable
        style={styles.card}
        onPress={() => handleEditCustomer(item.id)}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.customerName} numberOfLines={1}>
            {item.name}
          </Text>
  
          <Text style={styles.customerPhone}>
            {item.phone}
          </Text>
        </View>

        <View style={{flexDirection:"row", gap:l(5)}}>
          <TouchableOpacity style={styles.boxHandleCLick}>
            <Ionicons
              name="logo-whatsapp"
              size={td(16)}
              color={Colors.corTextSecondary}
            />
          </TouchableOpacity >

          <TouchableOpacity  style={styles.boxHandleCLick}>
            <Ionicons
              name="create-outline"
              size={td(16)}
              color={Colors.corTextSecondary}
            />
          </TouchableOpacity >

          <TouchableOpacity  style={styles.boxHandleCLick}>
            <Ionicons
              name="ellipsis-vertical"
              size={td(16)}
              color={Colors.corTextSecondary}
            />
          </TouchableOpacity >
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
        placeHolder='Pesquisar cliente...'
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
    paddingBottom: a(40),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:Colors.corBoxSearch,
    borderRadius:td(12),
    marginHorizontal: l(10),
    marginBottom: a(5),
    paddingHorizontal:l(10),
    paddingVertical:a(10)
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
    justifyContent: 'space-between',
    paddingRight: l(12),
  },

  customerName: {
    fontSize: td(16),
    fontFamily: fonts?.robotoMedium,
    color: Colors.corText,
    marginBottom: a(5),
  },

  customerPhone: {
    fontSize: td(12),
    fontFamily: fonts?.robotoRegular,
    color: Colors.corTextSecondary,
  },

  boxHandleCLick: {
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:Colors.corButtonSearch,
    paddingVertical:a(20),
    paddingHorizontal:l(10),
    borderRadius:td(8),
  },

  metaValue: {
    fontSize: td(12.5),
    fontFamily: fonts?.robotoMedium,
    color: Colors.corTextStrong,
  },
  fab: {
    position: 'absolute',
    bottom: a(24),
    right: l(20),
    width: td(54),
    height: td(54),
    borderRadius: td(27),

    backgroundColor: Colors.corScreen ,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,

    elevation: 4,
  },
});