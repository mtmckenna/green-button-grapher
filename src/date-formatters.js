function datePad(number) {
  let string = number.toString();
  while (string.length < 2) string = 0 + string;
  return string;
}

function formattedDay(date) {
  const hour = date.getHours();
  return `${datePad(hour)}:00`;
}

function formattedFullDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  return `${year}/${datePad(month)}/${datePad(day)} ${datePad(hour)}:${datePad(minutes)}`;
}

export { formattedDay, formattedFullDate }

