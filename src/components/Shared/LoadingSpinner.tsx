"use client";

import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner flex justify-center items-center h-16 w-16">
      <div className="spinner animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );
};

export default LoadingSpinner;