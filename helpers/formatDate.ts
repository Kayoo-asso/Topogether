export const formatDate = (date: String) => { // DB format : YYYY-MM-DD
  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);
  return `${day}-${month}-${year}`;
};
