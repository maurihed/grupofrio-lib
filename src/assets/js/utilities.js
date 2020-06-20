const d = new Date();
export const getCurrentDate = () => `${d.getFullYear()}-${(d.getMonth()+1+'').padStart(2, 0)}-${(d.getDate()+'').padStart(2, 0)}`;
export const plusDay = (fecha, day) => {
  const date = new Date(fecha);
  return new Date(date.setDate(date.getDate() + 1 + day)).getDate();
}