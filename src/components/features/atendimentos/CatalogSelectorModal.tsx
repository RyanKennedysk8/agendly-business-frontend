import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/colors/color';
import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { useMyCompany } from '@/hooks/useMyCompany';
import { useCompanyProducts, useCreateProduct } from '@/hooks/useCompanyProducts';
import { useCartStore } from '@/store/useCartStore';

interface Props {
  visible: boolean;
  onClose: () => void;
}

type TabType = 'SERVICES' | 'PRODUCTS' | 'CUSTOM';

export const CatalogSelectorModal: React.FC<Props> = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('SERVICES');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados para Item Avulso / Novo Produto
  const [customDesc, setCustomDesc] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  const { data: company } = useMyCompany();
  const companyId = useCartStore(state => state.companyId) || company?.id;
  const addItem = useCartStore(state => state.addItem);

  const { data: products = [], isLoading: loadingProducts } = useCompanyProducts(companyId);
  const { mutateAsync: createProduct, isPending: savingProduct } = useCreateProduct();

  const companyServices = company?.services || [];

  const filteredServices = useMemo(() => {
    return companyServices.filter((s: any) => 
      s.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [companyServices, searchQuery]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleSelectCatalogService = (service: any) => {
    addItem({
      type: 'CUSTOM',
      referenceId: service.id,
      description: service.name,
      quantity: 1,
      unitPrice: Number(service.price || 0),
    });
    onClose();
  };

  const handleSelectProduct = (product: any) => {
    addItem({
      type: 'PRODUCT',
      referenceId: product.id,
      description: product.name,
      quantity: 1,
      unitPrice: Number(product.price || 0),
    });
    onClose();
  };

  const handleAddCustom = () => {
    if (!customDesc.trim() || !customPrice) return;
    addItem({
      type: 'CUSTOM',
      description: customDesc.trim(),
      quantity: 1,
      unitPrice: parseFloat(customPrice.replace(',', '.')),
    });
    setCustomDesc('');
    setCustomPrice('');
    onClose();
  };

  const handleSaveNewProduct = async () => {
    if (!customDesc.trim() || !customPrice || !companyId) return;
    const priceNum = parseFloat(customPrice.replace(',', '.'));
    
    const created = await createProduct({
      companyId,
      name: customDesc.trim(),
      price: priceNum,
    });

    // Já adiciona o produto recém-criado ao carrinho atual
    addItem({
      type: 'PRODUCT',
      referenceId: created.id,
      description: created.name,
      quantity: 1,
      unitPrice: created.price,
    });

    setCustomDesc('');
    setCustomPrice('');
    setIsCreatingProduct(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Adicionar ao Caixa</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={td(22)} color={Colors.corTextSecondary} />
            </TouchableOpacity>
          </View>

          {/* Abas de Navegação */}
          <View style={styles.tabsRow}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'SERVICES' && styles.tabActive]} 
              onPress={() => { setActiveTab('SERVICES'); setIsCreatingProduct(false); }}
            >
              <Text style={[styles.tabText, activeTab === 'SERVICES' && styles.tabTextActive]}>Serviços Extras</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tab, activeTab === 'PRODUCTS' && styles.tabActive]} 
              onPress={() => { setActiveTab('PRODUCTS'); setIsCreatingProduct(false); }}
            >
              <Text style={[styles.tabText, activeTab === 'PRODUCTS' && styles.tabTextActive]}>Produtos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tab, activeTab === 'CUSTOM' && styles.tabActive]} 
              onPress={() => { setActiveTab('CUSTOM'); setIsCreatingProduct(false); }}
            >
              <Text style={[styles.tabText, activeTab === 'CUSTOM' && styles.tabTextActive]}>Valor Avulso</Text>
            </TouchableOpacity>
          </View>

          {/* Barra de Busca (Para Serviços e Produtos) */}
          {activeTab !== 'CUSTOM' && !isCreatingProduct && (
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={td(18)} color={Colors.corTextSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder={activeTab === 'SERVICES' ? "Buscar serviço..." : "Buscar produto..."}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={Colors.placeholder}
              />
            </View>
          )}

          {/* CONTEÚDO 1: LISTA DE SERVIÇOS DA EMPRESA */}
          {activeTab === 'SERVICES' && (
            <FlatList
              data={filteredServices}
              keyExtractor={(item: any) => item.id}
              style={styles.list}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.catalogItem} onPress={() => handleSelectCatalogService(item)}>
                  <View>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemSub}>{item.durationInMinutes || 30} min</Text>
                  </View>
                  <View style={styles.priceBadge}>
                    <Text style={styles.priceText}>+ R$ {Number(item.price || 0).toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>Nenhum serviço encontrado.</Text>}
            />
          )}

          {/* CONTEÚDO 2: LISTA DE PRODUTOS OU CADASTRO RÁPIDO */}
          {activeTab === 'PRODUCTS' && !isCreatingProduct && (
            <View style={{ flex: 1 }}>
              {loadingProducts ? (
                <ActivityIndicator color="#FF7A00" style={{ marginTop: a(24) }} />
              ) : (
                <FlatList
                  data={filteredProducts}
                  keyExtractor={(item) => item.id}
                  style={styles.list}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.catalogItem} onPress={() => handleSelectProduct(item)}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <View style={styles.priceBadge}>
                        <Text style={styles.priceText}>+ R$ {Number(item.price).toFixed(2)}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={<Text style={styles.emptyText}>Nenhum produto cadastrado no catálogo.</Text>}
                />
              )}

              <TouchableOpacity style={styles.btnNewCatalogProduct} onPress={() => setIsCreatingProduct(true)}>
                <Ionicons name="add-circle" size={td(18)} color="#FF7A00" />
                <Text style={styles.btnNewCatalogProductText}>Cadastrar Novo Produto no Catálogo</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* FORMULÁRIO DE NOVO PRODUTO OU ITEM AVULSO */}
          {(activeTab === 'CUSTOM' || isCreatingProduct) && (
            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>
                {isCreatingProduct ? 'Nome do Produto (Ficará salvo no catálogo)' : 'Descrição da Venda Avulsa'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={isCreatingProduct ? "Ex: Pomada Modeladora Matte 150g" : "Ex: Taxa extra / Serviço personalizado"}
                value={customDesc}
                onChangeText={setCustomDesc}
              />

              <Text style={styles.inputLabel}>Valor Unitário (R$)</Text>
              <TextInput
                style={styles.input}
                placeholder="0,00"
                keyboardType="decimal-pad"
                value={customPrice}
                onChangeText={setCustomPrice}
              />

              <TouchableOpacity 
                style={styles.btnPrimary} 
                onPress={isCreatingProduct ? handleSaveNewProduct : handleAddCustom}
                disabled={savingProduct}
              >
                {savingProduct ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.btnPrimaryText}>
                    {isCreatingProduct ? 'Salvar no Catálogo & Adicionar' : 'Inserir no Carrinho'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: Colors.semiTransparente, justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.white, borderTopLeftRadius: td(24), borderTopRightRadius: td(24), padding: l(20), height: '75%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: a(16) },
  title: { fontSize: td(18), fontFamily: fonts.robotoBold, color: Colors.corTextTitle },
  closeBtn: { padding: l(4) },
  tabsRow: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: td(10), padding: l(4), marginBottom: a(16) },
  tab: { flex: 1, paddingVertical: a(8), alignItems: 'center', borderRadius: td(8) },
  tabActive: { backgroundColor: Colors.white, elevation: 1 },
  tabText: { fontSize: td(12), fontFamily: fonts.robotoMedium, color: Colors.corTextSecondary },
  tabTextActive: { color: '#FF7A00', fontFamily: fonts.robotoBold },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: Colors.border, borderRadius: td(10), paddingHorizontal: l(12), height: a(42), marginBottom: a(12) },
  searchInput: { flex: 1, marginLeft: l(8), fontSize: td(13), fontFamily: fonts.robotoRegular, color: Colors.corText },
  list: { flex: 1 },
  catalogItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: a(14), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  itemName: { fontSize: td(14), fontFamily: fonts.robotoMedium, color: Colors.corText },
  itemSub: { fontSize: td(11), fontFamily: fonts.robotoRegular, color: Colors.corTextSecondary, marginTop: a(2) },
  priceBadge: { backgroundColor: '#FFF1E6', paddingHorizontal: l(10), paddingVertical: a(6), borderRadius: td(8) },
  priceText: { fontSize: td(13), fontFamily: fonts.robotoBold, color: '#FF7A00' },
  emptyText: { textAlign: 'center', color: Colors.corTextSecondary, marginTop: a(32), fontFamily: fonts.robotoRegular, fontSize: td(13) },
  btnNewCatalogProduct: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: l(6), paddingVertical: a(12), borderTopWidth: 1, borderTopColor: Colors.border, marginTop: a(8) },
  btnNewCatalogProductText: { fontSize: td(13), fontFamily: fonts.robotoBold, color: '#FF7A00' },
  formContainer: { marginTop: a(8) },
  inputLabel: { fontSize: td(13), fontFamily: fonts.robotoMedium, color: Colors.corTextSecondary, marginBottom: a(6) },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: td(10), paddingHorizontal: l(12), height: a(48), fontSize: td(14), fontFamily: fonts.robotoRegular, color: Colors.corText, marginBottom: a(16) },
  btnPrimary: { backgroundColor: '#FF7A00', height: a(48), borderRadius: td(10), justifyContent: 'center', alignItems: 'center', marginTop: a(8) },
  btnPrimaryText: { color: Colors.white, fontFamily: fonts.robotoBold, fontSize: td(14) },
});