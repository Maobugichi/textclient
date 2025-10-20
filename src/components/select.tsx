

import React from "react";
import ReactSelect from "react-select";
import { useTheme } from "next-themes";

export interface OptionType {
  label: string;
  value: string | number;
}

interface SelectProps {
  options: OptionType[];
  onChange?: (selectedOption: OptionType | null) => void;
  id?: string;
  className?: string;
  value?: OptionType | null;
  isDisabled?: boolean;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  onChange,
  id,
  className,
  value,
  isDisabled,
  placeholder,
}) => {
  const { theme } = useTheme(); 
  const isDark = theme === "dark";

  return (
    <div id={id} className={`w-[95%] mx-auto font-normal ${className} rounded-xl`}>
      <ReactSelect
        isDisabled={isDisabled}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder || "Select..."}
        classNames={{
          control: (state) =>
            `p-1 border text-sm rounded-xl min-h-[48px] ${
              isDark
                ? "bg-[#242424] text-white border-blue-100"
                : "bg-white border-gray-300"
            } ${state.isFocused ? "ring-2 ring-blue-500" : ""}`,
          menu: () =>
            `${isDark ? "bg-[#1e1e1e] text-white" : "bg-white text-gray-800"} rounded-lg border mt-1`,
          option: () =>
            `${
              isDark
                ? "hover:bg-gray-700 text-white"
                : "hover:bg-gray-100 text-gray-900"
            } cursor-pointer px-2 py-1 text-sm`,
        }}
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: isDark ? "#242424" : "white",
            borderColor: isDark ? "#3b82f6" : "#d1d5db",
            boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
            borderRadius: "0.75rem",
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: isDark ? "#1e1e1e" : "white",
          }),
          singleValue: (base) => ({
            ...base,
            color: isDark ? "white" : "black",
          }),
          placeholder: (base) => ({
            ...base,
            color: isDark ? "#9ca3af" : "#6b7280",
          }),
        }}
        isSearchable
      />
    </div>
  );
};

export default Select;
