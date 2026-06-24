// app/(auth)/login.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import api from '@/services/api'; // Sua instância do Axios

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email.includes('@')) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    setIsLoading(true);
    try {
      // Chama o seu endpoint Java Passwordless
      await api.post('/auth/email/start', { email });
      
      // Navega para a tela de PIN passando o email por parâmetro
      router.push({ pathname: '/(auth)/verify', params: { email } });
    } catch (error: any) {
      Alert.alert('Ops!', error.response?.data?.message || 'Erro ao enviar o código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Acesse seu painel</Text>
        <Text style={styles.subtitle}>Digite seu e-mail corporativo para receber um código de acesso seguro.</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, (!email || isLoading) && styles.buttonDisabled]} 
          onPress={handleSendCode}
          disabled={!email || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Receber Código</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, paddingHorizontal: l(24), justifyContent: 'center' },
  title: { fontSize: td(28), fontFamily: fonts?.robotoBold || 'System', color: '#0F172A', marginBottom: a(8) },
  subtitle: { fontSize: td(15), fontFamily: fonts?.robotoRegular || 'System', color: '#64748B', marginBottom: a(32), lineHeight: td(22) },
  inputContainer: { marginBottom: a(24) },
  label: { fontSize: td(13), fontFamily: fonts?.robotoMedium || 'System', color: '#475569', marginBottom: a(8) },
  input: { height: a(52), backgroundColor: '#F8FAFC', borderRadius: td(12), paddingHorizontal: l(16), fontSize: td(16), color: '#0F172A', borderWidth: 1, borderColor: '#E2E8F0' },
  button: { height: a(52), backgroundColor: '#FF7A00', borderRadius: td(12), justifyContent: 'center', alignItems: 'center' },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { fontSize: td(16), fontFamily: fonts?.robotoBold || 'System', color: '#FFFFFF' },
});