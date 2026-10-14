import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
  Text, Pressable, ActivityIndicator, StatusBar, Keyboard, TouchableOpacity, Alert
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { FormInput } from '@/components/shared/FormInput';
import { EditeProfileHeader } from '@/components/layout/header';

import { useClientMutations } from '@/hooks/useClientMutations';
import { useCompanyClients } from '@/hooks/useCompanyClients';

interface FormErrors {
  name?: boolean;
  phone?: boolean;
  email?: boolean;
}

export default function NovoClienteScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const { data: clients = [] } = useCompanyClients();
  const { createClient, updateClient, deleteClient } = useClientMutations();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (isEditing && !isHydrated && clients.length > 0) {
      const clientToEdit = clients.find(c => c.id === id);
      if (clientToEdit) {
        setName(clientToEdit.name || '');
        
        // Aplica a máscara no telefone bruto vindo da API
        const rawPhone = clientToEdit.phone || '';
        let formatted = rawPhone;
        if (rawPhone.length === 11) formatted = `(${rawPhone.substring(0, 2)}) ${rawPhone.substring(2, 7)}-${rawPhone.substring(7, 11)}`;
        else if (rawPhone.length === 10) formatted = `(${rawPhone.substring(0, 2)}) ${rawPhone.substring(2, 6)}-${rawPhone.substring(6, 10)}`;
        setPhone(formatted);
        
        setEmail(clientToEdit.email || '');
        setIsHydrated(true);
      }
    }
  }, [id, clients, isEditing, isHydrated]);

  const handlePhoneChange = (text: string) => {
    const raw = text.replace(/\D/g, '');
    let formatted = raw;
    if (raw.length > 2) formatted = `(${raw.substring(0, 2)}) ${raw.substring(2)}`;
    if (raw.length > 7) formatted = `(${raw.substring(0, 2)}) ${raw.substring(2, 7)}-${raw.substring(7, 11)}`;
    
    setPhone(formatted);
    setErrors(prev => ({ ...prev, phone: false }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = true;
    if (!phone.trim() || phone.length < 14) newErrors.phone = true;
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    Keyboard.dismiss();

    if (!validate()) {
      Toast.show({ type: 'error', text1: 'Erro de validação', text2: 'Preencha os campos obrigatórios.' });
      return;
    }

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
    };

    try {
      if (isEditing && id) {
        await updateClient.mutateAsync({ id, data: payload });
        Toast.show({ type: 'success', text1: 'Cliente atualizado' });
      } else {
        await createClient.mutateAsync(payload);
        Toast.show({ type: 'success', text1: 'Cliente cadastrado' });
      }
      router.back();
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Falha ao salvar dados do cliente.';
      Toast.show({ type: 'error', text1: 'Erro', text2: errorMsg });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Cliente',
      'Tem certeza que deseja excluir este cliente? O histórico de agendamentos não será afetado.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              if (id) {
                await deleteClient.mutateAsync(id);
                Toast.show({ type: 'success', text1: 'Cliente removido' });
                router.back();
              }
            } catch (error) {
              Toast.show({ type: 'error', text1: 'Erro ao excluir' });
            }
          }
        }
      ]
    );
  };

  const isPending = createClient.isPending || updateClient.isPending || deleteClient.isPending;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
      <Stack.Screen options={{ headerShown: true, header: () => <EditeProfileHeader title={isEditing ? 'Editar Cliente' : 'Novo Cliente'} onBack={() => router.back()} /> }} />
      <StatusBar barStyle="dark-content" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <FormInput 
            label="Nome Completo *" 
            placeholder="Ex: Maria Silva" 
            value={name} 
            onChangeText={(t) => { setName(t); setErrors(prev => ({ ...prev, name: false })); }} 
            error={errors.name} 
          />
          <FormInput 
            label="Telefone (WhatsApp) *" 
            placeholder="(00) 00000-0000" 
            keyboardType="phone-pad" 
            value={phone} 
            onChangeText={handlePhoneChange} 
            error={errors.phone} 
            maxLength={15} 
          />
          <FormInput 
            label="E-mail (Opcional)" 
            placeholder="Ex: maria@email.com" 
            keyboardType="email-address" 
            autoCapitalize="none" 
            value={email} 
            onChangeText={(t) => { setEmail(t); setErrors(prev => ({ ...prev, email: false })); }} 
            error={errors.email} 
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isEditing && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={isPending}>
            <Ionicons name="trash-outline" size={td(22)} color="#F43F5E" />
          </TouchableOpacity>
        )}
        <Pressable style={[styles.saveButton, isPending && styles.saveButtonPending]} onPress={handleSave} disabled={isPending}>
          {isPending ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.saveButtonText}>{isEditing ? 'Salvar Alterações' : 'Cadastrar Cliente'}</Text>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scroll: { flex: 1 },
  scrollContent: { paddingVertical: l(20), gap: a(16), paddingBottom: a(30) },
  card: { backgroundColor: '#FFFFFF', borderRadius: td(12), paddingHorizontal: l(15), paddingVertical: a(20), gap: a(15), marginHorizontal: l(10), borderWidth: StyleSheet.hairlineWidth, borderColor: Colors.border },
  footer: { flexDirection: 'row', gap: l(12), backgroundColor: Colors.white, paddingHorizontal: l(16), paddingTop: a(12), paddingBottom: a(24), borderTopWidth: StyleSheet.hairlineWidth, borderColor: Colors.border },
  saveButton: { flex: 1, backgroundColor: Colors.corButton, height: a(44), borderRadius: td(10), justifyContent: 'center', alignItems: 'center' },
  deleteButton: { width: a(44), height: a(44), backgroundColor: '#FFF1F2', borderRadius: td(10), justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FECDD3' },
  saveButtonPending: { opacity: 0.7 },
  saveButtonText: { fontSize: td(15), fontFamily: fonts?.robotoBold, color: '#FFFFFF' },
});