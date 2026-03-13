import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { td, l, a } from '@/constants/responsive';
import { Colors } from '@/colors/color';
import { styles } from './style';
import { Image } from 'expo-image';

// O contrato de rotas DEVE ser idêntico ao array TAB_SCREENS do seu _layout.tsx
const SIDEBAR_ITEMS = [
  { name: 'home', title: 'Início', icon: 'home' },
  { name: 'checkIn', title: 'Check-in', icon: 'bag-check' },
  { name: 'agendamentos', title: 'Agendamentos', icon: 'calendar' },
  { name: 'cliente', title: 'Clientes', icon: 'people' },
  { name: 'profile', title: 'Perfil', icon: 'storefront' },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // Lógica de active state: Verifica se a URL atual contém o nome da rota base.
  // Usamos startsWith para garantir que o item continue ativo se o usuário 
  // navegar para uma sub-tela da stack (ex: /agendamento/detalhes/123)
  const isRouteActive = (routeName: string) => {
    // Tratamento especial para a rota index/home para evitar falso positivo
    if (routeName === 'home') {
      return pathname === '/home' || pathname === '/';
    }
    return pathname.startsWith(`/${routeName}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      
        <View style={styles.logoBox}>
        <Image 
            source={require("@assets/images/logo3d.png")}
            style={{height:td(40), width:td(40)}}

        />
        </View>
        <Text style={styles.brandName}>Agendly Empresa</Text>
      </View>

      <View style={styles.navContainer}>
        {SIDEBAR_ITEMS.map((item) => {
          const active = isRouteActive(item.name);

          return (
            <Pressable
              key={item.name}
              style={[styles.navItem, active && styles.navItemActive]}
              // O roteamento do Expo Router em abas ocultas exige o path absoluto
              onPress={() => router.push(`/${item.name}` as any)}
            >
              <Ionicons
                name={active ? (item.icon as any) : `${item.icon}-outline`}
                size={td(20)}
                color={active ? Colors.corText : Colors.corTextSecondary}
              />
              <Text style={[styles.navText, active && styles.navTextActive]}>
                {item.title}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.logoutBtn} onPress={() => console.log('Logout')}>
          <Ionicons name="log-out-outline" size={td(20)} color={Colors.corTextSecondary} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </Pressable>
      </View>
    </View>
  );
}

