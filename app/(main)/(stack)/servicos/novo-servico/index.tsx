import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, Pressable, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { useServiceMutations } from '@/hooks/useServiceMutations';
import { useCompanyCategories } from '@/hooks/useCompanyCategories';
import { useCompanyEmployees } from '@/hooks/useCompanyEmployees';
import { ServiceRequestDTO } from '@/types/company';
import { BottomSheetSelect } from '@/components/shared/BottomSheetSelect';
import { EditeProfileHeader } from '@/components/layout/header';
import { useCompanyServices } from '@/hooks/useCompanyServices';

const DURATION_OPTIONS = [
    { id: '15', name: '15 minutos' },
    { id: '30', name: '30 minutos' },
    { id: '45', name: '45 minutos' },
    { id: '60', name: '1 hora' },
    { id: '75', name: '1h 15m' },
    { id: '90', name: '1h 30m' },
    { id: '120', name: '2 horas' },
    { id: '150', name: '2h 30m' },
    { id: '180', name: '3 horas' },
];

export default function NovoServicoScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const isEditing = !!id;
    const onBack = () => router.back();

    const { createService, updateService } = useServiceMutations();
    
    // Requisições cacheadas (Background fetching)
    const { data: categories = [] } = useCompanyCategories();
    const { data: employees = [] } = useCompanyEmployees();
    const { data: services = [] } = useCompanyServices();

    // Estados do Formulário
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [isHomeService, setIsHomeService] = useState(false);
    const [isPetService, setIsPetService] = useState(false);
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [employeeIds, setEmployeeIds] = useState<string[]>([]);

    // Estados de Controle dos Modais
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
    

    // EFEITO DE PREENCHIMENTO: Roda apenas uma vez se for modo edição
    useEffect(() => {
        if (isEditing && id && services.length > 0) {
            const serviceToEdit = services.find(s => s.id === id);
            if (serviceToEdit) {
                setName(serviceToEdit.name);
                setDuration(serviceToEdit.durationInMinutes.toString());
                setIsHomeService(serviceToEdit.isHomeService);
                setIsPetService(serviceToEdit.isPetService);
                if (serviceToEdit.categoryId) setCategoryId(serviceToEdit.categoryId);
                if (serviceToEdit.employeeIds) setEmployeeIds(serviceToEdit.employeeIds);
                
                // Formata o preço vindo do banco (ex: 45.5 -> "45,50")
                setPrice(serviceToEdit.price.toFixed(2).replace('.', ','));
            }
        }
    }, [isEditing, id, services]);

    // MÁSCARA FINANCEIRA: Formata de trás pra frente (ex: 1500 vira 15,00)
    const handlePriceChange = (text: string) => {
        const rawText = text.replace(/\D/g, ''); // Remove tudo que não for número
        if (!rawText) {
            setPrice('');
            return;
        }
        const numericValue = (Number(rawText) / 100).toFixed(2);
        setPrice(numericValue.replace('.', ','));
    };

    const handleSave = async () => {
        if (!name.trim() || !price || !duration) return;

        const payload: ServiceRequestDTO = {
            name: name.trim(),
            price: parseFloat(price.replace(',', '.')),
            durationInMinutes: parseInt(duration, 10),
            categoryId,
            employeeIds,
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

    const isPending = createService.isPending || updateService.isPending;

    // Utilitários visuais para as labels dos botões
    const selectedCategoryName = categories.find(c => c.id === categoryId)?.name || 'Nenhuma categoria';
    const selectedDurationName = DURATION_OPTIONS.find(d => d.id === duration)?.name || (duration ? `${duration} min` : 'Selecione o tempo');
    const selectedEmployeesText = employeeIds.length > 0 
        ? `${employeeIds.length} selecionado(s)` 
        : 'Todos (Padrão)';

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <EditeProfileHeader
            onBack={onBack}
            title={isEditing ? 'Editar Serviço' : 'Novo Serviço'}/>

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome do Serviço *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Corte Degrade"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor={Colors.placeholder}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: l(10) }]}>
                        <Text style={styles.label}>Preço (R$) *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0,00"
                            keyboardType="numeric"
                            value={price}
                            onChangeText={handlePriceChange} // Aplica a máscara aqui
                            placeholderTextColor={Colors.placeholder}
                        />
                    </View>

                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Duração *</Text>
                        <TouchableOpacity style={styles.selectButton} activeOpacity={0.7} onPress={() => setIsDurationModalOpen(true)}>
                            <Text style={[styles.selectButtonText, duration ? styles.selectButtonTextActive : {}]}>
                                {selectedDurationName}
                            </Text>
                            <Ionicons name="time-outline" size={td(20)} color="#64748B" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Categoria do Cardápio</Text>
                    <TouchableOpacity style={styles.selectButton} activeOpacity={0.7} onPress={() => setIsCategoryModalOpen(true)}>
                        <Text style={[styles.selectButtonText, categoryId ? styles.selectButtonTextActive : {}]}>
                            {selectedCategoryName}
                        </Text>
                        <Ionicons name="chevron-down" size={td(20)} color="#64748B" />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Profissionais Habilitados</Text>
                    <TouchableOpacity style={styles.selectButton} activeOpacity={0.7} onPress={() => setIsEmployeeModalOpen(true)}>
                        <Text style={[styles.selectButtonText, employeeIds.length > 0 ? styles.selectButtonTextActive : {}]}>
                            {selectedEmployeesText}
                        </Text>
                        <Ionicons name="people-outline" size={td(20)} color="#64748B" />
                    </TouchableOpacity>
                </View>

                <View style={styles.switchGroup}>
                    <View style={styles.switchTextContainer}>
                        <Text style={styles.switchTitle}>Atendimento em Domicílio</Text>
                        <Text style={styles.switchSubtitle}>O profissional vai até o endereço do cliente.</Text>
                    </View>
                    <Switch
                        value={isHomeService}
                        onValueChange={setIsHomeService}
                        trackColor={{ true: Colors.corButton, false: Colors.corContainer }}
                    />
                </View>

                <View style={styles.switchGroup}>
                    <View style={styles.switchTextContainer}>
                        <Text style={styles.switchTitle}>Serviço para Pets</Text>
                        <Text style={styles.switchSubtitle}>Exige a seleção de um animal no agendamento.</Text>
                    </View>
                    <Switch
                        value={isPetService}
                        onValueChange={setIsPetService}
                        trackColor={{ true: Colors.corButton, false: Colors.corContainer }}
                    />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Pressable 
                    style={[styles.saveButton, (!name || !price || !duration) && styles.saveButtonDisabled]} 
                    onPress={handleSave}
                    disabled={isPending || !name || !price || !duration}
                >
                    {isPending ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>Salvar Serviço</Text>
                    )}
                </Pressable>
            </View>

            <BottomSheetSelect
                isVisible={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                title="Selecione a Categoria"
                data={categories}
                selectedIds={categoryId ? [categoryId] : []}
                onSelect={(ids) => setCategoryId(ids[0] || null)}
                multiSelect={false}
            />

            <BottomSheetSelect
                isVisible={isEmployeeModalOpen}
                onClose={() => setIsEmployeeModalOpen(false)}
                title="Profissionais Habilitados"
                data={employees}
                selectedIds={employeeIds}
                onSelect={setEmployeeIds}
                multiSelect={true}
            />

            <BottomSheetSelect
                isVisible={isDurationModalOpen}
                onClose={() => setIsDurationModalOpen(false)}
                title="Duração do Serviço"
                data={DURATION_OPTIONS}
                selectedIds={duration ? [duration] : []}
                onSelect={(ids) => setDuration(ids[0] || '')}
                multiSelect={false}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingTop:30, 
        backgroundColor: '#FFFFFF' 
    },
    scrollContent: { 
        padding: l(20), 
        paddingBottom: a(120) 
    }, 
    inputGroup: { 
        marginBottom: a(20) 
    },
    row: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    label: { 
        fontSize: td(14), 
        fontFamily: fonts?.robotoMedium || 'System', 
        color: '#334155', 
        marginBottom: a(8) 
    },
    input: { height: a(48), backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: td(10), paddingHorizontal: l(16), fontSize: td(15), color: '#0F172A' },
    selectButton: { height: a(48), backgroundColor: Colors.corContainer, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: td(10), paddingHorizontal: l(16), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    selectButtonText: { fontSize: td(15), fontFamily: fonts?.robotoRegular || 'System', color: '#94A3B8' },
    selectButtonTextActive: { color: '#0F172A', fontFamily: fonts?.robotoMedium || 'System' },
    switchGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: a(16), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    switchTextContainer: { flex: 1, paddingRight: l(16) },
    switchTitle: { fontSize: td(15), fontFamily: fonts?.robotoMedium || 'System', color: '#0F172A', marginBottom: a(4) },
    switchSubtitle: { fontSize: td(13), fontFamily: fonts?.robotoRegular || 'System', color: '#64748B' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: l(20), backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
    saveButton: { height: a(50), backgroundColor: '#FF7A00', borderRadius: td(12), justifyContent: 'center', alignItems: 'center' },
    saveButtonDisabled: { backgroundColor: '#CBD5E1' },
    saveButtonText: { fontSize: td(16), fontFamily: fonts?.robotoBold || 'System', color: '#FFFFFF' }
});