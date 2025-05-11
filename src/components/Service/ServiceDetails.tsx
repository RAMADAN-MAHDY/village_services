"use client";

import React from 'react';

const ServiceDetails = ({ image, title, description }: { image: string; title: string; description: string }) => {
  return (
    <div className="service-details bg-white rounded-lg shadow-md p-6">
      <img src={image} alt={title} className="service-image w-full h-64 object-cover rounded-md mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 text-base">{description}</p>
    </div>
  );
};

export default ServiceDetails;