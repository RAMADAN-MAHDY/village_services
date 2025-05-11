"use client";

import React from 'react';

const ServiceCard = ({ image, title, description }: { image: string; title: string; description: string }) => {
  return (
    <div className="service-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img src={image || 'https://via.placeholder.com/150'} alt={title || 'عنوان الخدمة'} className="service-image w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title || 'عنوان الخدمة'}</h3>
        <p className="text-sm text-gray-600">{description || 'وصف الخدمة'}</p>
      </div>
    </div>
  );
};

export default ServiceCard;