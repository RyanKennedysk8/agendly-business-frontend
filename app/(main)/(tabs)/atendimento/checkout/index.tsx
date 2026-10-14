import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
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
    items, getSubtotal, getTotal, discount, tip, paymentMethod,
    removeItem, addItem, updateItemPrice, setDiscount, setTip, setPaymentMethod, buildCheckoutPayload 
  } = useCartStore();

  // Modais
  const [isItemModalVisible, setItemModalVisible] = useState(false);
  const [isValuesModalVisible, setValuesModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  // Inputs
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [editPriceInput, setEditPriceInput] = useState('');
  const [inputDiscount, setInputDiscount] = useState(discount.toString());
  const [inputTip, setInputTip] = useState(tip.toString());

  const handleConfirmCustomItem = () => {
    if (!newItemDesc.trim() || !newItemPrice) return;
    addItem({
      type: 'CUSTOM',
      description: newItemDesc.trim(),
      quantity: 1,
      unitPrice: parseFloat(newItemPrice.replace(',', '.'))
    });
    setNewItemDesc('');
    setNewItemPrice('');
    setItemModalVisible(false);
  };

  const handleOpenEditPrice = (item: CartItem) => {
    setEditingItem(item);
    setEditPriceInput(item.unitPrice.toFixed(2));
  };

  const handleConfirmEditPrice = () => {
    if (!editingItem || !editPriceInput) return;
    const parsed = parseFloat(editPriceInput.replace(',', '.'));
    if (!isNaN(parsed)) {
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
      Alert.alert('Carrinho Vazio', 'Adicione pelo menos um item ou serviço para finalizar a venda.');
      return;
    }
    if (!paymentMethod) {
      Alert.alert('Forma de Pagamento', 'Selecione a forma de pagamento antes de confirmar.');
      return;
    }

    try {
      const payload = buildCheckoutPayload();
      await processCheckout(payload);
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível processar o fechamento do caixa.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen 
        options={{ 
          title: 'PDV / Checkout',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.white },
        }} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* CABEÇALHO DO CARRINHO */}
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Itens da Venda</Text>
          <TouchableOpacity style={styles.btnAddItem} onPress={() => setItemModalVisible(true)}>
            <Ionicons name="add-circle-outline" size={td(18)} color="#FF7A00" />
            <Text style={styles.btnAddItemText}>Adicionar Item / Extra</Text>
          </TouchableOpacity>
        </View>

        {/* LISTA DE ITENS */}
        <View style={styles.cartContainer}>
          {items.length === 0 ? (
            <View style={styles.emptyCart}>
              <Ionicons name="basket-outline" size={td(32)} color={Colors.corTextSecondary} />
              <Text style={styles.emptyCartText}>Nenhum item no caixa. Clique em "Adicionar Item" acima para iniciar uma venda avulsa.</Text>
            </View>
          ) : (
            items.map((item, idx) => (
              <TouchableOpacity 
                key={item.localId} 
                activeOpacity={0.7}
                onPress={() => handleOpenEditPrice(item)}
                style={[styles.cartItem, idx === items.length - 1 && { borderBottomWidth: 0 }]}
              >
                <View style={styles.cartItemInfo}>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                  <View style={styles.badgeRow}>
                    <Text style={item.type === 'APPOINTMENT' ? styles.itemBadge : styles.itemBadgeCustom}>
                      {item.type === 'APPOINTMENT' ? 'Serviço Agendado' : 'Venda / Extra'}
                    </Text>
                    <Text style={styles.tapToEditHint}>Toque para editar valor</Text>
                  </View>
                </View>
                
                <View style={styles.cartItemActions}>
                  <Text style={styles.itemPrice}>
                    R$ {(item.unitPrice * item.quantity).toFixed(2)}
                  </Text>
                  
                  {item.type !== 'APPOINTMENT' && (
                    <TouchableOpacity onPress={() => removeItem(item.localId)} style={{ marginLeft: l(12), padding: l(4) }}>
                      <Ionicons name="trash-outline" size={td(18)} color={Colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* MÉTODO DE PAGAMENTO */}
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

      {/* MODAL 1: ADICIONAR ITEM AVULSO */}
      <Modal visible={isItemModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar ao Caixa</Text>
              <TouchableOpacity onPress={() => setItemModalVisible(false)}>
                <Ionicons name="close" size={td(24)} color={Colors.corTextSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Descrição (Produto ou Serviço Extra)</Text>
            <TextInput style={styles.input} placeholder="Ex: Pomada Matte / Sobrancelha" value={newItemDesc} onChangeText={setNewItemDesc} />
            <Text style={styles.inputLabel}>Valor Unitário (R$)</Text>
            <TextInput style={styles.input} placeholder="0,00" keyboardType="decimal-pad" value={newItemPrice} onChangeText={setNewItemPrice} />
            <TouchableOpacity style={styles.btnModalPrimary} onPress={handleConfirmCustomItem}>
              <Text style={styles.btnModalPrimaryText}>Inserir no Carrinho</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL 2: EDITAR PREÇO DO ITEM SELECIONADO */}
      <Modal visible={!!editingItem} transparent animationType="fade">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Alterar Valor</Text>
              <TouchableOpacity onPress={() => setEditingItem(null)}>
                <Ionicons name="close" size={td(24)} color={Colors.corTextSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>{editingItem?.description}</Text>
            <TextInput style={styles.input} placeholder="0,00" keyboardType="decimal-pad" value={editPriceInput} onChangeText={setEditPriceInput} autoFocus />
            <TouchableOpacity style={styles.btnModalPrimary} onPress={handleConfirmEditPrice}>
              <Text style={styles.btnModalPrimaryText}>Salvar Novo Valor</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL 3: DESCONTOS E GORJETAS */}
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
  cartContainer: { backgroundColor: Colors.white, borderRadius: td(12), padding: l(16), borderWidth: 1, borderColor: Colors.border, marginBottom: a(24) },
  emptyCart: { alignItems: 'center', paddingVertical: a(24), gap: a(8) },
  emptyCartText: { fontSize: td(13), fontFamily: fonts.robotoRegular, color: Colors.corTextSecondary, textAlign: 'center' },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: a(12), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  cartItemInfo: { flex: 1 },
  itemDescription: { fontSize: td(15), fontFamily: fonts.robotoMedium, color: Colors.corText },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: l(8), marginTop: a(4) },
  itemBadge: { fontSize: td(10), fontFamily: fonts.robotoMedium, color: '#3B82F6', backgroundColor: '#EFF6FF', paddingHorizontal: l(6), paddingVertical: a(2), borderRadius: td(4) },
  itemBadgeCustom: { fontSize: td(10), fontFamily: fonts.robotoMedium, color: '#8B5CF6', backgroundColor: '#F5F3FF', paddingHorizontal: l(6), paddingVertical: a(2), borderRadius: td(4) },
  tapToEditHint: { fontSize: td(10), fontFamily: fonts.robotoRegular, color: Colors.corTextSecondary },
  cartItemActions: { flexDirection: 'row', alignItems: 'center' },
  itemPrice: { fontSize: td(15), fontFamily: fonts.robotoBold, color: Colors.corText },
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