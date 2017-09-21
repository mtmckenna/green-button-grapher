function peakDate(date) {
  const day = date.getDay();
  const hour = date.getHours();
  const weekday = day > 0 && day < 6;
  const peakHours = hour >= 13 && hour <= 19;
  return weekday && peakHours;
}

function weekend(date) {
  return date.getDay() === 6 || date.getDay() === 0;
}

function sameDay(date1, date2) {
  return date1.getDate() === date2.getDate()
    && date1.getMonth() === date2.getMonth()
    && date1.getFullYear() === date2.getFullYear();
}

export { peakDate, weekend, sameDay };
