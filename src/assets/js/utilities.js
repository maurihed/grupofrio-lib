const d = new Date();
export const getCurrentDate = () => `${d.getFullYear()}-${(d.getMonth()+1+'').padStart(2, 0)}-${(d.getDate()+'').padStart(2, 0)}`;
export const plusDay = (fecha, day) => {
  const date = new Date(fecha);
  return new Date(date.setDate(date.getDate() + 1 + day)).getDate();
}
export const isToday = (someDate) => {
  if (typeof someDate === 'string') {
    someDate = new Date(someDate);
  }
  const today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}

export const numberToLetter = (number) => {
  if (Math.floor(number / 26) > 0) {
    return numberToLetter(number/26) + String.fromCharCode(65+(number % 26));
  }
  return String.fromCharCode(64 + number);
};

export const displayError = txt => {
  M.toast({
    html: txt,
    classes: "red darken-1",
    outDuration: 2000,
  });
};

export const displayMessage = txt => {
  M.toast({
    html: txt,
    classes: "green accent-4",
    outDuration: 3000,
  });
};