export function dateToTimestamp(date: Date): number {
    return Math.floor(date.getTime() / 1000);
}

export function timestampToDate(timestamp: number): Date {
    return new Date(timestamp * 1000);
}

export function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function formatDateTime(date: Date): string {
    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function startOfDay(date: Date = new Date()): Date {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

export function endOfDay(date: Date = new Date()): Date {
  const result = new Date(date);
  
  result.setHours(23, 59, 59, 999);

  return result;
}

export function startOfMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}
