export const getDayName = d => {
  var days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  return days[d.getDay()];
}

export const formatDate = (date) => {
  const day = String(date.getDate());
  const month = String(date.getMonth() + 1);
  const year = String(date.getFullYear());
  return `${year}-${month.padStart(2, 0)}-${day.padStart(2, 0)}`;
}

export const getWeekDays = (date) => {
  const dateObject = new Date(`${date} 00:00`);
  const startDate = new Date(dateObject.setDate(dateObject.getDate() - (dateObject.getDay() == 0 ? 6 : (dateObject.getDay() - 1))));
  let days = [1,2,3,4,5,6,7];
  return days.map((d) => {
    const tempDate = new Date(date);
    const fullDate = new Date(tempDate.setDate(tempDate.getDate() + d - tempDate.getDay()));
    const day = fullDate.getDate();
    return {
      day,
      dayName: getDayName(fullDate),
      date: formatDate(fullDate)
    };
  });
}

export const today = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2,'0');
  const day = String(date.getDate()).padStart(2,'0');
  return `${date.getFullYear()}-${month}-${day}`;
}