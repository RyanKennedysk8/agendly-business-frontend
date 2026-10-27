
export function formatDuration(durationInMinutes: number): string {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
  
    if (hours === 0) {
      return `${minutes} min`;
    }
  
    if (minutes === 0) {
      return `${hours}h`;
    }
  
    return `${hours}h e ${minutes}min`;
  }
  