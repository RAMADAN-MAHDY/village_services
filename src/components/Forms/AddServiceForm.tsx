"use client";
import { FaCamera } from "react-icons/fa"; 

import React, { useState } from "react";

const AddServiceForm: React.FC<{
  onSubmit: (service: {
    description: string;
    image?: File;
    phone: string;
    category: string;
    contactMethods: string[];
    whatsapp?: string;
    email?: string;
  }) => void;
}> = ({ onSubmit }) => {
    
  const [description, setDescription] = useState("Service Description");
  const [image, setImage] = useState<File>();
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [contactMethods, setContactMethods] = useState<string[]>([]);
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [loading , setloading] = useState<boolean>(false);
const [successMessage, setSuccessMessage] = useState<boolean>(false);

  const categories = [
    "Restaurants",
    "Medical Services",
    "Technical Services",
    "Handicrafts",
    "Freelance Work",
    "Delivery",
    "Workshops",
    "Education",
    "Other",
  ];

  const handleContactMethodChange = (method: string) => {
    setContactMethods((prevMethods) =>
      prevMethods.includes(method)
        ? prevMethods.filter((item) => item !== method)
        : [...prevMethods, method]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     setloading(true)
    // تحقق من وجود طريقة واحدة على الأقل للتواصل
    if (
      !contactMethods.includes("phone") &&
      !contactMethods.includes("whatsapp") &&
      !contactMethods.includes("email")
    ) {
      alert("You must select at least one contact method (Phone, WhatsApp, or Email).");
      return;
    }

    const finalCategory = category === "Other" ? customCategory : category;

    const formData = new FormData();
    formData.append("description", description);
    formData.append("phone", phone);
    formData.append("category", finalCategory);
    formData.append("contactMethods", JSON.stringify(contactMethods));
    formData.append("whatsapp", whatsapp);
    formData.append("email", email);
    if (image) {
      formData.append("image", image); // إرسال الصورة كملف
    }

    try {
      const response = await fetch("/api/Providingservice", {
        method: "POST",
        body: formData, // إرسال البيانات كـ FormData
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Request submitted successfully:", result);
        // Reset form fields
        setDescription("");
        setImage(undefined);
        setPhone("");
        setCategory("");
        setCustomCategory("");
        setContactMethods([]);
        setWhatsapp("");
        setEmail("");
        setloading(false)
        setSuccessMessage(true)
      } else {
        console.error("Failed to submit request:", await response.json());
      }
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

//   const toBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = (error) => reject(error);
//     });
//   };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col overflow-auto space-y-4 bg-white p-6 rounded shadow-md max-h-[80vh]"
    >
      <h2 className="text-lg font-bold text-gray-700">Add Service</h2>

      {/* category select */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Service</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select Service Type</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {category === "Other" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Write Category</label>
          <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      )}

      {/* description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          required
        />
      </div>

      {/* contact methods */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Contact Methods</label>
        <div className="space-y-2">
          <div>
            <input
              type="checkbox"
              id="phone"
              checked={contactMethods.includes("phone")}
              onChange={() => handleContactMethodChange("phone")}
            />
            <label htmlFor="phone" className="ml-2 text-sm">
              Phone Number
            </label>
          </div>
          {contactMethods.includes("phone") && (
            <div>
              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <input
              type="checkbox"
              id="whatsapp"
              checked={contactMethods.includes("whatsapp")}
              onChange={() => handleContactMethodChange("whatsapp")}
            />
            <label htmlFor="whatsapp" className="ml-2 text-sm">
              WhatsApp
            </label>
          </div>
          {contactMethods.includes("whatsapp") && (
            <div>
              <input
                type="text"
                placeholder="WhatsApp Number"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <input
              type="checkbox"
              id="email"
              checked={contactMethods.includes("email")}
              onChange={() => handleContactMethodChange("email")}
            />
            <label htmlFor="email" className="ml-2 text-sm">
              Email
            </label>
          </div>
          {contactMethods.includes("email") && (
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>
      </div>
      {/* حقل الصورة مع المعاينة */}
<div>
  <label className="text-sm font-medium text-gray-700 flex items-center">
    <FaCamera className="mr-2 text-blue-500" /> Upload Image
  </label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        setImage(file); // تخزين الصورة في الحالة
      }
    }}
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  />
  {image && (
    <div className="mt-4">
      <p className="text-sm text-gray-600">Image Preview:</p>
      <img
        src={URL.createObjectURL(image)} // عرض الصورة باستخدام URL مؤقت
        alt="Image Preview"
        className="mt-2 w-32 h-32 object-cover rounded border"
      />
    </div>
  )}
</div>
<p className="text-center text-[#0bdb27] font-bold text-4xl"> { successMessage && "Request Sent Successfully" }</p>
      <button
        disabled={loading}
        type="submit"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700  text-white font-semibold rounded shadow-md transition duration-300"
      >
      {loading ? "Sending..." : "Submit Request" }
      </button>
    </form>
  );
};

export default AddServiceForm;