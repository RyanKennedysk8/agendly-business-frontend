export interface ClientsDTO {
    id: string;
    name: string;
    phone: string;
    lastVisit?: string;
    totalVisits: number;
}

export const MOCK_CLIENTS: ClientsDTO[] = [
    { 
        id: '1', 
        name: 'Ana Souza', 
        phone: '(31) 98888-1111', 
        lastVisit: '10/05/2026', 
        totalVisits: 12 
    },
    { 
        id: '2', 
        name: 'Carlos Silva', 
        phone: '(31) 97777-2222', 
        lastVisit: '02/05/2026', 
        totalVisits: 3 
    },
    { 
        id: '3', 
        name: 'Beatriz Lima', 
        phone: '(31) 96666-3333', 
        lastVisit: '25/04/2026', 
        totalVisits: 1 
    },
    { 
        id: '4', 
        name: 'Roberto Mendes', 
        phone: '(31) 95555-4444', 
        lastVisit: '15/04/2026', 
        totalVisits: 8 
    },
    { 
        id: '5', 
        name: 'Fernanda Costa', 
        phone: '(31) 94444-5555', 
        totalVisits: 0 
    }, // Cliente novo, sem visita
    { 
        id: '6', 
        name: 'João Pedro', 
        phone: '(31) 93333-6666', 
        lastVisit: '01/03/2026', 
        totalVisits: 25 
    },
  ];