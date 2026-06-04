import { AppointmentDetail } from '@/types/appointments';
import { MINUTE_HEIGHT } from './calendarMetrics';
import { DimensionValue } from 'react-native';

export type RenderableAppointment = AppointmentDetail & {
    layout: {
        top: number;
        height: number;
        left: DimensionValue;
        width: DimensionValue;
        zIndex: number;
    };
};

export function processDayAppointments(appointments: AppointmentDetail[]): RenderableAppointment[] {
    if (!appointments || appointments.length === 0) return [];

    // Ordenação Cronológica (O(N log N))
    const sorted = [...appointments].sort((a, b) => {
        const startDiff = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        if (startDiff === 0) {
            return b.serviceDuration - a.serviceDuration; // Os mais longos ficam atrás
        }
        return startDiff;
    });

    const clusters: RenderableAppointment[][] = [];
    let currentCluster: RenderableAppointment[] = [];
    let clusterEndTime = 0;

    // 2. Agrupamento de Colisões (Clusters)
    sorted.forEach(appt => {
        const startDate = new Date(appt.startTime);
        const startMs = startDate.getTime();
        const endMs = new Date(appt.endTime).getTime();

        const top = (startDate.getHours() * 60 + startDate.getMinutes()) * MINUTE_HEIGHT;
        const height = appt.serviceDuration * MINUTE_HEIGHT;

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

    // 3. Distribuição Horizontal (Column Packing)
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

                // Se o atual começa no mesmo momento ou após o fim do anterior na coluna, encaixa.
                if (currentStartMs >= lastEndMs) {
                    col.push(appt);
                    placed = true;
                    break;
                }
            }
            
            if (!placed) {
                columns.push([appt]); // Nova coluna na cascata
            }
        });

        const colCount = columns.length;
        const widthPct = 100 / colCount;

        columns.forEach((col, colIndex) => {
            col.forEach(appt => {
                // Largura ajustada para 95% para não colar no card ao lado (efeito cascata fluido)
                appt.layout.width = `${widthPct * 0.95}%`; 
                appt.layout.left = `${colIndex * widthPct}%`;
                appt.layout.zIndex = colIndex + 1; 
                finalLayout.push(appt);
            });
        });
    });

    return finalLayout;
}