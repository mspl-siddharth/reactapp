import React from "react";
import { useNavigate } from "react-router-dom";

const Demo = () => {
  const nav = useNavigate();

  return (
    <div>
      <button
        onClick={() => {
          nav("/dashboard");
        }}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow transition-all duration-300 my-6"
      >
        go back to dash
      </button>
    </div>
  );
};

export default Demo;
