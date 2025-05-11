"use client";

import React from 'react';

const SearchBar = ({ placeholder , onChange}: { placeholder: string; onChange: (value: string) => void }) => {
  return (
    <div className="search-bar flex items-center bg-gray-100 rounded-md shadow-md p-2">
      <input
        type="text"
        placeholder={placeholder}
        className="flex-grow bg-transparent outline-none px-4 py-2 text-[#000]"
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        بحث
      </button>
    </div>
  );
};

export default SearchBar;