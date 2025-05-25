"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    HelpReques: {
        _id: string;
        description: string;
        category: string;
        phone?: string;
        whatsapp?: string;
        email?: string;
        contactMethods: string[];
    }[];
    requestId: string;
    onClose: () => void;
}

export default function EditHelpRequestForm({ HelpReques, requestId, onClose }: Props) {
    
    const currentRequest = HelpReques.find((r) => r._id === requestId);

    const [description, setDescription] = useState(currentRequest?.description || "");
    const [category, setCategory] = useState(currentRequest?.category || "");
    const [phone, setPhone] = useState(currentRequest?.phone || "");
    const [whatsapp, setWhatsapp] = useState(currentRequest?.whatsapp || "");
    const [email, setEmail] = useState(currentRequest?.email || "");
    const [contactMethods, setContactMethods] = useState<string[]>(currentRequest?.contactMethods || []);
    const [loading, setLoading] = useState(false);

    const handleCheckboxChange = (method: string) => {
        setContactMethods((prev) =>
            prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const updatedRequest = {
            description,
            category,
            phone,
            whatsapp,
            email,
            contactMethods,
        };

        try {
            const res = await fetch(`/api/PUT_Routes/help-requests/${requestId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(updatedRequest),
            });

            console.log(res)
            if (!res.ok) {
                throw new Error("فشل في التحديث");
            }
            playSondClick();
            onClose();
        } catch (err) {
            console.error("خطأ أثناء التحديث:", err);
        } finally {
            setLoading(false);
        }
    };

    const clickSound = new Audio("/mixkit-ethereal-fairy-win-sound-2019.wav");
    const playSondClick = () => {
        clickSound.currentTime = 0;
        clickSound.play();
    };

    if (!currentRequest) return <div className="text-center text-red-500">الطلب غير موجود</div>;

    return (
        <div className="fixed text-[#fff] inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <AnimatePresence>
                <motion.form
                    onSubmit={handleSubmit}
                    className="bg-gradient-to-r from-teal-500 to-blue-600 p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all"
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 50 }}
                    transition={{ duration: 0.4 }}
                >
                    <h2 className="text-2xl font-semibold mb-6 text-white text-center">تعديل الطلب</h2>

                    <label className="block text-white mb-2">الفئة:</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border border-teal-300 p-3 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                        required
                    />

                    <label className="block text-white mb-2">الوصف:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-teal-300 p-3 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                        rows={4}
                        required
                    />

                    <div className="mb-6">
                        <label className="block text-white mb-2">طرق التواصل:</label>
                        <div className="flex flex-wrap gap-6">
                            <label className="flex items-center gap-2 text-white">
                                <input
                                    type="checkbox"
                                    checked={contactMethods.includes("phone")}
                                    onChange={() => handleCheckboxChange("phone")}
                                    className="form-checkbox text-teal-600"
                                />
                                هاتف
                            </label>
                            <label className="flex items-center gap-2 text-white">
                                <input
                                    type="checkbox"
                                    checked={contactMethods.includes("whatsapp")}
                                    onChange={() => handleCheckboxChange("whatsapp")}
                                    className="form-checkbox text-teal-600"
                                />
                                واتساب
                            </label>
                            <label className="flex items-center gap-2 text-white">
                                <input
                                    type="checkbox"
                                    checked={contactMethods.includes("email")}
                                    onChange={() => handleCheckboxChange("email")}
                                    className="form-checkbox text-teal-600"
                                />
                                إيميل
                            </label>
                        </div>
                    </div>

                    <AnimatePresence>
                        {contactMethods.includes("phone") && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <label className="block text-white mb-2">رقم الهاتف:</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full border border-teal-300 p-3 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                />
                            </motion.div>
                        )}

                        {contactMethods.includes("whatsapp") && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <label className="block text-white mb-2">رقم الواتساب:</label>
                                <input
                                    type="text"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    className="w-full border border-teal-300 p-3 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                />
                            </motion.div>
                        )}

                        {contactMethods.includes("email") && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <label className="block text-white mb-2">الإيميل:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-teal-300 p-3 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex justify-between mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none"
                            disabled={loading}
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none"
                            disabled={loading}
                        >
                            {loading ? "جارٍ التحديث..." : "تحديث"}
                        </button>
                    </div>
                </motion.form>
            </AnimatePresence>
        </div>
    );
}
