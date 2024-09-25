export const formatNumber = (number: number) => {
  const formatter = new Intl.NumberFormat("en-US");
  return formatter.format(number);
};
