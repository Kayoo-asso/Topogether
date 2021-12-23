export const formatDate = (date: Date) => {
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  const year = (`0${date.getFullYear()}`).slice(-2);
  return `${day}-${month}-${year}`;
};
