"use client";

import { useState } from "react";

interface HelpRequestFormProps {
    onSubmit: (request: {
        description: string;
        phone: string;
        category: string;
        contactMethods: string[];
        whatsapp?: string;
        email?: string;
    }) => void;
}

export default function HelpRequestForm({ onSubmit }: HelpRequestFormProps) {
    const [phone, setPhone] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [customCategory, setCustomCategory] = useState("");
    const [contactMethods, setContactMethods] = useState<string[]>([]);
    const [whatsapp, setWhatsapp] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setloading] = useState<boolean>(false)


    const categories = [
        "خدمات طبية",
        "خدمات تقنية",
        "أعمال يدوية",
        "أعمال حره",
        "توصيل",
        "ورش",
        "تعليم",
        "أخرى",
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
            alert("يجب اختيار طريقة واحدة على الأقل للتواصل (الهاتف، الواتساب، أو الإيميل).");
            return;
        }
if (!email && !whatsapp && !phone) {
  alert("يجب اختيار طريقة واحدة على الأقل للتواصل (الهاتف، الواتساب، أو الإيميل). وملء الحقل");
  setloading(false);
  return;
}



        const finalCategory = category === "أخرى" ? customCategory : category;

        const requestData = {
            description,
            phone,
            category: finalCategory,
            contactMethods,
            whatsapp,
            email,
        };

        try {
            const response = await fetch("/api/users_and_HelpRequestSchema", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Request submitted successfully:", result);
                // Reset form fields
                setPhone("");
                setDescription("");
                setCategory("");
                setCustomCategory("");
                setContactMethods([]);
                setWhatsapp("");
                setEmail("");
                setloading(false)

            } else {
                console.error("Failed to submit request:", await response.json());
            }
        } catch (error) {
            console.error("Error submitting request:", error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col overflow-auto space-y-4 max-h-[80vh] bg-white p-6 rounded shadow-md"
        >
            <h2 className="text-lg font-bold text-gray-700">طلب خدمه</h2>

            {/* category select */}
            <div>
                <label className="block text-sm font-medium text-gray-700">الخدمه</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                >
                    <option value="">اختر نوع الخدمه</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {category === "أخرى" && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">اكتب الفئة</label>
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
                <label className="block text-sm font-medium text-gray-700">الوصف</label>
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
                <label className="block text-sm font-medium text-gray-700">طرق التواصل</label>
                <div className="space-y-2">
                    <div>
                        <input
                            type="checkbox"
                            id="phone"
                            checked={contactMethods.includes("phone")}
                            onChange={() => handleContactMethodChange("phone")}
                        />
                        <label htmlFor="phone" className="ml-2 text-sm">
                            رقم الهاتف
                        </label>
                    </div>
                    {contactMethods.includes("phone") && (
                        <div>
                            <input
                                type="text"
                                placeholder="رقم واتساب"
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
                            واتساب
                        </label>
                    </div>
                    {contactMethods.includes("whatsapp") && (
                        <div>
                            <input
                                type="text"
                                placeholder="رقم واتساب"
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
                            إيميل
                        </label>
                    </div>
                    {contactMethods.includes("email") && (
                        <div>
                            <input
                                type="email"
                                placeholder="البريد الإلكتروني"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow-md transition duration-300"
            >
                {loading ? "ارسال ..." : " إرسال الطلب"}
            </button>
        </form>
    );
}
