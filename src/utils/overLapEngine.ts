import { AppointmentDetail } from '@/types/appointments';
import { DimensionValue } from 'react-native';
// Certifique-se de que MINUTE_HEIGHT está sendo importado corretamente do seu arquivo de métricas
import { MINUTE_HEIGHT } from './calendarMetrics'; 

export type RenderableAppointment = AppointmentDetail & {
    layout: {
        top: number;
        height: number;
        left: DimensionValue;
        width: DimensionValue;
        zIndex: number;
    };
};

export function processEmployeeAppointments(
    appointments: any[], 
    employeeId: string, 
    targetDate: Date, 
    startHour: number
): RenderableAppointment[] {
    if (!appointments || appointments.length === 0) return [];

    // 1. Filtro Duplo: Por Funcionário E pela Data Exata da Página (PagerView)
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    const employeeAppointments = appointments.filter(a => {
        // Suporta tanto o DTO antigo (objeto aninhado) quanto o novo (ID direto)
        const currentEmpId = a.employeeId || (a.employee && a.employee.id);
        if (currentEmpId !== employeeId) return false;

        const apptDate = new Date(a.startTime);
        return (
            apptDate.getFullYear() === targetYear &&
            apptDate.getMonth() === targetMonth &&
            apptDate.getDate() === targetDay
        );
    });

    if (employeeAppointments.length === 0) return [];

    // Ordenação Cronológica O(N log N)
    const sorted = [...employeeAppointments].sort((a, b) => {
        const startDiff = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        if (startDiff === 0) {
            const durA = a.serviceDuration || 0;
            const durB = b.serviceDuration || 0;
            return durB - durA; // Os mais longos ficam atrás
        }
        return startDiff;
    });

    const clusters: RenderableAppointment[][] = [];
    let currentCluster: RenderableAppointment[] = [];
    let clusterEndTime = 0;
    const CARD_GAP = 0;

    // Agrupamento de Colisões (Clusters) e Cálculo Y ancorado no startHour
    sorted.forEach(appt => {
        const startDate = new Date(appt.startTime);
        const startMs = startDate.getTime();
        const endMs = new Date(appt.endTime).getTime();
        
        const duration = appt.serviceDuration || ((endMs - startMs) / 60000);

        // Subtrai o startHour para alinhar o top=0 com o início do grid
        const top = ((startDate.getHours() - startHour) * 60 + startDate.getMinutes()) * MINUTE_HEIGHT + CARD_GAP;

        const height = Math.max(duration * MINUTE_HEIGHT - 0, 10);
        
        const renderable: RenderableAppointment = {
            ...appt,
            layout: { top, height, left: '0%', width: '100%', zIndex: 1 }
        };

        if (currentCluster.length > 0 && startMs >= clusterEndTime) {
            clusters.push(currentCluster);
            currentCluster = [];
        }
        currentCluster.push(renderable);
        clusterEndTime = Math.max(clusterEndTime, endMs);
    });

    if (currentCluster.length > 0) {
        clusters.push(currentCluster);
    }

    // Distribuição Horizontal (Column Packing original mantido)
    const finalLayout: RenderableAppointment[] = [];

    clusters.forEach(cluster => {
        const columns: RenderableAppointment[][] = [];

        cluster.forEach(appt => {
            let placed = false;
            
            for (let i = 0; i < columns.length; i++) {
                const col = columns[i];
                const lastInCol = col[col.length - 1];
                const lastEndMs = new Date(lastInCol.endTime).getTime();
                const currentStartMs = new Date(appt.startTime).getTime();

                if (currentStartMs >= lastEndMs) {
                    col.push(appt);
                    placed = true;
                    break;
                }
            }
            
            if (!placed) {
                columns.push([appt]); 
            }
        });

        const colCount = columns.length;
        const widthPct = 100 / colCount;
        const GAP_PERCENT = 0;
        
        columns.forEach((col, colIndex) => {
            col.forEach(appt => {
                appt.layout.width = `${widthPct - GAP_PERCENT}%`;
                appt.layout.left = `${colIndex * widthPct}%`;
                appt.layout.zIndex = colIndex + 1; 
                finalLayout.push(appt);
            });
        });
    });

    return finalLayout;
}