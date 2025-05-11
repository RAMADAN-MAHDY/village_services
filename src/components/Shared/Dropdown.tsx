"use client";

import React from 'react';

const Dropdown = ({ options, onSelect }: { options: string[]; onSelect: (option: string) => void }) => {
  return (
    <div className="dropdown relative inline-block text-left">
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
        Select an option
      </button>
      <div className="dropdown-menu absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => onSelect(option)}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;