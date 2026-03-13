import { Colors } from "@/colors/color";
import { a, l, td } from "@/constants/responsive";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      width: 260, // Largura estática e absoluta para Desktop
      backgroundColor: '#FFFFFF', // Colors.white
      borderRightWidth: 1,
      borderColor: '#E2E8F0', // Colors.border
      paddingVertical: a(24),
      justifyContent: 'space-between',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: l(20),
      marginBottom: a(40),
    },
    logoBox: {
      width: td(40),
      height: td(40),
      backgroundColor: Colors.white,
      borderRadius: td(12),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: l(12),
    },
    logoText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: td(14),
    },
    brandName: {
      fontSize: td(16),
      fontWeight: '700',
      color: '#0F172A',
    },
    navContainer: {
      flex: 1,
      paddingHorizontal: l(12),
      gap: a(4),
    },
    navItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: a(12),
      paddingHorizontal: l(12),
      borderRadius: td(8),
    },
    navItemActive: {
      backgroundColor: '#F1F5F9', // Cor de fundo suave para o item selecionado
    },
    navText: {
      fontSize: td(14),
      fontWeight: '500',
      color: Colors.corTextSecondary,
      marginLeft: l(12),
    },
    navTextActive: {
      color: Colors.corText,
      fontWeight: '700',
    },
    footer: {
      paddingHorizontal: l(20),
      borderTopWidth: 1,
      borderColor: '#E2E8F0',
      paddingTop: a(20),
    },
    logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoutText: {
      fontSize: td(14),
      color: Colors.corTextSecondary,
      marginLeft: l(12),
      fontWeight: '500',
    },
  });