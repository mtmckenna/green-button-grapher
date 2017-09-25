function datePad(number) {
  let string = number.toString();
  while (string.length < 2) string = 0 + string;
  return string;
}

function formattedDay(date) {
  let hour = date.getHours();
  let amPm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;
  return `${datePad(hour)}:00 ${amPm}`;
}

function formattedFullDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${year}/${datePad(month)}/${datePad(day)}`;
}

export { formattedDay, formattedFullDate }

