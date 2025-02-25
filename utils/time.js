const calculateDuration = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  let months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
    const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months > 0 && days > 0) return `${months} months, ${days} days`;
  if (months > 0) return `${months} months`;
  return `${days} days`;
};

module.exports = {
  calculateDuration,
};
