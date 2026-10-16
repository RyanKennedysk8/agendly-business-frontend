const MONTHS_PT_BR = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ] as const;
  
  /**
   * Formata uma data para o padrão "Hoje", "Ontem" ou "DD Mês" (ex: "14 Out").
   * Trata strings YYYY-MM-DD em fuso local para evitar desvios de UTC.
   */
  export function formatDateLabel(dateInput: string | Date | number): string {
    let targetDate: Date;
  
    if (typeof dateInput === 'string') {
      // Se vier do backend como "YYYY-MM-DD", o construtor new Date() assume UTC,
      // o que no Brasil (UTC-3) voltaria 1 dia às 21h. Fazemos o parse manual local:
      const isoDateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateInput);
      if (isoDateOnlyMatch) {
        const [, year, month, day] = isoDateOnlyMatch;
        targetDate = new Date(Number(year), Number(month) - 1, Number(day));
      } else {
        targetDate = new Date(dateInput);
      }
    } else {
      targetDate = new Date(dateInput);
    }
  
    // Fallback de segurança caso a data seja inválida
    if (isNaN(targetDate.getTime())) {
      return '';
    }
  
    const now = new Date();
  
    // Normaliza ambas as datas para 00:00:00.000 no fuso horário local
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const targetMidnight = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate()
    ).getTime();
  
    // Diferença exata em dias (86.400.000 ms = 1 dia)
    const diffInDays = Math.round((todayMidnight - targetMidnight) / 86400000);
  
    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Ontem';
  
    // Caso queira adicionar suporte futuro para "Amanhã", basta descomentar:
    // if (diffInDays === -1) return 'Amanhã';
  
    const day = targetDate.getDate(); // Retorna 1 a 31 (ou use String(day).padStart(2, '0') se quiser "05 Set")
    const month = MONTHS_PT_BR[targetDate.getMonth()];
  
    return `${day} ${month}`;
  }