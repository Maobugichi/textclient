export interface OptionTypes {
  label: string;
  value: string | number;
}


export const getPeriodOptions = (max: number): OptionTypes[] => {
  return Array.from({ length: max }, (_, i) => ({
    label: String(i + 1),
    value: i + 1,
  }));
};
