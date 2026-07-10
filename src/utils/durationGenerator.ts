export interface DurationOption {
    id: string;
    name: string;
    minutes: number;
  }
  
  export function generateOptimizedDurations(): DurationOption[] {
    const options: DurationOption[] = [];
  
    // Faixa 1: Até 1h (0 a 55 min) -> Intervalos de 5 em 5 minutos
    for (let min = 5; min < 60; min += 5) {
      options.push({ id: String(min), name: `${min} minutos`, minutes: min });
    }
  
    // Faixa 2: De 1h até 2h (60 a 115 min) -> Intervalos de 15 em 15 minutos
    for (let min = 60; min < 120; min += 15) {
      const h = Math.floor(min / 60);
      const m = min % 60;
      const name = m > 0 ? `${h}h ${m}m` : `${h} hora`;
      options.push({ id: String(min), name, minutes: min });
    }
  
    // Faixa 3: De 2h até 3h (120 a 175 min) -> Intervalos de 30 em 30 minutos
    for (let min = 120; min < 180; min += 30) {
      const h = Math.floor(min / 60);
      const m = min % 60;
      const name = m > 0 ? `${h}h ${m}m` : `${h} horas`;
      options.push({ id: String(min), name, minutes: min });
    }
  
    // Faixa 4: De 3h até 6h (180 a 355 min) -> Intervalos de 30 em 30 minutos
    for (let min = 180; min < 360; min += 30) {
      const h = Math.floor(min / 60);
      const m = min % 60;
      const name = m > 0 ? `${h}h ${m}m` : `${h} horas`;
      options.push({ id: String(min), name, minutes: min });
    }
  
    // Faixa 5: De 6h até 10h (360 a 600 min) -> Intervalos de 1h em 1h
    for (let min = 360; min <= 600; min += 60) {
      const h = Math.floor(min / 60);
      options.push({ id: String(min), name: `${h} horas`, minutes: min });
    }
  
    return options;
  }