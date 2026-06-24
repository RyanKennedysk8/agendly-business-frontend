// app/(auth)/verify.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext'; // Seu Contexto
import api from '@/services/api';
import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';

const PIN_LENGTH = 6;

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { signInWithToken } = useAuth();
  
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Auto-foca o input assim que a tela abre
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Quando chegar a 6 caracteres, dispara a API automaticamente
  useEffect(() => {
    if (code.length === PIN_LENGTH) {
      handleVerifyCode();
    }
  }, [code]);

  const handleVerifyCode = async () => {
    setIsLoading(true);
    try {
      // Chama o endpoint de verificação do Java
      const { data } = await api.post('/auth/email/verify', { email, code });
      
      // O seu Java retorna accessToken e refreshToken
      if (data.accessToken && data.refreshToken) {
        // Envia para o AuthContext que você criou
        await signInWithToken(data.accessToken, data.refreshToken);
        
        // OBS: O redirecionamento para o (main) ocorrerá automaticamente
        // caso o _layout.tsx principal esteja escutando o estado de Auth.
      } else if (data.isNewUser) {
        Alert.alert('Novo Cadastro', 'Este fluxo será de criação de loja.');
        // router.push('/(auth)/register-business');
      }
    } catch (error: any) {
      Alert.alert('Código Inválido', 'O código informado está incorreto ou expirou.');
      setCode('');
      inputRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // Renderiza visualmente as 6 caixinhas
  const renderPins = () => {
    const pins = [];
    for (let i = 0; i < PIN_LENGTH; i++) {
      const isFocused = code.length === i;
      pins.push(
        <View key={i} style={[styles.pinBox, isFocused && styles.pinBoxFocused, code.length > i && styles.pinBoxFilled]}>
          <Text style={styles.pinText}>{code[i] || ''}</Text>
        </View>
      );
    }
    return pins;
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verifique seu e-mail</Text>
        <Text style={styles.subtitle}>Enviamos um código de 6 dígitos para{'\n'}<Text style={styles.emailHighlight}>{email}</Text></Text>

        <Pressable onPress={() => inputRef.current?.focus()} style={styles.pinsContainer}>
          {renderPins()}
        </Pressable>

        {/* INPUT INVISÍVEL que controla a digitação */}
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={setCode}
          maxLength={PIN_LENGTH}
          keyboardType="number-pad"
          textContentType="oneTimeCode" // Auto-preenchimento de SMS no iOS
          style={styles.hiddenInput}
        />

        {isLoading && <ActivityIndicator color="#FF7A00" style={{ marginTop: a(20) }} />}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, paddingHorizontal: l(24), paddingTop: a(80) },
  title: { fontSize: td(28), fontFamily: fonts?.robotoBold || 'System', color: '#0F172A', marginBottom: a(8) },
  subtitle: { fontSize: td(15), fontFamily: fonts?.robotoRegular || 'System', color: '#64748B', marginBottom: a(40), lineHeight: td(22) },
  emailHighlight: { fontFamily: fonts?.robotoBold || 'System', color: '#0F172A' },
  pinsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: a(24) },
  pinBox: { width: td(48), height: td(56), borderRadius: td(12), backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  pinBoxFocused: { borderColor: '#FF7A00', borderWidth: 2, backgroundColor: '#FFF5EB' },
  pinBoxFilled: { borderColor: '#CBD5E1' },
  pinText: { fontSize: td(24), fontFamily: fonts?.robotoBold || 'System', color: '#0F172A' },
  hiddenInput: { position: 'absolute', width: 1, height: 1, opacity: 0 },
});