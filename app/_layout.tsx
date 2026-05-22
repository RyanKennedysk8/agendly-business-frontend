import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

import { useFonts } from '@/hooks/useFonts';
import { CustomHeader } from '@/components/layout/header/orquestrador/CustomHeader';

SplashScreen.preventAutoHideAsync();

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
        <Stack
          screenOptions={{
            header: (props: NativeStackHeaderProps) => (
              <CustomHeader {...props} />
            ),
          } as any}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}