export const isSameDate = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
export const daysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};
