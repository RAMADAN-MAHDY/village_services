"use client";

import React from 'react';

const SectionTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <h2 className="section-title pt-6 text-2xl text-center font-semibold text-gray-800 mb-6 border-b-2 border-gray-300 pb-2">
      {title}
    </h2>
  );
};

export default SectionTitle; 