// app/_layout.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useSegments, SplashScreen } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useFonts } from '@/hooks/useFonts';
import { CustomHeader } from '@/components/layout/header/orquestrador/CustomHeader';
import { AuthProvider, useAuth } from '@/contexts/AuthContext'; // O contexto que você vai colar aqui
import { Colors } from '@/colors/color';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/components/shared/ToastBase';

SplashScreen.preventAutoHideAsync();

// 1. Instância do React Query (Preparando o terreno para as requisições da API)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos de cache em memória
      retry: 1
    },
  },
});

// 2. Componente Interno: Responsável por gerenciar o Roteamento Condicional (Auth Guard)
function InitialLayout() {
  const { token, isLoading: isAuthLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Se o Contexto ainda estiver lendo o SecureStore, não fazemos nada.
    if (isAuthLoading) return;

    // O 'segments' retorna um array com o caminho atual. Ex: ['(main)', '(tabs)', 'index']
    const inAuthGroup = segments[0] === '(auth)';

    if (!token && !inAuthGroup) {
      // Usuário NÃO logado tentando acessar área protegida -> Expulsa para o Login
      // Usamos replace em vez de push para ele não conseguir voltar na seta do celular
      router.replace('/(auth)/login'); 
    } else if (token && inAuthGroup) {
      // Usuário LOGADO tentando acessar a tela de Login -> Redireciona para a Home
      router.replace('/(main)/(tabs)/home');
    }
  }, [token, isAuthLoading, segments]);

  // Tela de transição enquanto lê o token criptografado
  if (isAuthLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#FF7A00" />
      </View>
    );
  }

  // Renderiza a Stack global com o seu CustomHeader para as telas que não usarem Header Embutido
  return (
    <Stack 
      screenOptions={{ 
        header: (props: any) => <CustomHeader {...props} />
      } as any} 
    />
  );
}

// 3. Raiz da Aplicação: Apenas injeta os Providers
export default function RootLayout() {
  const fontsLoaded = useFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          {/* O AuthProvider encapsula a lógica de rotas */}
          <AuthProvider>
            <InitialLayout />
            <Toast config={toastConfig} topOffset={60} />
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}