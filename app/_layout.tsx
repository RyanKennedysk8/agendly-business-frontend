import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import { useFonts } from '@/hooks/useFonts'; 


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsLoaded = useFonts();

  useEffect(() => {
    if (fontsLoaded) {
      // Libera a renderização da UI apenas quando as fontes estiverem na memória
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Se as fontes não carregaram, não renderiza a árvore de componentes
  if (!fontsLoaded) {
    return null; 
  }

  return (
    <GestureHandlerRootView style={{ flex: 1}}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(main)" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}