"use client";

import React, { useEffect, useState } from "react";
import ReactStars from "react-stars";

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

const ShowServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/GET_Router/Providingservice");
        const data = await response.json();

        // تحقق مما إذا كانت البيانات مصفوفة
        if (Array.isArray(data)) {
          setServices(data);
          setFilteredServices(data);

          // Extract unique categories
          const uniqueCategories = Array.from(new Set(data.map((service: Service) => service.category)));
          setCategories(uniqueCategories);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Handle category filter
  const handleFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === "") {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter((service) => service.category === category));
    }
  };

  if (loading) {
  return <p className="text-center">جاري التحميل...</p>;
}

  return (
    <div className="container mx-auto p-4 h-auto  ">
      <h1 className="text-2xl font-bold mb-4 text-center text-[#fff]">الخدمات المتاحة</h1>

      {/* Filter Dropdown */}
      <div className="mb-6 flex justify-center">
        <select
          value={selectedCategory}
          onChange={(e) => handleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500  bg-white shadow-[0px_4px_17px_rgba(55.45.40.0,5)] hover:shadow-[0px_14px_17px_rgba(55.45.40.0,5)]"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service._id}
            className=" bg-white rounded-lg shadow-[0px_4px_17px_rgba(55.45.40.0,5)] hover:shadow-[0px_14px_17px_rgba(55.45.40.0,5)] overflow-hidden border border-gray-200"
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
              <p className="text-sm text-gray-600 mb-4 truncate">{service.description}</p>

              {/* Contact Methods */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold">وسائل الاتصال:</h3>
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
                        href={`https://wa.me/${service.phone}`}
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
                <button
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded shadow hover:bg-blue-600"
                  onClick={() => console.log(`Details clicked for ${service._id}`)}
                >
                  عرض التفاصيل
                </button>

                {/* Rating */}
                <ReactStars
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