// 📌 Utility to get age range
export const formatAgeRange = (ages: number[]): string => {
  const min = Math.min(...ages);
  const max = Math.max(...ages);
  return `${min}-${max}`;
};
