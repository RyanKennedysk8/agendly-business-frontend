// src/components/features/home/HomeHeader.tsx
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, useWindowDimensions, TextInput, Platform, Text } from 'react-native';
import { a, l, td } from '@/constants/responsive';
import { Colors } from '@/colors/color';
import { fonts } from '@/assets/fonts/fonts';
import { Ionicons } from '@expo/vector-icons';

interface HomeHeaderProps {
  userName?: string;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ userName = "Gestor" }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  if (isDesktop) {
    return (
      <View style={styles.webContainer}>
        <View style={styles.webInnerContainer}>
          <Image style={styles.webLogo} source={require("@assets/images/agendlyTxtBlack.png")} resizeMode="contain" />
          
          <View style={styles.webUserSection}>
            <TouchableOpacity style={styles.containerIcon}>
              <Ionicons name='notifications-outline' size={18} color={Colors.corText} />
            </TouchableOpacity>
            
            <View style={styles.webDivider} />
            
            <TouchableOpacity style={styles.webProfileButton}>
              <View style={styles.webAvatar}>
                <Ionicons name='person' size={14} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.webGreeting}>Olá, {userName}</Text>
                <Text style={styles.webRole}>Administrador</Text>
              </View>
              <Ionicons name='chevron-down' size={16} color="#64748B" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mobileContainer}> 
      <Image style={styles.mobileLogo} source={require("@assets/images/agendlyTxtBlack.png")} resizeMode="contain" />
      <View style={styles.containerIcons}>
        <TouchableOpacity style={styles.containerIcon}>
          <Ionicons name='notifications-outline' size={td(18)} color={Colors.corText}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.containerIcon}>
          <Ionicons name='person-outline' size={td(18)} color={Colors.corText}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mobileContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? a(40) : a(40), 
    paddingHorizontal: l(10),
    backgroundColor: Colors.white,
  },
  mobileLogo: {
    height: a(60),
    width: l(70)
  },
  containerIcons: {
    flexDirection: "row", 
    alignItems: "center",
    gap: l(12)
  },
  containerIcon: {
    backgroundColor: '#F8FAFC', 
    width: td(36),
    height: td(36),
    borderRadius: td(18),
    justifyContent: "center", 
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#E2E8F0' 
  },
  webContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center', 
    width: '100%',
  },
  webInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 1200,
    height: 70, 
    paddingHorizontal: 24,
  },
  webLogo: {
    height: a(80),
    width: l(100),
  },
  webSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 40,
    width: 350,
  },
  webSearchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0F172A',
    outlineStyle: 'none',
  } as any,
  webUserSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  webDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  webProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  webAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webGreeting: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  webRole: {
    fontSize: 12,
    color: '#64748B',
  }
});