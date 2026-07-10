import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, Pressable, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { useServiceMutations} from '@/hooks/useServiceMutations';
import { useCompanyCategories } from '@/hooks/useCompanyCategories';
import { useCompanyEmployees } from '@/hooks/useCompanyEmployees';
import { useCompanyServices } from '@/hooks/useCompanyServices';
import { ServiceRequestDTO } from '@/types/company';
import { BottomSheetSelect } from '@/components/shared/BottomSheetSelect';
import { generateOptimizedDurations } from '@/utils/durationGenerator';
import { DropdownSelect } from '@/components/shared/DropdownSelect';

export default function NovoServicoScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const isEditing = !!id;

    const { createService, updateService, deleteService } = useServiceMutations();
    
    const { data: categoriesData = [] } = useCompanyCategories();
    const { data: employeesData = [] } = useCompanyEmployees();
    const { data: services = [] } = useCompanyServices();

    const durationOptions = useMemo(() => generateOptimizedDurations().map(d => ({ id: d.id, name: d.name })), []);
    const categoryOptions = useMemo(() => categoriesData.map(c => ({ id: c.id, name: c.name })), [categoriesData]);
    
    const employeeOptions = useMemo(() => {
        return [
            { id: 'ALL', name: 'Todos (Padrão)' },
            ...employeesData.map(e => ({ id: e.id, name: e.name }))
        ];
    }, [employeesData]);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [durationId, setDurationId] = useState<string>(''); 
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [employeeIds, setEmployeeIds] = useState<string[]>(['ALL']); // Padrão
    const [isHomeService, setIsHomeService] = useState(false);
    const [isPetService, setIsPetService] = useState(false);

    useEffect(() => {
        if (isEditing && id && services.length > 0) {
            const serviceToEdit = services.find(s => s.id === id);
            if (serviceToEdit) {
                setName(serviceToEdit.name);
                setDurationId(serviceToEdit.durationInMinutes.toString());
                setIsHomeService(serviceToEdit.isHomeService);
                setIsPetService(serviceToEdit.isPetService);
                if (serviceToEdit.categoryId) setCategoryId(serviceToEdit.categoryId);
                
                // Se no banco vier vazio/nulo, mapeamos para TODOS. Caso contrário, setamos os IDs.
                if (!serviceToEdit.employeeIds || serviceToEdit.employeeIds.length === 0) {
                    setEmployeeIds(['ALL']);
                } else {
                    setEmployeeIds(serviceToEdit.employeeIds);
                }

                setPrice(serviceToEdit.price.toFixed(2).replace('.', ','));
            }
        }
    }, [isEditing, id, services]);

    const handlePriceChange = (text: string) => {
        const rawText = text.replace(/\D/g, '');
        if (!rawText) { setPrice(''); return; }
        const numericValue = (Number(rawText) / 100).toFixed(2);
        setPrice(numericValue.replace('.', ','));
    };

    const handleSave = async () => {
        if (!name.trim() || !price || !durationId) return;

        // Se a opção selecionada for ALL, enviamos array vazio para o Backend
        const payloadEmployeeIds = employeeIds.includes('ALL') ? [] : employeeIds;

        const payload: ServiceRequestDTO = {
            name: name.trim(),
            price: parseFloat(price.replace(',', '.')),
            durationInMinutes: parseInt(durationId, 10),
            categoryId,
            employeeIds: payloadEmployeeIds,
            isHomeService,
            isPetService
        };

        try {
            if (isEditing) {
                await updateService.mutateAsync({ id: id as string, data: payload });
            } else {
                await createService.mutateAsync(payload);
            }
            router.back();
        } catch (error) {
            console.error("Falha ao salvar serviço", error);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Excluir Serviço",
            "Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Excluir", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await deleteService.mutateAsync(id as string);
                            router.back();
                        } catch (error) {
                            console.error("Falha ao excluir", error);
                        }
                    } 
                }
            ]
        );
    };

    const formatDurationForDisplay = (min: number) => {
        if (min === 0) return 'Selecione o tempo';
        const h = Math.floor(min / 60);
        const m = min % 60;
        return (h > 0 ? `${h}h ` : '') + (m > 0 ? `${m}min` : '').trim();
    };

    const isPending = createService.isPending || updateService.isPending || deleteService.isPending;

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Stack.Screen options={{ 
                headerType:"custom",
                headerTitle: isEditing ? 'Editar Serviço' : 'Novo Serviço',
                headerRight: () => isEditing ? (
                    <TouchableOpacity style={styles.headerRightIcon} onPress={handleDelete} disabled={isPending} hitSlop={15}>
                        <Ionicons name="trash-outline" size={td(22)} color="#EF4444" />
                    </TouchableOpacity>
                ) : null
            }as any} />

            <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            >
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome do Serviço *</Text>
                    <TextInput style={styles.input} placeholder="Ex: Corte Degrade" value={name} onChangeText={setName} placeholderTextColor={Colors.placeholder} />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: l(10) }]}>
                        <Text style={styles.label}>Preço (R$) *</Text>
                        <TextInput 
                        style={styles.input} 
                        placeholder="0,00" 
                        keyboardType="numeric" 
                        value={price} 
                        onChangeText={handlePriceChange} 
                        placeholderTextColor={Colors.placeholder} 
                        
                        />
                    </View>

                    <View style={[{ flex: 1 }]}>
                        <DropdownSelect
                            label="Duração *"
                            options={durationOptions}
                            selectedValue={durationId}
                            onSelect={setDurationId}
                            placeholder="Tempo"
                        />
                    </View>
                </View>

                <DropdownSelect
                    label="Categoria do Cardápio"
                    options={categoryOptions}
                    selectedValue={categoryId}
                    onSelect={setCategoryId}
                    placeholder="Selecione a categoria"
                />

                <DropdownSelect
                    label="Profissionais Habilitados"
                    options={employeeOptions}
                    multiSelect={true}
                    selectedValues={employeeIds}
                    onMultiSelect={setEmployeeIds}
                    placeholder="Selecionar profissionais"
                />

                <View style={styles.switchGroup}>
                    <View style={styles.switchTextContainer}>
                        <Text style={styles.switchTitle}>Atendimento em Domicílio</Text>
                        <Text style={styles.switchSubtitle}>O profissional vai até o endereço do cliente.</Text>
                    </View>
                    <Switch value={isHomeService} onValueChange={setIsHomeService} trackColor={{ true: '#FF7A00', false: '#E2E8F0' }} />
                </View>

                <View style={styles.switchGroup}>
                    <View style={styles.switchTextContainer}>
                        <Text style={styles.switchTitle}>Serviço para Pets</Text>
                        <Text style={styles.switchSubtitle}>Exige a seleção de um animal no agendamento.</Text>
                    </View>
                    <Switch value={isPetService} onValueChange={setIsPetService} trackColor={{ true: '#FF7A00', false: '#E2E8F0' }} />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Pressable 
                    style={[styles.saveButton, (!name || !price || !durationId) && styles.saveButtonDisabled]} 
                    onPress={handleSave}
                    disabled={isPending || !name || !price || !durationId}
                >
                    {isPending ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.saveButtonText}>Salvar Serviço</Text>}
                </Pressable>
            </View>
            
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    scrollContent: { padding: l(20), paddingBottom: a(120) },
    inputGroup: { marginBottom: a(20) },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    label: { fontSize: td(14), fontFamily: fonts?.robotoMedium || 'System', color: '#334155', marginBottom: a(8) },
    input: { height: a(48), backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: td(10), paddingHorizontal: l(16), fontSize: td(15), color: '#0F172A' },
    selectButton: { height: a(48), backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: td(10), paddingHorizontal: l(16), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    selectButtonText: { fontSize: td(15), fontFamily: fonts?.robotoRegular || 'System', color: '#94A3B8' },
    selectButtonTextActive: { color: '#0F172A', fontFamily: fonts?.robotoMedium || 'System' },
    switchGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: a(16), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    switchTextContainer: { flex: 1, paddingRight: l(16) },
    switchTitle: { fontSize: td(15), fontFamily: fonts?.robotoMedium || 'System', color: '#0F172A', marginBottom: a(4) },
    switchSubtitle: { fontSize: td(13), fontFamily: fonts?.robotoRegular || 'System', color: '#64748B' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: l(20), backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
    saveButton: { height: a(50), backgroundColor: '#FF7A00', borderRadius: td(12), justifyContent: 'center', alignItems: 'center' },
    saveButtonDisabled: { backgroundColor: '#CBD5E1' },
    saveButtonText: { fontSize: td(16), fontFamily: fonts?.robotoBold || 'System', color: '#FFFFFF' },
    headerRightIcon:{width:td(50), justifyContent:"center", alignItems:"flex-end"}
});