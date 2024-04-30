export const statusTranslated = (status: string) => {
  switch (status) {
    case "delivered":
      return "Entregado";
    case "pending":
      return "Pendiente";
    case "ongoing":
      return "En curso";
    default:
      return "Estado desconocido";
  }
};
