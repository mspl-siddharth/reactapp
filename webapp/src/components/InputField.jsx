import React from "react";

const InputField = ({ type, name, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="p-2 border rounded mb-4 w-full"
    />
  );
};

export default InputField;
