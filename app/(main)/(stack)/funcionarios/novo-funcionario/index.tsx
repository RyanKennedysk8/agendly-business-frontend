import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  Pressable,
  ActivityIndicator,
  StatusBar,
  Keyboard,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';

import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { FormInput } from '@/components/shared/FormInput';
import { FormSelectTile } from '@/components/shared/FormSelectTile';
import { EditeProfileHeader } from '@/components/layout/header';

import { useEmployeeMutations } from '@/hooks/useEmployeeMutations';
import { useCompanyEmployees } from '@/hooks/useCompanyEmployees';
import { useMyCompany } from '@/hooks/useMyCompany';
import {
  useOperatingHoursStore,
  WeekSchedule,
} from '@/store/useOperatingHoursStore';

interface FormErrors {
  name?: boolean;
  phone?: boolean;
  email?: boolean;
}

const mapApiHoursToWeekSchedule = (apiHours: any[]): WeekSchedule => {
  const week: WeekSchedule = {MONDAY: {
      isOpen: false,
      openTime: '09:00',
      closeTime: '18:00',
      breaks: [],
    },
    TUESDAY: {
      isOpen: false,
      openTime: '09:00',
      closeTime: '18:00',
      breaks: [],
    },
    WEDNESDAY: {
      isOpen: false,
      openTime: '09:00',
      closeTime: '18:00',
      breaks: [],
    },
    THURSDAY: {
      isOpen: false,
      openTime: '09:00',
      closeTime: '18:00',
      breaks: [],
    },
    FRIDAY: {
      isOpen: false,
      openTime: '09:00',
      closeTime: '18:00',
      breaks: [],
    },
    SATURDAY: {
      isOpen: false,
      openTime: '09:00',
      closeTime: '18:00',
      breaks: [],
    },
    SUNDAY: {
      isOpen: false,
      openTime: '09:00',
      closeTime: '18:00',
      breaks: [],
    },
  };

  if (!apiHours || apiHours.length === 0) {
    return week;
  }

  apiHours.forEach((oh: any) => {
    oh.daysOfWeek.forEach((day: string) => {
      if (week[day]) {
        week[day].isOpen = true;
        week[day].openTime = oh.openingTime
          ? oh.openingTime.substring(0, 5)
          : '09:00';
        week[day].closeTime = oh.closingTime
          ? oh.closingTime.substring(0, 5)
          : '18:00';

        if (oh.breakStartTime && oh.breakEndTime) {
          week[day].breaks = [
            {
              id: Math.random().toString(),
              start: oh.breakStartTime.substring(0, 5),
              end: oh.breakEndTime.substring(0, 5),
            },
          ];
        }
      }
    });
  });

  return week;
};

// 2. Helper NOVO: Converte do formato do App (Zustand) de volta para o payload da API (Java)
const formatScheduleToApi = (schedule: WeekSchedule) => {
  const apiPayload = [];

  for (const [day, data] of Object.entries(schedule)) {
    if (data.isOpen) {
      apiPayload.push({
        daysOfWeek: [day],
        openingTime: `${data.openTime}:00`,
        closingTime: `${data.closeTime}:00`,
        breakStartTime:
          data.breaks.length > 0 ? `${data.breaks[0].start}:00` : null,
        breakEndTime:
          data.breaks.length > 0 ? `${data.breaks[0].end}:00` : null,
      });
    }
  }

  return apiPayload;
};

export default function NovoFuncionarioScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const { data: employees = [] } = useCompanyEmployees();
  const { data: myCompany } = useMyCompany();
  const { createEmployee, updateEmployee, deleteEmployee } =
    useEmployeeMutations();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isHydrated, setIsHydrated] = useState(false);

  // INICIALIZAÇÃO SILENCIOSA DOS DADOS
  useEffect(() => {
    if (myCompany && employees.length >= 0 && !isHydrated) {
      // 1. Pega os limites da loja
      const companyLimits = mapApiHoursToWeekSchedule(
        myCompany.operatingHours
      );

      let scheduleToUse = companyLimits;

      // 2. Preenche os dados pessoais se for edição
      if (isEditing) {
        const employeeToEdit = employees.find((e) => e.id === id);

        if (employeeToEdit) {
          setName(employeeToEdit.name || '');
          setPhone(employeeToEdit.phone || '');
          setEmail(employeeToEdit.email || '');
          setPhotoUrl(employeeToEdit.photoUrl || null);

          // 3. Verifica se o funcionário tem horários personalizados reais no banco
          if (
            employeeToEdit.specificOperatingHours &&
            employeeToEdit.specificOperatingHours.length > 0
          ) {
            scheduleToUse = mapApiHoursToWeekSchedule(
              employeeToEdit.specificOperatingHours
            );
          }
        }
      }

      // 4. Injeta os dados no Zustand logo que a tela abre
      useOperatingHoursStore
        .getState()
        .initialize('EMPLOYEE', scheduleToUse, companyLimits);

      setIsHydrated(true);
    }
  }, [id, employees, myCompany, isEditing, isHydrated]);

  const handlePhoneChange = (text: string) => {
    const raw = text.replace(/\D/g, '');
    let formatted = raw;

    if (raw.length > 2) {
      formatted = `(${raw.substring(0, 2)}) ${raw.substring(2)}`;
    }

    if (raw.length > 7) {
      formatted = `(${raw.substring(0, 2)}) ${raw.substring(
        2,
        7
      )}-${raw.substring(7, 11)}`;
    }

    setPhone(formatted);
    setErrors((prev) => ({ ...prev, phone: false }));
  };

  const handleSelectPhoto = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permissão Negada',
          text2: 'Precisamos de acesso à galeria.',
        });

        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setPhotoUrl(base64Image);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível carregar a imagem.',
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = true;
    }

    if (!phone.trim() || phone.length < 14) {
      newErrors.phone = true;
    }

    if (
      email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email = true;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    Keyboard.dismiss();

    if (!validate()) {
      Toast.show({
        type: 'error',
        text1: 'Erro de validação',
        text2: 'Preencha os campos obrigatórios.',
      });

      return;
    }

    // 1. Resgata os horários que estão salvos na memória do Zustand
    const currentScheduleInStore =
      useOperatingHoursStore.getState().getFormattedPayload();

    // 2. Converte para a estrutura JSON que o Spring Boot exige
    const formattedOperatingHours =
      formatScheduleToApi(currentScheduleInStore);

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      photoUrl: photoUrl,
      specificOperatingHours: formattedOperatingHours,
    };

    try {
      if (isEditing && id) {
        await updateEmployee.mutateAsync({
          id,
          data: payload,
        });

        Toast.show({
          type: 'success',
          text1: 'Profissional atualizado',
        });
      } else {
        await createEmployee.mutateAsync(payload);

        Toast.show({
          type: 'success',
          text1: 'Profissional adicionado',
        });
      }

      router.back();
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        'Falha ao salvar. Verifique se os horários estão dentro do limite da loja.';

      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: errorMsg,
      });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Profissional',
      'Tem certeza que deseja excluir? Esta ação removerá o profissional de todos os serviços vinculados.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              if (id) {
                await deleteEmployee.mutateAsync(id);

                Toast.show({
                  type: 'success',
                  text1: 'Profissional removido',
                });

                router.back();
              }
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Erro ao excluir',
              });
            }
          },
        },
      ]
    );
  };

  const openOperatingHours = () => {
    if (!myCompany) {
      Toast.show({
        type: 'error',
        text1: 'Aguarde',
        text2: 'Carregando dados da loja...',
      });

      return;
    }

    // Como os dados já foram injetados no useEffect na abertura da tela, apenas abrimos a rota
    router.push('/(shared)/horarios/' as any);
  };

  const isPending =
    createEmployee.isPending ||
    updateEmployee.isPending ||
    deleteEmployee.isPending;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <EditeProfileHeader
              title={
                isEditing
                  ? 'Editar Profissional'
                  : 'Novo Profissional'
              }
              onBack={() => router.back()}
            />
          ),
        }}
      />

      <StatusBar barStyle="dark-content" />

      {isHydrated ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.photoSection}>
            <TouchableOpacity
              style={styles.photoContainer}
              activeOpacity={0.8}
              onPress={handleSelectPhoto}
            >
              {photoUrl ? (
                <Image
                  source={{ uri: photoUrl }}
                  style={styles.photoImage}
                />
              ) : (
                <View style={styles.photoFallback}>
                  <Ionicons
                    name="camera-outline"
                    size={td(32)}
                    color={Colors.corTextLight}
                  />
                </View>
              )}

              <View style={styles.editBadge}>
                <Ionicons
                  name="pencil"
                  size={td(12)}
                  color="#FFF"
                />
              </View>
            </TouchableOpacity>

            <Text style={styles.photoHint}>
              Toque para alterar a foto
            </Text>
          </View>

          <View style={styles.card}>
            <FormInput
              label="Nome Completo *"
              placeholder="Ex: Carlos Silva"
              value={name}
              onChangeText={(t) => {
                setName(t);
                setErrors((prev) => ({
                  ...prev,
                  name: false,
                }));
              }}
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
              placeholder="Ex: carlos@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setErrors((prev) => ({
                  ...prev,
                  email: false,
                }));
              }}
              error={errors.email}
            />
          </View>

          <View style={styles.card}>
            <FormSelectTile
              label="Horários de Trabalho"
              placeholder="Configurar grade"
              value={isEditing ? 'Ver horários' : 'Horário da Loja'}
              onPress={openOperatingHours}
            />
          </View>
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator
            size="large"
            color={Colors.corButton}
          />
        </View>
      )}

      <View style={styles.footer}>
        {isEditing && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={isPending}
          >
            <Ionicons
              name="trash-outline"
              size={td(22)}
              color="#F43F5E"
            />
          </TouchableOpacity>
        )}

        <Pressable
          style={[
            styles.saveButton,
            isPending && styles.saveButtonPending,
          ]}
          onPress={handleSave}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator
              color="#FFFFFF"
              size="small"
            />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditing
                ? 'Salvar Alterações'
                : 'Cadastrar Profissional'}
            </Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingVertical: l(10),
    gap: a(16),
    paddingBottom: a(30),
  },

  photoSection: {
    alignItems: 'center',
    paddingVertical: a(10),
  },

  photoContainer: {
    width: td(90),
    height: td(90),
    borderRadius: td(45),
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  photoFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: td(45),
  },

  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.corButton,
    width: td(26),
    height: td(26),
    borderRadius: td(13),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },

  photoHint: {
    marginTop: a(8),
    fontSize: td(13),
    fontFamily: fonts?.robotoRegular,
    color: Colors.corTextLight,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: td(12),
    paddingHorizontal: l(15),
    paddingVertical: a(10),
    gap: a(15),
    marginHorizontal: l(10),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },

  footer: {
    flexDirection: 'row',
    gap: l(12),
    backgroundColor: Colors.white,
    paddingHorizontal: l(16),
    paddingTop: a(12),
    paddingBottom: a(24),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },

  saveButton: {
    flex: 1,
    backgroundColor: Colors.corButton,
    height: a(44),
    borderRadius: td(10),
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteButton: {
    width: a(44),
    height: a(44),
    backgroundColor: '#FFF1F2',
    borderRadius: td(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },

  saveButtonPending: {
    opacity: 0.7,
  },

  saveButtonText: {
    fontSize: td(15),
    fontFamily: fonts?.robotoBold,
    color: '#FFFFFF',
  },
});