export function checkIsSameDay(date1: Date, date2: Date): boolean {
  const offsetHours = 3; // Для того, чтобы день заканчивался в 00:00 по МСК

  // Создаем новые объекты Date с добавлением оффсета в часах
  const adjustedDate1 = new Date(date1);
  adjustedDate1.setHours(adjustedDate1.getHours() + offsetHours);

  const adjustedDate2 = new Date(date2);
  adjustedDate2.setHours(adjustedDate2.getHours() + offsetHours);

  // Преобразуем даты в ISO строки и берём только YYYY-MM-DD часть
  const date1UTC = adjustedDate1.toISOString().split('T')[0];
  const date2UTC = adjustedDate2.toISOString().split('T')[0];
  
  return date1UTC === date2UTC;
}
