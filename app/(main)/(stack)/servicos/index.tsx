// app/(main)/(stack)/servicos/index.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { MOCK_SERVICES, ServiceDTO } from '@/mocks/services';
import { SearchHeaderScreens } from '@/components/layout/header';
import { Colors } from '@/colors/color';

export default function ServicosScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  // 1. Motor de Busca (Filtra por Nome do Serviço ou Categoria)
  const filteredServices = useMemo(() => {
    if (!searchText.trim()) return MOCK_SERVICES;
    
    const lowerSearch = searchText.toLowerCase().trim();
    return MOCK_SERVICES.filter(s => 
      s.name.toLowerCase().includes(lowerSearch) || 
      s.categoryName.toLowerCase().includes(lowerSearch)
    );
  }, [searchText]);

  // 2. Formatadores
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // 3. Ações
  const handleNewService = () => {
    router.push('/(main)/(stack)/novo-servico' as any);
  };

  const handleEditService = (id: string) => {
    console.log('Editar serviço:', id);
    // router.push({ pathname: '/(main)/(stack)/editar-servico', params: { id } });
  };

  // 4. Render do Card (Otimizado com useCallback)
  const renderItem = useCallback(({ item }: { item: ServiceDTO }) => {
    return (
      <Pressable 
        style={styles.card}
        onPress={() => handleEditService(item.id)}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.serviceName} numberOfLines={1}>{item.name}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.categoryName}</Text>
            </View>
            <View style={styles.dotSeparator} />
            <Ionicons name="time-outline" size={td(14)} color="#64748B" />
            <Text style={styles.durationText}>{formatDuration(item.durationInMinutes)}</Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{formatCurrency(item.price)}</Text>
          <Ionicons name="chevron-forward" size={td(18)} color="#CBD5E1" />
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
      options={{ headerShown: false }} />
      
      <SearchHeaderScreens
        title="Meus Serviços"
        onBack={() => router.back()}
        filtered={filteredServices.length} 
        searchValue={searchText}
        onSearchChange={setSearchText}
      />

      <View style={styles.listContainer}>
        <FlashList
          data={filteredServices}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={searchText}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    backgroundColor: Colors.corContainer
  },
  listContainer: { 
    flex: 1, 
    backgroundColor: Colors.corContainer
  }, 
  listContent: { 
  },
  card: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: l(15),
    paddingVertical: a(10),
    marginBottom:a(10),
    marginHorizontal:l(10),
    borderRadius:td(12)
  },
  separator: { 
    height: 1, 
    backgroundColor: '#F1F5F9', 
    marginLeft: l(20) 
  },
  infoContainer: { 
    flex: 1, 
    paddingRight: l(16) 
  },
  serviceName: { 
    fontSize: td(16), 
    fontFamily: fonts?.robotoBold || 'System', 
    color: '#1E293B', 
    marginBottom: a(6) 
  },
  metaRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: l(8),
    paddingVertical: a(2),
    borderRadius: td(6),
  },
  categoryText: { 
    fontSize: td(12), 
    fontFamily: fonts?.robotoMedium || 'System', 
    color: '#475569' 
  },
  dotSeparator: { 
    width: td(4), 
    height: td(4), 
    borderRadius: td(2), 
    backgroundColor: '#CBD5E1', 
    marginHorizontal: l(8) 
  },
  durationText: { 
    fontSize: td(13), 
    fontFamily: fonts?.robotoMedium || 'System', 
    color: '#64748B', 
    marginLeft: l(4) 
  },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: l(8) },
  priceText: { 
    fontSize: td(16), 
    fontFamily: fonts?.robotoBold || 'System', 
    color: '#10B981' 
  },
  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingTop: a(80), 
    paddingHorizontal: l(40) 
  },
  emptyTitle: { 
    marginTop: a(16), 
    fontSize: td(16), 
    fontFamily: fonts?.robotoBold || 'System', 
    color: '#1E293B' 
  },
  emptySubtitle: {
    marginTop: a(8), 
    fontSize: td(14), 
    fontFamily: fonts?.robotoRegular || 'System', 
    color: '#64748B', 
    textAlign: 'center', 
    lineHeight: td(20) 
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
    elevation: 5 
  },
});