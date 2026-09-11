// app/(main)/(tabs)/clientes/index.tsx
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, TouchableOpacity, Animated } from 'react-native';
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
import { FabCustom } from '@/components/shared/FabCustom';

// Invólucro de Alta Ordem (HOC) para interceptação de eventos nativos na Thread UI
const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<ClientsDTO>);

export default function ClientesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [searchText, setSearchText] = useState('');

  // Persistência em memória (RAM) do vetor de animação Y sem disparar trigger de renderização
  const scrollY = useRef(new Animated.Value(0)).current;

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

          <TouchableOpacity style={styles.boxHandleCLick}>
            <Ionicons
              name="create-outline"
              size={td(16)}
              color={Colors.corTextSecondary}
            />
          </TouchableOpacity >

          <TouchableOpacity style={styles.boxHandleCLick}>
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
      } as any}/>

      <SearchHeaderScreens
        title="Meus Clientes"
        placeHolder='Pesquisar cliente...'
        onBack={() => router.back()}
        searchValue={searchText}
        onSearchChange={setSearchText}
        scrollY={scrollY}
      />
    
      <View style={styles.listContainer}>
        <AnimatedFlashList
          data={filteredClients}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" 
          keyboardDismissMode='on-drag'
          ItemSeparatorComponent={() => <View style={styles.separator} />}
     
          // Binding do Offset Y via frame pipeline mantendo 60FPS
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false } // Interpolando margin e height, requer Thread JS (não suporta direct UI Thread)
          )}
          scrollEventThrottle={16} // Resolução de captura em milissegundos (~60FPS)
          
          ListEmptyComponent={
            <EmptyList 
              message="Nenhum cliente encontrado" 
              subMessage={searchText ? 'Tente buscar com outros termos.' : 'Cadastre seu primeiro cliente para começar.'}
            />
          }
        />
      </View>

      <FabCustom onPress={handleNewCustomer} label='Novo cliente'/>
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
    paddingBottom: a(100), paddingTop: a(10)
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: l(20),
    paddingVertical: a(10),
    borderBottomColor: Colors.border,
    borderBottomWidth: 1
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.corButtonSearch,
    paddingVertical: a(15),
    paddingHorizontal: l(10),
    borderRadius: td(8),
  },
  metaValue: {
    fontSize: td(12.5),
    fontFamily: fonts?.robotoMedium,
    color: Colors.corTextStrong,
  },
});