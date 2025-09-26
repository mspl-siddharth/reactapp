import React from "react";

const Button = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
    >
      {text}
    </button>
  );
};

export default Button;
