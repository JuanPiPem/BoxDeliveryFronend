export const getFormattedDate = () => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const monthNumber = currentDate.getMonth() + 1;
  const monthNumberFormat = String(monthNumber).padStart(2, "0");
  const month = currentDate
    .toLocaleString("es-Ar", { month: "long" })
    .toUpperCase();
  const dayOfWeek = currentDate
    .toLocaleString("es-Ar", { weekday: "short" })
    .slice(0, 3);
  const year = currentDate.getFullYear();
  return { year, month, day, dayOfWeek, monthNumberFormat };
};

export const currentDate = () => {
  const { day, year, monthNumberFormat } = getFormattedDate();
  const options = {
    timeZone: "America/Argentina/Buenos_Aires",
    hour12: false,
  };
  const time = new Date().toLocaleTimeString("es-AR", options);
  const currentDate = `${year}-${monthNumberFormat}-${day} ${time}`;
  return currentDate;
};

// funcion que recibe una fecha en este formato: aaaa-mm-dd y la devuelve asi: dd/mm/aaaa
export const formatDate = (date: string) => {
  const dateArray = date.split("-");
  const [year, month, day] = dateArray;
  return day + "/" + month + "/" + year;
};
export const isFutureDate = (date1: string, date2: string) => {
  const date1Array = date1.split("/");
  const date2Array = date2.split("/");
  const [day1, month1, year1] = date1Array;
  const [day2, month2, year2] = date2Array;
  if (parseFloat(year1) - parseFloat(year2) < 0) return false;
  if (parseFloat(year1) - parseFloat(year2) > 0) return true;

  if (parseFloat(month1) - parseFloat(month2) < 0) return false;
  if (parseFloat(month1) - parseFloat(month2) > 0) return true;

  if (parseFloat(day1) - parseFloat(day2) < 0) return false;
  else return true;
};
