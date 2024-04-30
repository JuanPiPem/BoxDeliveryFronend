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
