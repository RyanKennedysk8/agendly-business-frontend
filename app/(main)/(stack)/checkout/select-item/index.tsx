import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/colors/color';
import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { useAttendanceHistory } from '@/hooks/useAttendanceHistory';
import { useMyCompany } from '@/hooks/useMyCompany';
import { useCompanyProducts } from '@/hooks/useCompanyProducts';
import { useCartStore } from '@/store/useCartStore';
import { getDisplayStatus } from '@/utils/appointmentUtils';
import { EmptyList } from '@/components/shared/EmptyList';
import { formatDuration } from '@/utils/formatDuration';

type StepMode = 'MENU' | 'APPOINTMENTS' | 'SERVICES' | 'PRODUCTS';

export default function SelectCheckoutItemScreen() {
  const router = useRouter();
  const [step, setStep] = useState<StepMode>('MENU');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: company } = useMyCompany();
  const { data: appointments = [], isLoading: loadingAppts } = useAttendanceHistory();
  const activeCompanyId = useCartStore(state => state.companyId) || company?.id || appointments[0]?.companyId;
  const { data: products = [], isLoading: loadingProducts } = useCompanyProducts(activeCompanyId);

  const { addItem, setContext, items: cartItems } = useCartStore();

  // Filtra Agendamentos Pendentes (que ainda não estão no carrinho)
  const pendingAppointments = useMemo(() => {
    return appointments
      .filter(appt => {
        const status = getDisplayStatus(appt);
        const alreadyInCart = cartItems.some(i => i.type === 'APPOINTMENT' && i.referenceId === appt.appointmentId);
        const matchesQuery =
        (appt.clientName ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        appt.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
        return (status === 'AWAITING_COMPLETION' || status === 'IN_PROGRESS') && !alreadyInCart && matchesQuery;
      })
      .sort((aObj, bObj) => new Date(bObj.startTime).getTime() - new Date(aObj.startTime).getTime());
  }, [appointments, cartItems, searchQuery]);

  // Filtra Serviços do Catálogo da Loja
  const catalogServices = useMemo(() => {
    const raw = company?.services || [];
    return raw.filter((s: any) => s.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [company, searchQuery]);

  // Filtra Produtos da Loja
  const catalogProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  const handleSelectAppointment = (appt: any) => {
    const durationMin = Math.max(15, Math.round((new Date(appt.endTime).getTime() - new Date(appt.startTime).getTime()) / 60000));
    setContext(appt.companyId || activeCompanyId, appt.clientId, appt.employeeId);
    addItem({
      type: 'APPOINTMENT',
      referenceId: appt.appointmentId,
      description: appt.serviceName,
      quantity: 1,
      unitPrice: Number(appt.priceAtBooking ?? 0),
      startTime: appt.startTime,
      endTime: appt.endTime,
      durationMinutes: durationMin,
      employeeName: appt.employeeName || 'Profissional',
      appointmentStatus: appt.status,
    });
    router.back();
  };

  const handleSelectService = (service: any) => {
    addItem({
      type: 'SERVICE',
      referenceId: service.id,
      description: service.name,
      quantity: 1,
      unitPrice: Number(service.price ?? 0),
      durationMinutes: service.durationMinutes || 30, 
    });
    router.back();
  };

  const handleSelectProduct = (product: any) => {
    addItem({
      type: 'PRODUCT',
      referenceId: product.id,
      description: product.name,
      quantity: 1,
      unitPrice: Number(product.price ?? 0),
    });
    router.back();
  };

  const getHeaderTitle = () => {
    if (step === 'APPOINTMENTS') return 'Selecionar Agendamento';
    if (step === 'SERVICES') return 'Selecionar Serviço';
    if (step === 'PRODUCTS') return 'Selecionar Produto';
    return 'O que deseja adicionar?';
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: getHeaderTitle(),
          headerType: 'attendanceSub',
          attendanceParams: {
            subtitle: step === 'MENU' ? 'Selecione o tipo de lançamento' : 'Toque no item para adicionar',
            onCustomBack: step !== 'MENU' 
              ? () => { setStep('MENU'); setSearchQuery(''); } 
              : undefined,
          }
        } as any} 
      />


{step === 'MENU' && (
  <View style={styles.menuContainer}>
    <TouchableOpacity
      style={styles.optionCard}
      activeOpacity={0.8}
      onPress={() => setStep('APPOINTMENTS')}
    >
      <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
        <Ionicons name="calendar-outline" size={td(24)} color="#3B82F6" />
      </View>

      <View style={styles.optionInfo}>
        <Text style={styles.optionTitle}>Agendamento Pendente</Text>
        <Text style={styles.optionDesc}>
          Registrar o pagamento de um atendimento da agenda
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={td(20)} color={Colors.corTextSecondary} />
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.optionCard}
      activeOpacity={0.8}
      onPress={() => setStep('SERVICES')}
    >
      <View style={[styles.iconBox, { backgroundColor: '#FFF1E6' }]}>
        <Ionicons name="briefcase-outline" size={td(24)} color="#FF7A00" />
      </View>

      <View style={styles.optionInfo}>
        <Text style={styles.optionTitle}>Serviço Avulso</Text>
        <Text style={styles.optionDesc}>
          Adicionar um serviço sem agendamento
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={td(20)} color={Colors.corTextSecondary} />
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.optionCard}
      activeOpacity={0.8}
      onPress={() => setStep('PRODUCTS')}
    >
      <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
        <Ionicons name="cube-outline" size={td(24)} color="#16A34A" />
      </View>

      <View style={styles.optionInfo}>
        <Text style={styles.optionTitle}>Produto da Loja</Text>
        <Text style={styles.optionDesc}>
          Adicionar produtos ao checkout
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={td(20)} color={Colors.corTextSecondary} />
    </TouchableOpacity>
  </View>
)}


      {step !== 'MENU' && (
        <View style={styles.listWrapper}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search-outline" size={td(18)} color={Colors.corTextSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={Colors.placeholder}
              />
            </View>
          </View>

          {step === 'APPOINTMENTS' && (
            loadingAppts ? (
              <ActivityIndicator size="large" color={Colors.corButton} style={{ marginTop: a(40) }} />
            ) : (
              <FlashList
                data={pendingAppointments}
                keyExtractor={(item) => item.appointmentId}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                  const dayStr = new Date(item.startTime).toLocaleDateString('pt-BR', { day: '2-digit' });
                  const monStr = new Date(item.startTime).toLocaleDateString('pt-BR', { month: 'short' })
                  .replace('.', '').replace(/^./, (char) => char.toUpperCase());
                  const timeStr = new Date(item.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <TouchableOpacity style={styles.listItemCard} onPress={() => handleSelectAppointment(item)}>
                      <View style={styles.containerDateHours}>
                        <Text style={styles.txtMonStr}>{monStr}</Text>
                        <Text style={styles.txtDayStr}>{dayStr}</Text>
                        <Text style={styles.txtTimeStr}>{timeStr}</Text>
                      </View>
                      <View style={styles.verticalBar}/> 
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemMainTitle}>{item.clientName}</Text>
                        <Text style={styles.itemSubTitle}>{item.serviceName}</Text>
                        <Text style={styles.itemEmployee}>{formatDuration(item.serviceDuration)} • {item.employeeName || ''}</Text>
                      </View>
                      <View style={styles.priceTag}>
                        <Text style={styles.priceTagText}>R$ {Number(item.priceAtBooking ?? 0).toFixed(2)}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={
                  <EmptyList message="Nenhum agendamento pendente" subMessage="Todos os agendamentos já foram finalizados ou estão no carrinho." />
                }
              />
            ))}

          {step === 'SERVICES' && (
            <FlashList
              data={catalogServices}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.listItemCard} onPress={() => handleSelectService(item)}>
                  <View style={styles.verticalBar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemMainTitle}>{item.name}</Text>
                    <Text style={styles.itemSubTitle}>Duração: {formatDuration(item.durationInMinutes)} </Text>
                  </View>
                  <View style={styles.priceTag}>
                    <Text style={styles.priceTagText}>R$ {Number(item.price ?? 0).toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <EmptyList message="Nenhum serviço encontrado" subMessage="Não há serviços correspondentes à sua busca." />
              }
            />
          )}

          {step === 'PRODUCTS' && (
            loadingProducts ? (
              <ActivityIndicator size="large" color="#FF7A00" style={{ marginTop: a(40) }} />
            ) : (
              <FlashList
                data={catalogProducts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.listItemCard} onPress={() => handleSelectProduct(item)}>
                    <View style={styles.verticalBar} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemMainTitle}>{item.name}</Text>
                      <Text style={styles.itemSubTitle}>Produto de catálogo</Text>
                    </View>
                    <View style={styles.priceTag}>
                      <Text style={styles.priceTagText}>R$ {Number(item.price ?? 0).toFixed(2)}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <EmptyList message="Nenhum produto cadastrado" subMessage="Cadastre seus produtos na tela de Gestão de Produtos." />
                }
              />
            )
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  menuContainer: {
    paddingVertical:a(10),
    paddingHorizontal: l(15),
    gap: a(12),
  },
  menuSubtitle: {
    fontSize: td(13),
    fontFamily: fonts.robotoRegular,
    color: Colors.corTextLight,
    marginBottom: a(8),
    marginHorizontal:l(10)
  },
  
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: l(16),
    borderRadius: td(14),
    borderWidth: 1,
    borderColor: Colors.borderHairLine,
    gap: l(14),
  },
  iconBox: {
    width: td(48),
    height: td(48),
    borderRadius: td(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: td(16),
    fontFamily: fonts.robotoBold,
    color: Colors.corTextTitle,
    marginBottom: a(2),
  },
  optionDesc: {
    fontSize: td(12),
    fontFamily: fonts.robotoRegular,
    color: Colors.corTextSecondary,
  },
  
  listWrapper: {
    flex: 1,
  },
  searchHeader: {
    backgroundColor: Colors.white,
    paddingHorizontal: l(16),
    paddingVertical: a(10),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: td(10),
    paddingHorizontal: l(12),
    height: a(42),
  },
  searchInput: {
    flex: 1,
    marginLeft: l(8),
    fontSize: td(14),
    fontFamily: fonts.robotoRegular,
    color: Colors.corText,
  },
  
  listContent: {

    paddingBottom: a(60),
  },
  listItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingVertical: l(15),
    paddingHorizontal:l(20),
    borderRadius: td(12),
    borderBottomWidth: 1,
    borderColor: Colors.borderHairLine,

  },
  containerDateHours:{
    paddingRight:l(15), 
    justifyContent:"center", 
    alignItems:"center"
  },
  txtMonStr:{
    fontSize:td(11), 
    color:Colors.corTextSecondary, 
    fontFamily: fonts.robotoRegular
  },
  txtDayStr:{
    fontSize:td(16), 
    marginVertical:a(1), 
    color:Colors.corText, 
    fontFamily: fonts.robotoRegular
  },
  txtTimeStr:{
    fontSize:td(11), 
    color:Colors.corTextSecondary, 
    fontFamily: fonts.robotoRegular
  },
  itemMainTitle: {
    fontSize: td(14),
    fontFamily: fonts.robotoMedium,
    color: Colors.corText,
  },
  itemSubTitle: {
    fontSize: td(12),
    fontFamily: fonts.robotoRegular,
    color: Colors.corTextSecondary,
    marginTop: a(2),
  },
  itemEmployee: {
    fontSize: td(10),
    fontFamily: fonts.robotoRegular,
    color: Colors.corTextSecondary,
    marginTop: a(2),
  },
  priceTag: {
    paddingVertical: a(6),
    flexDirection:"row",
    justifyContent:"flex-end",
    alignItems:"center"
 
  },
  priceTagText: {
    fontSize: td(13),
    fontFamily: fonts.robotoMedium,
    color: Colors.corText,
  },
  verticalBar: {
    width: l(2),
    height: "90%",
    backgroundColor: Colors.corButton, 
    borderRadius: td(8),
    marginRight: l(12),
  },

  searchContainer: {
    paddingHorizontal: l(15),
    justifyContent: 'flex-end',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: a(40),
    backgroundColor: '#FFFFFF',
    borderColor:Colors.borderHairLine,
    borderWidth:1,
    borderRadius: td(12),
    paddingHorizontal: l(12),
  },

})