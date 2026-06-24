import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { scale as l, verticalScale as a, moderateScale as td } from 'react-native-size-matters';
import { fonts } from '@/assets/fonts/fonts';

// 1. Importando apenas o seu Hook Customizado
import { useMyCompany } from '@/hooks/useMyCompany'; 

export default function PerfilScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  // 2. Consumindo os dados de forma abstrata e limpa
  const { data: company, isLoading, isError } = useMyCompany();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7A00" />
      </View>
    );
  }

  if (isError || !company) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Erro ao carregar os dados da loja.</Text>
      </View>
    );
  }

  const bannerUrl = company.images && company.images.length > 0 ? company.images[0] : null;

  return (
    <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
      <View style={styles.headerSection}>
        {bannerUrl ? (
          <Image source={{ uri: bannerUrl }} style={styles.bannerImage} />
        ) : (
          <View style={[styles.bannerImage, { backgroundColor: '#E2E8F0' }]} />
        )}
        
        <View style={styles.infoOverlay}>
          {company.logoUrl ? (
            <Image source={{ uri: company.logoUrl }} style={styles.logoImage} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoInitials}>{company.name.substring(0, 2).toUpperCase()}</Text>
            </View>
          )}
          
          <Text style={styles.companyName}>{company.name}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{company.isOpen ? 'ABERTO AGORA' : 'FECHADO'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Gestão da Loja</Text>

        <MenuItem icon="people-outline" title="Meus Clientes" onPress={() => router.push('/(main)/(stack)/clientes')} />
        <MenuItem icon="wallet-outline" title="Financeiro" onPress={() => router.push('/(main)/(stack)/clientes')} />
        <MenuItem icon="list-outline" title="Catálogo de Serviços" onPress={() => router.push('/(main)/(stack)/servicos')} />
        <MenuItem icon="id-card-outline" title="Equipe e Funcionários" onPress={() => router.push('/(main)/(stack)/funcionarios')} />
        
        <Text style={[styles.sectionTitle, { marginTop: a(20) }]}>Configurações</Text>
        <MenuItem icon="time-outline" title="Horários de Funcionamento" onPress={() => console.log('Horários')} />
        
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Ionicons name="log-out-outline" size={td(20)} color="#EF4444" />
          <Text style={styles.logoutText}>Sair do Aplicativo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const MenuItem = ({ icon, title, onPress }: { icon: any, title: string, onPress: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuItemLeft}>
      <Ionicons name={icon} size={td(22)} color="#64748B" />
      <Text style={styles.menuItemTitle}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={td(20)} color="#CBD5E1" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  errorText: { fontSize: td(14), color: '#EF4444', fontFamily: fonts.robotoMedium },
  
  headerSection: { alignItems: 'center', paddingBottom: a(20), backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  bannerImage: { width: '100%', height: a(140), resizeMode: 'cover' },
  infoOverlay: { alignItems: 'center', marginTop: -a(40) },
  
  logoImage: { width: td(80), height: td(80), borderRadius: td(40), borderWidth: 3, borderColor: '#FFFFFF' },
  logoPlaceholder: { width: td(80), height: td(80), borderRadius: td(40), backgroundColor: '#FF7A00', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFFFFF' },
  logoInitials: { fontSize: td(24), fontFamily: fonts.robotoBold, color: '#FFFFFF' },
  
  companyName: { fontSize: td(20), fontFamily: fonts.robotoBold, color: '#0F172A', marginTop: a(10) },
  statusBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: l(10), paddingVertical: a(4), borderRadius: td(10), marginTop: a(6) },
  statusText: { fontSize: td(10), fontFamily: fonts.robotoBold, color: '#10B981' },
  
  menuSection: { padding: l(20) },
  sectionTitle: { fontSize: td(14), fontFamily: fonts.robotoBold, color: '#94A3B8', marginBottom: a(10), textTransform: 'uppercase' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: l(16), borderRadius: td(12), marginBottom: a(8) },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: l(12) },
  menuItemTitle: { fontSize: td(15), fontFamily: fonts.robotoMedium, color: '#334155' },
  
  logoutButton: { flexDirection: 'row', alignItems: 'center', gap: l(10), marginTop: a(20), padding: l(16) },
  logoutText: { fontSize: td(15), fontFamily: fonts.robotoBold, color: '#EF4444' }
});