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
    
  const [description, setDescription] = useState("Hizmet Açıklaması");
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
    "Fazla Gıdayı Paylaşın",
    "Gönüllü Teslimat",
    
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
    setloading(true);

    // En az bir iletişim yöntemi seçildiğinden emin olun
    if (
      !contactMethods.includes("phone") &&
      !contactMethods.includes("whatsapp") &&
      !contactMethods.includes("email")
    ) {
      alert("En az bir iletişim yöntemi seçmelisiniz (Telefon, WhatsApp veya E-posta).");
      setloading(false);
      return;
    }

    // Türk telefon numarasının geçerliliğini kontrol et
    const turkishPhoneRegex = /^(?:\+90|0)?\d{10}$/;
    if (contactMethods.includes("phone") && !turkishPhoneRegex.test(phone)) {
      alert("Lütfen geçerli bir Türk telefon numarası girin (ör. +905xxxxxxxxx veya 05xxxxxxxxx).");
      setloading(false);
      return;
    }

    if (contactMethods.includes("whatsapp") && !turkishPhoneRegex.test(whatsapp)) {
      alert("Lütfen geçerli bir Türk WhatsApp numarası girin (ör. +905xxxxxxxxx veya 05xxxxxxxxx).");
      setloading(false);
      return;
    }

    const finalCategory = category === "Diğer" ? customCategory : category;

    const formData = new FormData();
    formData.append("description", description);
    formData.append("phone", phone);
    formData.append("category", finalCategory);
    formData.append("contactMethods", JSON.stringify(contactMethods));
    formData.append("whatsapp", whatsapp);
    formData.append("email", email);
    if (image) {
      formData.append("image", image); // Görüntüyü dosya olarak gönder
    }

    try {
      const response = await fetch("/api/Providingservice", {
        method: "POST",
        body: formData, // Verileri FormData olarak gönder
      });

      if (response.ok) {
        const result = await response.json();
        console.log("İstek başarıyla gönderildi:", result);
        // Form alanlarını sıfırla
        setDescription("");
        setImage(undefined);
        setPhone("");
        setCategory("");
        setCustomCategory("");
        setContactMethods([]);
        setWhatsapp("");
        setEmail("");
        setloading(false);
        setSuccessMessage(true);
      } else {
        console.error("İstek gönderilemedi:", await response.json());
      }
    } catch (error) {
      console.error("İstek gönderilirken hata oluştu:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col overflow-auto space-y-4 bg-white p-6 rounded shadow-md max-h-[80vh]"
    >
      <h2 className="text-lg font-bold text-gray-700">Hizmet Ekle</h2>

      {/* Kategori seçimi */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Hizmet</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Hizmet Türünü Seçin</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {category === "Diğer" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Kategori Yazın</label>
          <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      )}

      {/* Açıklama */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Açıklama</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          required
        />
      </div>

      {/* İletişim yöntemleri */}
      <div>
        <label className="block text-sm font-medium text-gray-700">İletişim Yöntemleri</label>
        <div className="space-y-2">
          <div>
            <input
              type="checkbox"
              id="phone"
              checked={contactMethods.includes("phone")}
              onChange={() => handleContactMethodChange("phone")}
            />
            <label htmlFor="phone" className="ml-2 text-sm">
              Telefon Numarası
            </label>
          </div>
          {contactMethods.includes("phone") && (
            <div>
              <input
                type="text"
                placeholder="Telefon Numarası"
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
                placeholder="WhatsApp Numarası"
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
              E-posta
            </label>
          </div>
          {contactMethods.includes("email") && (
            <div>
              <input
                type="email"
                placeholder="E-posta Adresi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>
      </div>
      {/* Görüntü alanı ve önizleme */}
<div>
  <label className="text-sm font-medium text-gray-700 flex items-center">
    <FaCamera className="mr-2 text-blue-500" /> Görüntü Yükle
  </label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        setImage(file); // Görüntüyü duruma kaydet
      }
    }}
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  />
  {image && (
    <div className="mt-4">
      <p className="text-sm text-gray-600">Görüntü Önizleme:</p>
      <img
        src={URL.createObjectURL(image)} // Geçici URL kullanarak görüntüyü göster
        alt="Görüntü Önizleme"
        className="mt-2 w-32 h-32 object-cover rounded border"
      />
    </div>
  )}
</div>
<p className="text-center text-[#0bdb27] font-bold text-4xl"> { successMessage && "İstek Başarıyla Gönderildi" }</p>
      <button
        disabled={loading}
        type="submit"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700  text-white font-semibold rounded shadow-md transition duration-300"
      >
      {loading ? "Gönderiliyor..." : "İsteği Gönder" }
      </button>
    </form>
  );
};

export default AddServiceForm;