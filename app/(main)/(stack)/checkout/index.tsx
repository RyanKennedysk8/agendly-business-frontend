import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform, 
  KeyboardAvoidingView, 
  Modal, 
  TextInput, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/colors/color';
import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { useCartStore, CartItem } from '@/store/useCartStore';
import { useProcessCheckout } from '@/hooks/useProcessCheckout';
import { getThemeForAppointment, getStatusLabel } from '@/utils/appointmentUtils';
import { KeyboardDoneAccessory } from '@/components/shared/KeyboardDoneAccessory';

const PAYMENT_METHODS = [
  { id: 'PIX', label: 'PIX', icon: 'qr-code-outline' },
  { id: 'CREDIT_CARD', label: 'Crédito', icon: 'card-outline' },
  { id: 'DEBIT_CARD', label: 'Débito', icon: 'card-outline' },
  { id: 'CASH', label: 'Dinheiro', icon: 'cash-outline' },
];

export default function CheckoutPDVScreen() {
  const router = useRouter();
  const { mutateAsync: processCheckout, isPending } = useProcessCheckout();
  
  const { 
    items, 
    customSaleAmount,
    setCustomSaleAmount,
    getSubtotal, 
    getTotal, 
    discount, 
    tip, 
    paymentMethod,
    removeItem, 
    updateItemQuantity, 
    updateItemPrice, 
    setDiscount, 
    setTip, 
    setPaymentMethod, 
    buildCheckoutPayload,
    clearCart
  } = useCartStore();

  const [isValuesModalVisible, setValuesModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [paymentError, setPaymentError] = useState(false);

  const [customAmountInput, setCustomAmountInput] = useState(
    customSaleAmount > 0 ? customSaleAmount.toFixed(2) : ''
  );

  const [editPriceInput, setEditPriceInput] = useState('');
  const [inputDiscount, setInputDiscount] = useState(discount.toString());
  const [inputTip, setInputTip] = useState(tip.toString());

  // Garante na camada de visualização que APPOINTMENT fique sempre no topo
  const sortedItems = useMemo(() => {
    return [...items].sort((aObj, bObj) => {
      if (aObj.type === 'APPOINTMENT' && bObj.type !== 'APPOINTMENT') return -1;
      if (aObj.type !== 'APPOINTMENT' && bObj.type === 'APPOINTMENT') return 1;
      return 0;
    });
  }, [items]);

  // Define se há algum item ou valor válido(> 0) para exibir Pagamento e Botão de Continuar
  const hasActiveValue = sortedItems.length > 0 || customSaleAmount > 0;

  const handleNavigateToSelector = () => {
    router.push('/(main)/(stack)/checkout/select-item' as any);
  };

  const handleCustomAmountChange = (text: string) => {
    setCustomAmountInput(text);
    const parsed = parseFloat(text.replace(',', '.'));
    const validAmount = !isNaN(parsed) && parsed > 0 ? parsed : 0;
    setCustomSaleAmount(validAmount);
    if (validAmount === 0) {
      setPaymentError(false);
    }
  };

  const handleSelectPaymentMethod = (methodId: string) => {
    setPaymentMethod(methodId);
    if (paymentError) {
      setPaymentError(false);
    }
  };

  const handleOpenEditPrice = (item: CartItem) => {
    setEditingItem(item);
    setEditPriceInput(item.unitPrice.toFixed(2));
  };

  const handleConfirmEditPrice = () => {
    if (!editingItem || !editPriceInput) return;
    const parsed = parseFloat(editPriceInput.replace(',', '.'));
    if (!isNaN(parsed) && parsed >= 0) {
      updateItemPrice(editingItem.localId, parsed);
    }
    setEditingItem(null);
  };

  const handleConfirmValues = () => {
    setDiscount(parseFloat(inputDiscount.replace(',', '.') || '0'));
    setTip(parseFloat(inputTip.replace(',', '.') || '0'));
    setValuesModalVisible(false);
  };

  const handleProcessCheckout = async () => {
    if (!hasActiveValue) return;

    // Se não selecionou método de pagamento, destaca os cards em vermelho e interrompe
    if (!paymentMethod) {
      setPaymentError(true);
      return;
    }

    try {
      const payload = buildCheckoutPayload();
      const appointmentItem = sortedItems.find(i => i.type === 'APPOINTMENT');
      
      const response = await processCheckout(payload);
      clearCart();
      setCustomAmountInput('');
      setPaymentError(false);

      router.replace({
        pathname: '/(main)/(stack)/checkout/checkout-success' as any,
        params: {
          saleId: response?.saleId || '',
          appointmentId: appointmentItem?.referenceId || '',
        }
      } as any);
    } catch (error: any) {
      Alert.alert(
        'Erro no Checkout', 
        `Não foi possível finalizar o caixa.\nDetalhe: ${JSON.stringify(error?.response?.data || error?.message)}`
      );
    }
  };

  const renderCartItemContent = (item: CartItem) => {
    // 1. AGENDAMENTO (Com Data/Hora na esquerda, Badge dinâmico de Status, Duração • Funcionário)
    if (item.type === 'APPOINTMENT') {
      const dateObj = item.startTime ? new Date(item.startTime) : new Date();
      const dayStr = dateObj.toLocaleDateString('pt-BR', { day: '2-digit' });
      const monStr = dateObj
        .toLocaleDateString('pt-BR', { month: 'short' })
        .replace('.', '')
        .replace(/^./, (char) => char.toUpperCase());
      const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const { status, theme } = getThemeForAppointment({
        status: (item.appointmentStatus as any) || 'CONFIRMED',
        startTime: item.startTime || new Date().toISOString(),
        endTime: item.endTime || new Date().toISOString(),
      } as any);

      const durationText = item.durationMinutes ? `${item.durationMinutes} min` : '30 min';
      const employeeText = item.employeeName || 'Profissional';

      return (
        <TouchableOpacity 
          style={styles.cartItemInfo} 
          activeOpacity={0.7}
          onPress={() => handleOpenEditPrice(item)}
        >
          <View style={styles.containerDateHours}>
            <Text style={styles.txtMonStr}>{monStr}</Text>
            <Text style={styles.txtDayStr}>{dayStr}</Text>
            <Text style={styles.txtTimeStr}>{timeStr}</Text>
          </View>

          <View style={{ justifyContent: 'center', flex: 1 }}>
            <View style={styles.badgeRow}>
              <View style={[styles.statusBadge, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                <Text style={[styles.statusBadgeText, { color: theme.text }]}>
                  {getStatusLabel(status)}
                </Text>
              </View>
            </View>

            <Text style={styles.itemDescription} numberOfLines={1}>
              {item.description}
            </Text>
            
            <Text style={styles.tapToEditHint} numberOfLines={1}>
              {durationText} • {employeeText}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    // 2. SERVIÇO (Simples: Nome do Serviço + Duração)
    if (item.type === 'SERVICE' || (item.type === 'CUSTOM' && item.durationMinutes)) {
      return (
        <TouchableOpacity 
          style={styles.cartItemInfoSimple} 
          activeOpacity={0.7}
          onPress={() => handleOpenEditPrice(item)}
        >
          <Text style={styles.itemDescription} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={styles.tapToEditHint}>
            {item.durationMinutes || 30} min
          </Text>
        </TouchableOpacity>
      );
    }

    // 3. PRODUTO (Simples: Apenas Nome do Produto)
    return (
      <TouchableOpacity 
        style={styles.cartItemInfoSimple} 
        activeOpacity={0.7}
        onPress={() => handleOpenEditPrice(item)}
      >
        <Text style={styles.itemDescription} numberOfLines={1}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container} >
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: 'Checkout',
          headerType: 'attendanceSub',
          attendanceParams: {}
        } as any} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {sortedItems.length === 0 ? (
          <>
            {/* QUADRO TRACEJADO CLICÁVEL */}
            <TouchableOpacity 
              style={styles.emptyCartClickable} 
              activeOpacity={0.75} 
              onPress={handleNavigateToSelector}
            >
              <View style={styles.emptyIconCircle}>
                <Ionicons name="add" size={td(28)} color={Colors.corText} />
              </View>
              <Text style={styles.emptyCartTitle}>Toque para adicionar ao caixa</Text>
              <Text style={styles.emptyCartSub}>
                Vincule um agendamento pendente, serviço extra ou produto da loja
              </Text>
            </TouchableOpacity>

            {/* CAMPO DE VALOR AVULSO (SÓ APARECE QUANDO NÃO HÁ ITENS NO CARRINHO) */}
            <View style={styles.quickValueCard}>
              <View style={styles.quickValueHeader}>
                <Text style={styles.quickValueTitle}>Venda Rápida (Sem item vinculado)</Text> 
              </View>
              <View style={styles.quickValueInputWrapper}>
                <>
                <Text style={styles.currencyPrefix}>R$</Text>
                <TextInput
                  style={styles.quickValueInput}
                  placeholder="0,00"
                  placeholderTextColor={Colors.corTextSecondary}
                  keyboardType="decimal-pad"
                  value={customAmountInput}
                  onChangeText={handleCustomAmountChange}
                  inputAccessoryViewID="customAmountAccessory"
                />
                <KeyboardDoneAccessory nativeID="customAmountAccessory" />
                </>
                {customSaleAmount > 0 && (
                  <TouchableOpacity onPress={() => handleCustomAmountChange('')}>
                    <Ionicons name="close" size={td(20)} color={Colors.corTextSecondary}/>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </>
        ) : (
          <>
            {/* LISTA DE CARDS INDIVIDUAIS COM EFEITO 3D / SOMBRA */}
            <View style={styles.cardsListWrapper}>
              {sortedItems.map((item) => (
                <View key={item.localId} style={styles.cartItemCard}>
                  {renderCartItemContent(item)}

                  <View style={styles.cartItemActions}>
                    {/* Quantidade habilitada SOMENTE para PRODUCT */}
                    {item.type === 'PRODUCT' && (
                      <View style={styles.qtyContainer}>
                        <TouchableOpacity 
                          onPress={() => item.quantity > 1 ? updateItemQuantity(item.localId, item.quantity - 1) : removeItem(item.localId)}
                          style={styles.qtyButton}
                        >
                          <Ionicons name="remove" size={td(14)} color={Colors.corText} />
                        </TouchableOpacity>

                        <Text style={styles.qtyText}>{item.quantity}x</Text>

                        <TouchableOpacity 
                          onPress={() => updateItemQuantity(item.localId, item.quantity + 1)}
                          style={styles.qtyButton}
                        >
                          <Ionicons name="add" size={td(14)} color={Colors.corText} />
                        </TouchableOpacity>
                      </View>
                    )}

                    <TouchableOpacity onPress={() => handleOpenEditPrice(item)} activeOpacity={0.7}>
                      <Text style={styles.itemPrice}>
                        R$ {(item.unitPrice * item.quantity).toFixed(2)}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={() => removeItem(item.localId)} 
                      style={styles.btnRemoveItem}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="close" size={td(20)} color={Colors.corTextSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.header}>
              <TouchableOpacity style={styles.btnAddItem} onPress={handleNavigateToSelector}>
                <View style={styles.btnContainerAdd}>
                  <Ionicons name="add-outline" size={td(15)} color={Colors.corTextTitle} />
                </View>
                <Text style={styles.btnAddItemText}>Adicionar Item</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flexDirection:"row", justifyContent:"center", alignItems:"center", gap:l(3), backgroundColor:Colors.white, borderRadius:td(8), padding:td(5)}} onPress={() => {
                setInputDiscount(discount.toString());
                setInputTip(tip.toString());
                setValuesModalVisible(true);
              }}>
                <View style={styles.btnContainerAdd}>
                  <Ionicons name="add-outline" size={td(15)} color={Colors.corTextTitle} />
                </View>
                <Text style={styles.linkEdit}>Desconto / Gorjeta</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {hasActiveValue && (
          <View>
            <View style={styles.paymentTitleRow}>
              <Text style={[styles.sectionTitle, { marginLeft: l(5) }, paymentError && { color: Colors.error }]}>
                Forma de Pagamento
              </Text>
              {paymentError && (
                <Text style={styles.paymentErrorText}>Selecione uma opção para continuar</Text>
              )}
            </View>

            <View style={styles.paymentGrid}>
              {PAYMENT_METHODS.map((method) => {
                const active = paymentMethod === method.id;
                return (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.paymentCard, 
                      active && styles.paymentCardActive,
                      paymentError && !active && styles.paymentCardError
                    ]}
                    onPress={() => handleSelectPaymentMethod(method.id)}
                  >
                    <Ionicons 
                      name={method.icon as any} 
                      size={td(20)} 
                      color={
                        active 
                          ? Colors.corButton 
                          : paymentError 
                            ? Colors.error 
                            : Colors.corTextSecondary
                      } 
                    />
                    <Text 
                      style={[
                        styles.paymentLabel, 
                        active && styles.paymentLabelActive,
                        paymentError && !active && styles.paymentLabelError
                      ]}
                    >
                      {method.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
        {hasActiveValue && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Resumo Financeiro</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>R$ {getSubtotal().toFixed(2)}</Text>
          </View>
          
          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Descontos</Text>
              <Text style={styles.summaryValueDiscount}>- R$ {discount.toFixed(2)}</Text>
            </View>
          )}
          
          {tip > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Gorjeta / Caixinha</Text>
              <Text style={styles.summaryValue}>+ R$ {tip.toFixed(2)}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>TOTAL LÍQUIDO</Text>
            <Text style={styles.totalValue}>R$ {getTotal().toFixed(2)}</Text>
          </View>
        </View>
        )}
      </ScrollView>

      {hasActiveValue && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.btnCheckout, isPending && styles.btnCheckoutDisabled]} 
            onPress={handleProcessCheckout}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Text style={styles.btnCheckoutText}>Finalizar Caixa</Text>
                <Text style={styles.btnCheckoutTotal}>R$ {getTotal().toFixed(2)}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={!!editingItem} transparent animationType="fade">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Alterar Valor Unitário</Text>
              <TouchableOpacity onPress={() => setEditingItem(null)}>
                <Ionicons name="close" size={td(24)} color={Colors.corTextSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>{editingItem?.description}</Text>
            <TextInput 
              style={styles.input} 
              placeholder="0,00" 
              keyboardType="decimal-pad" 
              value={editPriceInput} 
              onChangeText={setEditPriceInput} 
              autoFocus 
            />
            <TouchableOpacity style={styles.btnModalPrimary} onPress={handleConfirmEditPrice}>
              <Text style={styles.btnModalPrimaryText}>Salvar Novo Valor</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={isValuesModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Desconto e Gorjeta</Text>
              <TouchableOpacity onPress={() => setValuesModalVisible(false)}>
                <Ionicons name="close" size={td(24)} color={Colors.corTextSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Desconto Concedido (R$)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="0,00" 
              keyboardType="decimal-pad" 
              value={inputDiscount} 
              onChangeText={setInputDiscount} 
              autoFocus 
            />
            <Text style={styles.inputLabel}>Gorjeta / Caixinha (R$)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="0,00" 
              keyboardType="decimal-pad" 
              value={inputTip} 
              onChangeText={setInputTip} 
              autoFocus 
            />
            <TouchableOpacity style={styles.btnModalPrimary} onPress={handleConfirmValues}>
              <Text style={styles.btnModalPrimaryText}>Aplicar ao Total</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: l(16),
    paddingTop: a(8),
    paddingBottom: a(28),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: a(16),
    paddingHorizontal:l(5)
  },
  sectionTitle: {
    fontSize: td(15),
    fontFamily: fonts.robotoMedium,
    color: Colors.corTextTitle,
  },
  btnAddItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: a(5),
  },
  btnContainerAdd: {
    padding: 5,
    borderRadius: 20,
    borderWidth: 1, 
    borderColor: Colors.borderHairLine, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: l(3),
  },
  btnAddItemText: {
    fontSize: td(12),
    fontFamily: fonts.robotoRegular,
    color: Colors.corText,
    marginLeft: l(4),
  },

  emptyCartClickable: {
    backgroundColor: Colors.white,
    borderRadius: td(14),
    paddingVertical: a(25),
    paddingHorizontal: l(20),
    borderWidth:1,
    borderColor: Colors.borderHairLine,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: a(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyIconCircle: {
    width: td(48),
    height: td(48),
    borderRadius: td(24),
    backgroundColor: Colors.corContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: a(10),
  },
  emptyCartTitle: {
    fontSize: td(15),
    fontFamily: fonts.robotoBold,
    color: Colors.corTextTitle,
    marginBottom: a(4),
  },
  emptyCartSub: {
    fontSize: td(12),
    fontFamily: fonts.robotoRegular,
    color: Colors.corTextSecondary,
    textAlign: 'center',
  },
  quickValueCard: {
    backgroundColor: Colors.white,
    borderRadius: td(12),
    paddingHorizontal: l(16),
    paddingVertical: a(14),
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: a(22),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  quickValueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: a(8),
  },
  quickValueTitle: {
    fontSize: td(13),
    fontFamily: fonts.robotoMedium,
    color: Colors.corTextSecondary,
  },
  clearQuickValueText: {
    fontSize: td(12),
    fontFamily: fonts.robotoMedium,
    color: Colors.error,
  },
  quickValueInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderHairLine,
    paddingBottom: a(4),
  },
  currencyPrefix: {
    fontSize: td(20),
    fontFamily: fonts.robotoBold,
    color: Colors.corTextSecondary,
    marginRight: l(6),
  },
  quickValueInput: {
    flex: 1,
    fontSize: td(22),
    fontFamily: fonts.robotoBold,
    color: Colors.corText,
  },
  cardsListWrapper: {
    marginBottom: a(6),
  },
  cartItemCard: {
    backgroundColor: Colors.white,
    borderRadius: td(12),
    paddingHorizontal: l(14),
    paddingVertical: a(14),
    marginBottom: a(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cartItemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: l(8),
  },
  cartItemInfoSimple: {
    flex: 1,
    justifyContent: 'center',
    marginRight: l(8),
  },
  containerDateHours: {
    paddingRight: l(14),
    marginRight: l(12),
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  txtMonStr: {
    fontSize: td(10), 
    color: Colors.corTextSecondary, 
    fontFamily: fonts.robotoRegular,
  },
  txtDayStr: {
    fontSize: td(16), 
    marginVertical: a(2), 
    color: Colors.corText, 
    fontFamily: fonts.robotoBold,
  },
  txtTimeStr: {
    fontSize: td(10), 
    color: Colors.corTextSecondary, 
    fontFamily: fonts.robotoRegular,
  },
  itemDescription: {
    fontSize: td(14),
    fontFamily: fonts.robotoMedium,
    color: Colors.corText,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: a(3),
  },
  statusBadge: {
    paddingHorizontal: l(6),
    paddingVertical: a(2),
    borderRadius: td(4),
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: td(9),
    fontFamily: fonts.robotoBold,
  },
  tapToEditHint: {
    fontSize: td(11),
    fontFamily: fonts.robotoRegular,
    color: Colors.corTextSecondary,
    marginTop: a(2),
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: l(8),
    gap: l(4),
  },
  qtyButton: {
    padding: l(4),
    backgroundColor: '#F1F5F9',
    borderRadius: td(6),
  },
  qtyText: {
    fontFamily: fonts.robotoBold,
    fontSize: td(12),
    color: Colors.corText,
    minWidth: l(16),
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: td(14),
    fontFamily: fonts.robotoBold,
    color: Colors.corText,
  },
  btnRemoveItem: {
    marginLeft: l(10),
  },
  paymentTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: a(10),
  },
  paymentErrorText: {
    fontSize: td(11),
    fontFamily: fonts.robotoMedium,
    color: Colors.error,
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: l(8),
    marginBottom: a(24),
  },
  paymentCard: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: td(10),
    paddingVertical: a(12),
    alignItems: 'center',
    gap: a(6),
  },
  paymentCardActive: {
    borderColor: Colors.corButton,
    backgroundColor: Colors.corButtonOff,
  },
  paymentCardError: {
    borderColor: Colors.error,
    backgroundColor: '#FFF1F2',
  },
  paymentLabel: {
    fontSize: td(12),
    fontFamily: fonts.robotoMedium,
    color: Colors.corTextSecondary,
  },
  paymentLabelActive: {
    color: Colors.corButton,
    fontFamily: fonts.robotoMedium,
  },
  paymentLabelError: {
    color: Colors.error,
    fontFamily: fonts.robotoMedium,
  },
  summaryContainer: {
    backgroundColor: Colors.white,
    borderRadius: td(12),
    padding: l(16),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: a(16),
  },
  summaryTitle: {
    fontSize: td(14),
    fontFamily: fonts.robotoBold,
    color: Colors.corTextTitle,
  },
  linkEdit: {
    fontSize: td(12),
    fontFamily: fonts.robotoRegular,
    color: Colors.corText,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: a(12),
  },
  summaryLabel: {
    fontSize: td(14),
    fontFamily: fonts.robotoRegular,
    color: Colors.corTextSecondary,
  },
  summaryValue: {
    fontSize: td(14),
    fontFamily: fonts.robotoMedium,
    color: Colors.corText,
  },
  summaryValueDiscount: {
    fontSize: td(14),
    fontFamily: fonts.robotoMedium,
    color: Colors.error,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: a(8),
  },
  totalLabel: {
    fontSize: td(16),
    fontFamily: fonts.robotoMedium,
    color: Colors.corTextTitle,
  },
  totalValue: {
    fontSize: td(18),
    fontFamily: fonts.robotoMedium,
    color: Colors.corButton,
  },
  footer: {
    backgroundColor: Colors.white,
    paddingHorizontal: l(16),
    paddingTop: a(10),
    paddingBottom: a(32),
  },
  btnCheckout: {
    backgroundColor: Colors.corButton,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: a(50),
    borderRadius: td(12),
    paddingHorizontal: l(20),
    gap: l(5),
  },
  btnCheckoutDisabled: {
    opacity: 0.5,
  },
  btnCheckoutText: {
    fontSize: td(14),
    fontFamily: fonts.robotoBold,
    color: Colors.white,
  },
  btnCheckoutTotal: {
    fontSize: td(14),
    fontFamily: fonts.robotoBold,
    color: Colors.white,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.semiTransparente,
    justifyContent: 'center',
    padding: l(20),
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: td(16),
    padding: l(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: a(20),
  },
  modalTitle: {
    fontSize: td(18),
    fontFamily: fonts.robotoBold,
    color: Colors.corTextTitle,
  },
  inputLabel: {
    fontSize: td(13),
    fontFamily: fonts.robotoMedium,
    color: Colors.corTextSecondary,
    marginBottom: a(8),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: td(8),
    paddingHorizontal: l(12),
    height: a(48),
    fontSize: td(14),
    fontFamily: fonts.robotoRegular,
    color: Colors.corText,
    marginBottom: a(16),
  },
  btnModalPrimary: {
    backgroundColor: Colors.corButton,
    height: a(48),
    borderRadius: td(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: a(8),
  },
  btnModalPrimaryText: {
    color: Colors.white,
    fontFamily: fonts.robotoBold,
    fontSize: td(14),
  }
});