import React from "react";

const SelectInput = ({
  label = "Select Option",
  options = [],
  name,
  value,
  onChange = () => {},
  error = false,
  errorMessage = "",
  className = "w-full",
  "data-testid": dataTestId,
  ...rest // collect any additional props
}) => {
  return (
    <div className={className}>
      <label htmlFor={name} className="block mb-1 font-medium">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        data-testid={dataTestId}
        className={`w-full border rounded p-2 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...rest} // spread any additional props here
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </div>
  );
};

export default SelectInput;
