"use client";

import React, { useMemo, useState } from "react";
import ReactStars from "react-stars";
import useSWR from 'swr';
import Loading from '@/app/loading';
import ServiceDescription from '@/components/showSerices/ServiceDescription';

interface Service {
  _id: string;
  description: string;
  category: string;
  contactMethods: string[];
  phone: string;
  whatsapp: string;
  email: string;
  image?: string[];
}

// Fetcher function for SWR
const fetcher = async (url: string): Promise<Service[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch services');
  }
  const data = await response.json();
  
  // تحقق مما إذا كانت البيانات مصفوفة
  if (!Array.isArray(data)) {
    throw new Error('Unexpected data format');
  }
  
  return data;
};

const ShowServices: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // استخدام SWR لجلب البيانات
  const { data: services, error, isLoading } = useSWR(
    "/api/GET_Router/Providingservice",
    fetcher,
    {
      // خيارات SWR
      revalidateOnFocus: false, // عدم إعادة التحقق عند التركيز على النافذة
      revalidateOnReconnect: true, // إعادة التحقق عند الاتصال بالإنترنت
      dedupingInterval: 60000, // منع الطلبات المكررة لمدة دقيقة
      errorRetryCount: 3, // عدد محاولات إعادة المحاولة عند الخطأ
    }
  );

  // حساب الفئات الفريدة باستخدام useMemo
  const categories = useMemo(() => {
    if (!services) return [];
    return Array.from(new Set(services.map((service: Service) => service.category)));
  }, [services]);

  // تصفية الخدمات حسب الفئة المختارة
  const filteredServices = useMemo(() => {
    if (!services) return [];
    if (selectedCategory === "") {
      return services;
    }
    return services.filter((service) => service.category === selectedCategory);
  }, [services, selectedCategory]);

  // Handle category filter
  const handleFilter = (category: string) => {
    setSelectedCategory(category);
  };

  // معالجة حالة التحميل
  if (isLoading) {
    return <Loading />;
  }

  // معالجة حالة الخطأ
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>خطأ في تحميل البيانات: </strong>
          {error.message}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  // معالجة حالة عدم وجود بيانات
  if (!services || services.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          لا توجد خدمات متاحة حالياً
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 h-auto">
      <h1 className="text-3xl font-bold mb-4 text-center text-[#fff]">
        الخدمات المعروضة
      </h1>
      <h2 className="text-3xl mb-4 text-center text-[#ffffff]">
        في القسم ده هتلاقي خدمات معروضة من ناس حابة تساعد،
        لو في خدمة منهم مناسبة ليك، تقدر تتواصل مع صاحب الخدمة مباشرة.
      </h2>

      {/* Filter Dropdown */}
      <div className="mb-6 flex justify-center">
        <select
          value={selectedCategory}
          onChange={(e) => handleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-[0px_4px_17px_rgba(55.45.40.0,5)] hover:shadow-[0px_14px_17px_rgba(55.45.40.0,5)]"
        >
          <option value="">كل الفئات</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service._id}
            className="bg-white rounded-lg shadow-[0px_4px_17px_rgba(55.45.40.0,5)] hover:shadow-[0px_14px_17px_rgba(55.45.40.0,5)] overflow-hidden border border-gray-200"
          >
            {/* Image */}
            {service.image && service.image.length > 0 ? (
              <img
                src={service.image[0]}
                alt={service.category}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">لا توجد صورة</span>
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{service.category}</h2>
              <ServiceDescription description={service.description} />

              {/* Contact Methods */}
              <div className="mb-4">
                <h3 className="text-sm mt-3 text-[18px] font-semibold">وسائل الاتصال:</h3>
                <ul className="text-sm text-gray-600">
                  {service.contactMethods.includes("phone") && (
                    <li>
                      📞{" "}
                      <a
                        href={`tel:${service.phone}`}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {service.phone}
                      </a>
                    </li>
                  )}
                  {service.contactMethods.includes("whatsapp") && (
                    <li>
                      💬{" "}
                      <a
                        href={`https://wa.me/${service.whatsapp}`}
                        className="text-green-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        واتساب
                      </a>
                    </li>
                  )}
                  {service.contactMethods.includes("email") && (
                    <li>
                      📧{" "}
                      <a
                        href={`mailto:${service.email}`}
                        className="text-red-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {service.email}
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center">
                {/* Rating */}
                <ReactStars
                  className="ml-[35%]"
                  count={5}
                  size={24}
                  color2={"#ffd700"}
                  half={false}
                  onChange={(newRating: number) =>
                    console.log(`Rated ${newRating} stars for ${service._id}`)
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowServices;