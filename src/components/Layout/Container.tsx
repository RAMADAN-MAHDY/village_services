"use client";

import React from 'react';

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="container bg-[#a3a1fd] mt-[70px]  mx-auto px-4 sm:px-6 lg:px-8 h-[100%]">{children}</div>;
};

export default Container; 