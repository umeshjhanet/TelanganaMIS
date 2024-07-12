// utils.js or at the top of your main file
export const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error("Invalid date object");
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};
