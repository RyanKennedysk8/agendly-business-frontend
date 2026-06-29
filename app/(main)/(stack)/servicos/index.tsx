// app/(main)/(stack)/servicos/index.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { SearchHeaderScreens } from '@/components/layout/header';
import { Colors } from '@/colors/color';
import { useCompanyServices } from '@/hooks/useCompanyServices';
import { ServiceResponseDTO } from '@/types/company';

export default function ServicosScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  //  Consumindo a API
  const { data: services = [], isLoading, isError, refetch, isRefetching } = useCompanyServices();

  // O Motor de Busca operando em cima dos dados cacheados do React Query
  const filteredServices = useMemo(() => {
    if (!searchText.trim()) return services;
    
    const lowerSearch = searchText.toLowerCase().trim();
    return services.filter(s => 
      s.name.toLowerCase().includes(lowerSearch) || 
      (s.categoryName && s.categoryName.toLowerCase().includes(lowerSearch))
    );
  }, [searchText, services]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const handleNewService = () => {
    router.push('/(main)/(stack)/servicos/novo-servico' as any);
  };

  const handleEditService = (id: string) => {
    // Agora apontamos para o formulário que acabamos de criar, passando o ID do serviço
    router.push({
      pathname: '/(main)/(stack)/servicos/novo-servico',
      params: { id }
    } as any);
  };
 
  const renderItem = useCallback(({ item }: { item: ServiceResponseDTO }) => {
    return (
      <Pressable 
        style={styles.card}
        onPress={() => handleEditService(item.id)}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.serviceName} numberOfLines={1}>{item.name}</Text>
          
          <View style={styles.metaRow}>
            <Text style={styles.categoryText}>{formatDuration(item.durationInMinutes)}</Text>
            <Text style={styles.separator}>-</Text>
            <Text style={styles.categoryText}>{formatCurrency(item.price)}</Text>
          </View>
        </View>

        <View style={{flexDirection:"row", gap:l(5)}}>
          <TouchableOpacity style={styles.boxHandleCLick}>
            <Ionicons
              name="create-outline"
              size={td(16)}
              color={Colors.corTextSecondary}
            />
          </TouchableOpacity >
        
          <TouchableOpacity  style={styles.boxHandleCLick}>
            <Ionicons
              name="trash-outline"
              size={td(16)}
              color={Colors.corTextSecondary}
            />
          </TouchableOpacity >
        </View>

        
      </Pressable>
    );
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF7A00" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ headerShown: false }} />
      
      <SearchHeaderScreens
        title="Meus Serviços"
        placeHolder='Buscar por serviço, categoria...'
        onBack={() => router.back()}
        filtered={filteredServices.length} 
        searchValue={searchText}
        onSearchChange={setSearchText}
      />

      <View style={styles.listContainer}>
        {isError ? (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>Erro ao carregar serviços</Text>
            </View>
        ) : (
            <FlashList
                data={filteredServices}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                extraData={searchText}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                refreshing={isRefetching}
                onRefresh={refetch}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                    <Ionicons name="cut-outline" size={td(48)} color="#E2E8F0" />
                    <Text style={styles.emptyTitle}>Nenhum serviço encontrado</Text>
                    <Text style={styles.emptySubtitle}>
                        {searchText ? 'Revise os termos da sua busca.' : 'Adicione os serviços que sua loja oferece para começar a agendar.'}
                    </Text>
                    </View>
                }
            />
        )}
      </View>

      <Pressable style={styles.fab} onPress={handleNewService}>
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
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  listContent: {
    paddingBottom: a(90),
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
  },

  infoContainer: {
    flex: 1,
    paddingRight: l(14),
  },

  boxHandleCLick: {
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:Colors.corButtonSearch,
    paddingVertical:a(20),
    paddingHorizontal:l(10),
    borderRadius:td(8),
  },

  serviceName: {
    fontSize: td(16),
    fontFamily: fonts?.robotoMedium,
    color:Colors.corText,
    marginBottom: a(5),
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: l(4),
  },

  categoryBadge: {
    backgroundColor:Colors.corContainer,
    paddingHorizontal: l(8),
    paddingVertical: a(3),
    borderRadius: td(5),
  },

  categoryText: {
    fontSize: td(12),
    fontFamily: fonts?.robotoRegular,
    color: Colors.corText,
  },

  dotSeparator: {
    width: td(4),
    height: td(4),
    borderRadius: td(2),
    backgroundColor: '#CBD5E1',
  },

  durationText: {
    fontSize: td(12.5),
    fontFamily: fonts?.robotoRegular || 'System',
    color: '#64748B',
    marginLeft: l(4),
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: l(10),
  },

  priceText: {
    fontSize: td(12),
    fontFamily: fonts?.robotoRegular,
    color: Colors.corText,
  },

  chevronWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: a(80),
    paddingHorizontal: l(40),
  },

  emptyTitle: {
    marginTop: a(14),
    fontSize: td(16),
    fontFamily: fonts?.robotoMedium || 'System',
    color: '#0F172A',
  },

  emptySubtitle: {
    marginTop: a(8),
    fontSize: td(13),
    fontFamily: fonts?.robotoRegular || 'System',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: td(20),
  },

  fab: {
    position: 'absolute',
    bottom: a(24),
    right: l(20),

    width: td(54),
    height: td(54),
    borderRadius: td(27),

    backgroundColor: Colors.corScreen,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,

    elevation: 4,
  },
});