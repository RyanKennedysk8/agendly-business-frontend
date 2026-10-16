import React, { useState } from 'react';
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

  // Modais de Edição de Preço e Desconto/Gorjeta
  const [isValuesModalVisible, setValuesModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  const [editPriceInput, setEditPriceInput] = useState('');
  const [inputDiscount, setInputDiscount] = useState(discount.toString());
  const [inputTip, setInputTip] = useState(tip.toString());

  const handleNavigateToSelector = () => {
    router.push('/(main)/(stack)/checkout/select-item'as any);
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
    if (items.length === 0) {
      Alert.alert('Carrinho Vazio', 'Toque no quadro de itens para adicionar um agendamento, serviço ou produto.');
      return;
    }
    if (!paymentMethod) {
      Alert.alert('Forma de Pagamento', 'Selecione a forma de pagamento antes de confirmar.');
      return;
    }

    try {
      const payload = buildCheckoutPayload();
      // Guarda referência caso exista um agendamento no carrinho para fallback do recibo
      const appointmentItem = items.find(i => i.type === 'APPOINTMENT');
      
      const response = await processCheckout(payload);
      clearCart();

      router.replace({
        pathname: '/(main)/(stack)/checkout/checkout-success'as any,
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

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: 'PDV / Checkout',
          headerType: 'attendanceSub',
          attendanceParams: {
            subtitle: items.length > 0 ? `${items.length} item(ns) no caixa` : 'Caixa aberto',
            rightIcon: items.length > 0 ? 'trash-outline' : undefined,
            rightText: items.length > 0 ? 'Limpar' : undefined,
            rightColor: Colors.error,
            onRightPress: items.length > 0 ? () => clearCart() : undefined,
          }
        } as any} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* CABEÇALHO DO CARRINHO */}
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Itens da Venda</Text>
          <TouchableOpacity style={styles.btnAddItem} onPress={handleNavigateToSelector}>
            <Ionicons name="add-circle-outline" size={td(18)} color={Colors.corButton} />
            <Text style={styles.btnAddItemText}>Adicionar Item</Text>
          </TouchableOpacity>
        </View>

        {/* CONTAINER DO CARRINHO (CLICÁVEL QUANDO VAZIO) */}
        {items.length === 0 ? (
          <TouchableOpacity 
            style={styles.emptyCartClickable} 
            activeOpacity={0.75} 
            onPress={handleNavigateToSelector}
          >
            <View style={styles.emptyIconCircle}>
              <Ionicons name="add" size={td(28)} color={Colors.corButton} />
            </View>
            <Text style={styles.emptyCartTitle}>Toque para adicionar ao caixa</Text>
            <Text style={styles.emptyCartSub}>
              Vincule um agendamento pendente, serviço extra ou produto da loja
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.cartContainer}>
            {items.map((item, idx) => (
              <View 
                key={item.localId} 
                style={[styles.cartItem, idx === items.length - 1 && { borderBottomWidth: 0 }]}
              >
                {/* Clicar nas informações do item abre a edição de valor */}
                <TouchableOpacity 
                  style={styles.cartItemInfo} 
                  activeOpacity={0.7}
                  onPress={() => handleOpenEditPrice(item)}
                >
                  <Text style={styles.itemDescription} numberOfLines={1}>{item.description}</Text>
                  <View style={styles.badgeRow}>
                    <Text style={
                      item.type === 'APPOINTMENT' 
                        ? styles.itemBadgeAppointment 
                        : item.type === 'PRODUCT' 
                          ? styles.itemBadgeProduct 
                          : styles.itemBadgeCustom
                    }>
                      {item.type === 'APPOINTMENT' ? 'Agendamento' : item.type === 'PRODUCT' ? 'Produto' : 'Serviço Extra'}
                    </Text>
                    <Text style={styles.tapToEditHint}>Editar R$ {item.unitPrice.toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>
                
                {/* Controles de Quantidade e Botão de Remover (Para TODOS os tipos, incluindo Agendamento) */}
                <View style={styles.cartItemActions}>
                  {item.type !== 'APPOINTMENT' && (
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

                  <Text style={styles.itemPrice}>
                    R$ {(item.unitPrice * item.quantity).toFixed(2)}
                  </Text>

                  <TouchableOpacity 
                    onPress={() => removeItem(item.localId)} 
                    style={styles.btnRemoveItem}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={td(18)} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* SELETOR DE FORMA DE PAGAMENTO */}
        <Text style={[styles.sectionTitle, { marginBottom: a(12) }]}>Forma de Pagamento</Text>
        <View style={styles.paymentGrid}>
          {PAYMENT_METHODS.map((method) => {
            const active = paymentMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={[styles.paymentCard, active && styles.paymentCardActive]}
                onPress={() => setPaymentMethod(method.id)}
              >
                <Ionicons name={method.icon as any} size={td(20)} color={active ? '#FF7A00' : Colors.corTextSecondary} />
                <Text style={[styles.paymentLabel, active && styles.paymentLabelActive]}>{method.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* RESUMO FINANCEIRO */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Resumo Financeiro</Text>
            <TouchableOpacity onPress={() => {
              setInputDiscount(discount.toString());
              setInputTip(tip.toString());
              setValuesModalVisible(true);
            }}>
              <Text style={styles.linkEdit}>Desconto / Gorjeta</Text>
            </TouchableOpacity>
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

      </ScrollView>

      {/* RODAPÉ FIXO */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.btnCheckout, (isPending || items.length === 0) && styles.btnCheckoutDisabled]} 
          onPress={handleProcessCheckout}
          disabled={isPending || items.length === 0}
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

      {/* MODAL: EDITAR PREÇO UNITÁRIO DO ITEM */}
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

      {/* MODAL: DESCONTOS E GORJETAS */}
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
            <TextInput style={styles.input} placeholder="0,00" keyboardType="decimal-pad" value={inputDiscount} onChangeText={setInputDiscount} />
            <Text style={styles.inputLabel}>Gorjeta / Caixinha (R$)</Text>
            <TextInput style={styles.input} placeholder="0,00" keyboardType="decimal-pad" value={inputTip} onChangeText={setInputTip} />
            <TouchableOpacity style={styles.btnModalPrimary} onPress={handleConfirmValues}>
              <Text style={styles.btnModalPrimaryText}>Aplicar ao Total</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: l(16), paddingBottom: a(40) },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: a(16) },
  sectionTitle: { fontSize: td(16), fontFamily: fonts.robotoBold, color: Colors.corTextTitle },
  btnAddItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF1E6', paddingHorizontal: l(12), paddingVertical: a(6), borderRadius: td(20), borderWidth: 1, borderColor: '#FFD6B3' },
  btnAddItemText: { fontSize: td(12), fontFamily: fonts.robotoBold, color: '#FF7A00', marginLeft: l(4) },
  
  emptyCartClickable: {
    backgroundColor: Colors.white,
    borderRadius: td(14),
    paddingVertical: a(28),
    paddingHorizontal: l(20),
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: a(24),
  },
  emptyIconCircle: {
    width: td(48),
    height: td(48),
    borderRadius: td(24),
    backgroundColor: '#FFF1E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: a(10),
  },
  emptyCartTitle: { fontSize: td(15), fontFamily: fonts.robotoBold, color: Colors.corTextTitle, marginBottom: a(4) },
  emptyCartSub: { fontSize: td(12), fontFamily: fonts.robotoRegular, color: Colors.corTextSecondary, textAlign: 'center' },

  cartContainer: { backgroundColor: Colors.white, borderRadius: td(12), paddingHorizontal: l(16), paddingVertical: a(6), borderWidth: 1, borderColor: Colors.border, marginBottom: a(24) },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: a(12), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  cartItemInfo: { flex: 1, marginRight: l(8) },
  itemDescription: { fontSize: td(15), fontFamily: fonts.robotoMedium, color: Colors.corText },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: l(8), marginTop: a(4) },
  
  itemBadgeAppointment: { fontSize: td(10), fontFamily: fonts.robotoMedium, color: '#3B82F6', backgroundColor: '#EFF6FF', paddingHorizontal: l(6), paddingVertical: a(2), borderRadius: td(4) },
  itemBadgeProduct: { fontSize: td(10), fontFamily: fonts.robotoMedium, color: '#16A34A', backgroundColor: '#DCFCE7', paddingHorizontal: l(6), paddingVertical: a(2), borderRadius: td(4) },
  itemBadgeCustom: { fontSize: td(10), fontFamily: fonts.robotoMedium, color: '#8B5CF6', backgroundColor: '#F5F3FF', paddingHorizontal: l(6), paddingVertical: a(2), borderRadius: td(4) },
  tapToEditHint: { fontSize: td(10), fontFamily: fonts.robotoRegular, color: Colors.corTextSecondary },
  
  cartItemActions: { flexDirection: 'row', alignItems: 'center' },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', marginRight: l(8), gap: l(4) },
  qtyButton: { padding: l(4), backgroundColor: '#F1F5F9', borderRadius: td(6) },
  qtyText: { fontFamily: fonts.robotoBold, fontSize: td(12), color: Colors.corText, minWidth: l(16), textAlign: 'center' },
  itemPrice: { fontSize: td(14), fontFamily: fonts.robotoBold, color: Colors.corText },
  btnRemoveItem: { marginLeft: l(10), padding: l(4) },
  
  paymentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: l(8), marginBottom: a(24) },
  paymentCard: { flex: 1, minWidth: '22%', backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: td(10), paddingVertical: a(12), alignItems: 'center', gap: a(6) },
  paymentCardActive: { borderColor: '#FF7A00', backgroundColor: '#FFF1E6' },
  paymentLabel: { fontSize: td(12), fontFamily: fonts.robotoMedium, color: Colors.corTextSecondary },
  paymentLabelActive: { color: '#FF7A00', fontFamily: fonts.robotoBold },
  
  summaryContainer: { backgroundColor: Colors.white, borderRadius: td(12), padding: l(16), borderWidth: 1, borderColor: Colors.border },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: a(16) },
  summaryTitle: { fontSize: td(14), fontFamily: fonts.robotoBold, color: Colors.corTextTitle },
  linkEdit: { fontSize: td(13), fontFamily: fonts.robotoBold, color: '#FF7A00' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: a(12) },
  summaryLabel: { fontSize: td(14), fontFamily: fonts.robotoRegular, color: Colors.corTextSecondary },
  summaryValue: { fontSize: td(14), fontFamily: fonts.robotoMedium, color: Colors.corText },
  summaryValueDiscount: { fontSize: td(14), fontFamily: fonts.robotoMedium, color: Colors.error },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: a(8) },
  totalLabel: { fontSize: td(16), fontFamily: fonts.robotoBold, color: Colors.corTextTitle },
  totalValue: { fontSize: td(18), fontFamily: fonts.robotoBold, color: '#FF7A00' }, 
  
  footer: { backgroundColor: Colors.white, paddingHorizontal: l(16), paddingTop: a(16), paddingBottom: a(32), borderTopWidth: 1, borderTopColor: Colors.border },
  btnCheckout: { backgroundColor: '#FF7A00', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: a(56), borderRadius: td(12), paddingHorizontal: l(20) },
  btnCheckoutDisabled: { opacity: 0.5 },
  btnCheckoutText: { fontSize: td(15), fontFamily: fonts.robotoBold, color: Colors.white },
  btnCheckoutTotal: { fontSize: td(16), fontFamily: fonts.robotoBold, color: Colors.white },
  
  modalOverlay: { flex: 1, backgroundColor: Colors.semiTransparente, justifyContent: 'center', padding: l(20) },
  modalContent: { backgroundColor: Colors.white, borderRadius: td(16), padding: l(20) },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: a(20) },
  modalTitle: { fontSize: td(18), fontFamily: fonts.robotoBold, color: Colors.corTextTitle },
  inputLabel: { fontSize: td(13), fontFamily: fonts.robotoMedium, color: Colors.corTextSecondary, marginBottom: a(8) },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: td(8), paddingHorizontal: l(12), height: a(48), fontSize: td(14), fontFamily: fonts.robotoRegular, color: Colors.corText, marginBottom: a(16) },
  btnModalPrimary: { backgroundColor: '#FF7A00', height: a(48), borderRadius: td(8), justifyContent: 'center', alignItems: 'center', marginTop: a(8) },
  btnModalPrimaryText: { color: Colors.white, fontFamily: fonts.robotoBold, fontSize: td(14) }
});