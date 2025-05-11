"use client";

import React from 'react';

const Button = ({ type, onClick, children }: { type: "button" | "submit" | "reset"; onClick?: () => void; children: React.ReactNode }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="button px-6 py-2 bg-blue-500 text-white font-medium rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {children}
    </button>
  );
};

export default Button;