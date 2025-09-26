import React from "react";

const InputField = ({ type, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="p-2 border rounded mb-4 w-full"
    />
  );
};

export default InputField;
