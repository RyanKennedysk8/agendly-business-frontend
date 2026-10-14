import { useState, useMemo, useCallback} from 'react';
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, TouchableOpacity,Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

import { l, a, td } from '@/constants/responsive';
import { Colors } from '@/colors/color';
import { fonts } from '@/assets/fonts/fonts';
import { SearchHeaderScreens } from '@/components/layout/header';
import { EmptyList } from '@/components/shared/EmptyList';
import { FabCustom } from '@/components/shared/FabCustom';
import { SkeletonList, ClientSkeleton } from '@/components/shared/SkeletonList';

import { useCompanyClients, ClientSummaryDTO } from '@/hooks/useCompanyClients';

const formatPhone = (phone: string) => {
  const p = phone.replace(/\D/g, '');
  if (p.length === 11) return `(${p.substring(0, 2)}) ${p.substring(2, 7)}-${p.substring(7, 11)}`;
  if (p.length === 10) return `(${p.substring(0, 2)}) ${p.substring(2, 6)}-${p.substring(6, 10)}`;
  return phone;
};

export default function ClientesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [searchText, setSearchText] = useState('');

  const { data: clients = [], isLoading } = useCompanyClients();

  const filteredClients = useMemo(() => {
    if (!searchText.trim()) return clients;
    
    const lowerSearch = searchText.toLowerCase().trim();
    const digitsOnlySearch = lowerSearch.replace(/\D/g, '');

    return clients.filter(c => {
      const matchesName = c.name.toLowerCase().includes(lowerSearch);
      const matchesPhone = digitsOnlySearch.length > 0 
        ? c.phone.includes(digitsOnlySearch) 
        : false;

      return matchesName || matchesPhone;
    });
  }, [searchText, clients]);

  const handleNewCustomer = () => {
    router.push('/(main)/(stack)/clientes/novo-cliente' as any);
  };
  
  const handleEditCustomer = (id: string) => {
    router.push({ pathname: '/(main)/(stack)/clientes/novo-cliente', params: { id } } as any);
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    Linking.openURL(`whatsapp://send?phone=55${cleanPhone}`);
  };

  const renderItem = useCallback(({ item }: { item: ClientSummaryDTO }) => {
    return (
      <Pressable
        style={styles.card}
        onPress={() => handleEditCustomer(item.id)}
      >
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.customerName} numberOfLines={1}>
              {item.name}
            </Text>
            {item.hasAppAccount && (
              <Ionicons name="phone-portrait-outline" size={td(14)} color={Colors.corButton} style={styles.appIcon} />
            )}
          </View>
          <Text style={styles.customerPhone}>
            {formatPhone(item.phone)}
          </Text>
        </View>

        <View style={styles.actionGroup}>
          <TouchableOpacity 
            style={styles.boxHandleCLick}
            onPress={() => handleWhatsApp(item.phone)}
          >
            <Ionicons name="logo-whatsapp" size={td(16)} color={Colors.green || '#10B981'} />
          </TouchableOpacity >

          <TouchableOpacity style={styles.boxHandleCLick} onPress={() => handleEditCustomer(item.id)}>
            <Ionicons name="create-outline" size={td(16)} color={Colors.corTextSecondary} />
          </TouchableOpacity >
        </View>
      </Pressable>
    );
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ headerShown: false }} />

      <SearchHeaderScreens
        title="Meus Clientes"
        placeHolder='Buscar por nome ou telefone...'
        onBack={() => router.back()}
        searchValue={searchText}
        onSearchChange={setSearchText}
      />
    
      <View style={styles.listContainer}>
        {isLoading ? (
           <SkeletonList 
             count={8} 
             ItemComponent={ClientSkeleton} 
             contentContainerStyle={styles.listContent} 
             separatorStyle={{ display: 'none' }}
           />
        ) : (
          <FlashList
            data={filteredClients}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + a(100) }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled" 
            keyboardDismissMode='on-drag'
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <EmptyList 
                message="Nenhum cliente encontrado" 
                subMessage={searchText ? 'Tente buscar com outros termos.' : 'Cadastre seu primeiro cliente para começar.'}
              />
            }
          />
        )}
      </View>

      <FabCustom onPress={handleNewCustomer} label='Novo cliente'/>
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
    marginHorizontal: l(20),
    paddingVertical: a(12),
    borderBottomColor: Colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  separator: { height: 0 },
  infoContainer: { flex: 1, justifyContent: 'center', paddingRight: l(12) },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: a(4) },
  customerName: { fontSize: td(16), fontFamily: fonts?.robotoMedium, color: Colors.corText },
  appIcon: { marginLeft: l(6) },
  customerPhone: { fontSize: td(13), fontFamily: fonts?.robotoRegular, color: Colors.corTextSecondary },
  actionGroup: { flexDirection: 'row', gap: l(8) },
  boxHandleCLick: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#F8FAFC',
    width: td(36),
    height: td(36),
    borderRadius: td(8),
    borderWidth: 1,
    borderColor: Colors.border,
  },
});