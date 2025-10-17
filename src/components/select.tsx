import React from "react";
import ReactSelect from "react-select";

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
  theme: boolean;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  options ,
  onChange,
  id,
  className,
  value,
  isDisabled,
  theme,
  placeholder
}) => {
  
  return (
    <div id={id} className={`w-[95%]  mx-auto font-normal ${className} rounded-xl`}>
      <ReactSelect
        isDisabled={isDisabled}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder || "Select..."}
        classNames={{
          control: (state) =>
            `p-1 border text-sm rounded-xl min-h-[48px] ${theme ? "bg-transparent border-blue-200" : "bg-white border-gray-300"} ${state.isFocused ? "ring-2 ring-blue-500" : ""}`,
        }}
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: theme ? "transparent" : "white",
            borderColor: theme ? "#bfdbfe" : "#d1d5db",
            minHeight: "48px",
            boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
            borderRadius: "0.75rem",
          }),
        }}
        isSearchable
      />
    </div>
  );
};

export default Select;
