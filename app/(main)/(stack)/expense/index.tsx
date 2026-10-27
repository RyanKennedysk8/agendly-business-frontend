import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator, 
  Alert,
  ScrollView
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/colors/color';
import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { useCreateExpense, ExpenseCategory } from '@/hooks/useCompanyExpenses';
import { useMyCompany } from '@/hooks/useMyCompany';

const EXPENSE_CATEGORIES: { id: ExpenseCategory; label: string; icon: string }[] = [
  { id: 'SUPPLIES', label: 'Produtos / Insumos', icon: 'cube-outline' },
  { id: 'OPERATIONAL', label: 'Operacional / Loja', icon: 'construct-outline' },
  { id: 'UTILITIES', label: 'Contas Fixas', icon: 'flash-outline' },
  { id: 'OTHER', label: 'Outros', icon: 'ellipsis-horizontal-circle-outline' },
];

export default function CreateExpenseScreen() { 
  const router = useRouter();
  
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('SUPPLIES');

  const { data: company } = useMyCompany();
  const { mutateAsync: createExpense, isPending: savingExpense } = useCreateExpense();

  const handleSaveExpense = async () => {
    if (!expenseDesc.trim() || !expenseAmount) {
      Alert.alert('Campos obrigatórios', 'Preencha a descrição e o valor do gasto.');
      return;
    }
    const parsedAmount = parseFloat(expenseAmount.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Valor inválido', 'Digite um valor maior que zero.');
      return;
    }

    try {
      await createExpense({
        companyId: company?.id || null,
        description: expenseDesc.trim(),
        category: expenseCategory,
        amount: parsedAmount,
      });
      // Retorna para a tela anterior após o sucesso
      router.back();
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível salvar a despesa.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen 
            options={{ 
            headerShown: true,
            headerTitle: 'Lançar gasto',
            headerType: 'attendanceSub',
            attendanceParams: {
            subtitle: 'Caixa aberto',
            }
        } as any} 
        />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formSection}>
          <Text style={styles.inputLabel}>O que foi comprado ou pago?</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 5 Pomadas / 1 Café e Água"
            value={expenseDesc}
            onChangeText={setExpenseDesc}
          />

          <Text style={styles.inputLabel}>Valor Total Gasto (R$)</Text>
          <TextInput
            style={styles.input}
            placeholder="0,00"
            keyboardType="decimal-pad"
            value={expenseAmount}
            onChangeText={setExpenseAmount}
          />

          <Text style={styles.inputLabel}>Categoria da Despesa</Text>
          <View style={styles.categoryGrid}>
            {EXPENSE_CATEGORIES.map(cat => {
              const selected = expenseCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryChip, selected && styles.categoryChipActive]}
                  onPress={() => setExpenseCategory(cat.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={cat.icon as any} size={td(16)} color={selected ? Colors.error : Colors.corTextSecondary} />
                  <Text style={[styles.categoryChipText, selected && styles.categoryChipTextActive]}>{cat.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Footer Fixo */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.btnSaveExpense, savingExpense && styles.btnSaveExpenseDisabled]} 
          onPress={handleSaveExpense} 
          disabled={savingExpense}
        >
          {savingExpense ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.btnSaveExpenseText}>Confirmar Saída do Caixa</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    padding: l(10),
  },
  formSection: {
    backgroundColor: Colors.white,
    padding: l(16),
    borderRadius: td(12),
    borderWidth: 1,
    borderColor: Colors.borderHairLine,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, 
  },
  inputLabel: {
    fontSize: td(12),
    fontFamily: fonts.robotoMedium,
    color: Colors.corTextTitle,
    marginBottom: a(8),
    marginLeft:l(5)
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderHairLine,
    borderRadius: td(10),
    paddingHorizontal: l(12),
    height: a(40),
    fontSize: td(14),
    fontFamily: fonts.robotoRegular,
    color: Colors.corText,
    marginBottom: a(15),
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: l(8),
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: l(6),
    paddingHorizontal: l(12),
    paddingVertical: a(10),
    borderRadius: td(10),
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#F8FAFC',
  },
  categoryChipActive: {
    borderColor: '#FECDD3',
    backgroundColor: '#FFF1F2',
  },
  categoryChipText: {
    fontSize: td(12),
    fontFamily: fonts.robotoMedium,
    color: Colors.corTextSecondary,
  },
  categoryChipTextActive: {
    color: Colors.error,
    fontFamily: fonts.robotoBold,
  },
  footer: {
    backgroundColor: Colors.white,
    paddingHorizontal: l(16),
    paddingTop: a(10),
    paddingBottom: a(30),
    borderTopWidth: 1,
    borderTopColor: Colors.borderHairLine,
  },
  btnSaveExpense: {
    backgroundColor: Colors.error,
    height: a(40),
    borderRadius: td(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSaveExpenseDisabled: {
    opacity: 0.7,
  },
  btnSaveExpenseText: {
    color: Colors.white,
    fontFamily: fonts.robotoBold,
    fontSize: td(15),
  },
});