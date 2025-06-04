"use client"
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera } from "react-icons/fa";

interface User {
    _id: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
}


interface EditServiceFormProps {
    service: {
        _id: string;
        user: User;
        description: string;
        category: string;
        contactMethods: string[];
        phone?: string;
        whatsapp?: string;
        email?: string;
        image: string[];
    }[];
    onClose: () => void;
    // onSave: (data: any) => void;
    serviceId: string;
}

export default function EditServiceForm({ service, onClose, serviceId }: EditServiceFormProps) {
    const currentService = service.find(s => s._id === serviceId);

    let initialImage: string | null = null;
    if (currentService?.image && Array.isArray(currentService.image) && currentService.image.length > 0) {
        initialImage = currentService.image[0];
    }

    const [formData, setFormData] = useState<{
        description: string;
        contactMethods: string[];
        phone: string;
        whatsapp: string;
        email: string;
        image: string | File | null;
    }>({
        description: currentService?.description || "",
        contactMethods: currentService?.contactMethods || [],
        phone: currentService?.phone || "",
        whatsapp: currentService?.whatsapp || "",
        email: currentService?.email || "",
        image: initialImage,
    });



    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {


        // console.log("currentService:", currentService);
        // console.log("formData:", formData);
        // console.log("هل رقم الهاتف اتغير؟", formData.phone !== currentService?.phone);
        // console.log("هل رقم الواتس اتغير؟", formData.whatsapp !== currentService?.whatsapp);


        const { name, value, type, checked } = e.target as HTMLInputElement;

        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                contactMethods: checked
                    ? [...prev.contactMethods, value]
                    : prev.contactMethods.filter((method) => method !== value),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        // console.log("currentService:", currentService);
        //  console.log("formData:", formData);
        //  console.log("هل رقم الهاتف اتغير؟", formData.phone !== currentService?.phone);
        // console.log("هل رقم الواتس اتغير؟", formData.whatsapp !== currentService?.whatsapp);

        try {
            const updatedFields: any = {};

            if (formData.description !== currentService?.description) {
                updatedFields.description = formData.description;
            }


            if (JSON.stringify(formData.contactMethods) !== JSON.stringify(currentService?.contactMethods)) {
                updatedFields.contactMethods = formData.contactMethods;
            }



            if (
                formData.contactMethods.includes("phone")
                &&
                formData.phone !== currentService?.phone
            ) {
                updatedFields.phone = formData.phone;
            }

            if (
                formData.contactMethods.includes("whatsapp")
                &&
                formData.whatsapp !== currentService?.whatsapp
            ) {

                updatedFields.whatsapp = formData.whatsapp;


            }

            if (
                formData.contactMethods.includes("email")
                &&
                formData.email !== currentService?.email
            ) {
                updatedFields.email = formData.email;
            }

            let isFileChanged = formData.image instanceof File;

            if (Object.keys(updatedFields).length === 0 && !isFileChanged) {
                alert("لا يوجد تغييرات لحفظها.");
                setLoading(false);
                return;
            }

            let response;
            const formDataToSend = new FormData();

            for (const key in updatedFields) {
                if (key === "contactMethods") {
                    // إرسال contactMethods كسلسلة JSON
                    formDataToSend.append(key, JSON.stringify(updatedFields.contactMethods));
                } else {
                    formDataToSend.append(key, updatedFields[key]);
                }
            }


            if (formData.image instanceof File) {
                formDataToSend.append("image", formData.image);
            }

            response = await fetch(`/api/PUT_Routes/Providingservice/${serviceId}`, {
                method: "PUT",
                body: formDataToSend,
            });
            console.log("formDataToSend")
            console.log(response.ok)
            const data = await response.json();

            if (response.status === 200) {
                // onSave(data);
                onClose();
                playSondClick()
            } else {
                alert(data.message || "حدث خطأ أثناء الحفظ.");
            }
        } catch (err) {
            alert(err);
        } finally {
            setLoading(false);
        }
    };

      const clickSound = new Audio("/mixkit-ethereal-fairy-win-sound-2019.wav");
  const playSondClick = () => {
    clickSound.currentTime = 0;
    clickSound.play();
  };
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.form
                    onSubmit={handleSubmit}
                    className="bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl p-6 w-full max-w-md relative"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
                        تعديل الخدمة
                    </h2>
                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <FaCamera className="mr-2 text-blue-500" /> رفع صورة
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setFormData({ ...formData, image: file })
                                    // تخزين الصورة في الحالة
                                }
                            }}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {typeof formData.image === "string" ? (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600">معاينة الصورة:</p>
                                <img
                                    src={formData.image} // هنا غيرت من formData.image[0] لـ formData.image
                                    alt="معاينة الصورة"
                                    className="mt-2 w-32 h-32 object-cover rounded border"
                                />
                            </div>
                        ) : formData.image instanceof File ? (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600">معاينة الصورة:</p>
                                <img
                                    src={URL.createObjectURL(formData.image)}
                                    alt="معاينة الصورة"
                                    className="mt-2 w-32 h-32 object-cover rounded border"
                                />
                            </div>
                        ) : null}


                    </div>

                    <label className="block mb-6">
                        <span className="text-gray-700 font-medium">الوصف</span>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="mt-2 block w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            required
                        ></textarea>
                    </label>

                    <fieldset className="mb-6">
                        <legend className="text-gray-700 font-medium mb-2">
                            وسائل التواصل:
                        </legend>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value="email"
                                    checked={formData.contactMethods.includes("email")}
                                    onChange={handleChange}
                                />
                                <span>البريد الإلكتروني</span>
                            </label>
                            {formData.contactMethods.includes("email") && (
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="block w-full rounded-xl border px-3 py-2 mt-1"
                                    placeholder="example@email.com"
                                />
                            )}

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value="phone"
                                    checked={formData.contactMethods.includes("phone")}
                                    onChange={handleChange}
                                />
                                <span>رقم الهاتف</span>
                            </label>
                            {formData.contactMethods.includes("phone") && (
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="block w-full rounded-xl border px-3 py-2 mt-1"
                                    placeholder="0123456789"
                                />
                            )}

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value="whatsapp"
                                    checked={formData.contactMethods.includes("whatsapp")}
                                    onChange={handleChange}
                                />
                                <span>واتساب</span>
                            </label>
                            {formData.contactMethods.includes("whatsapp") && (
                                // <input
                                //     type="tel"
                                //     value={formData.whatsapp}
                                //     onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                //     className="block w-full rounded-xl border px-3 py-2 mt-1"
                                //     placeholder="0123456789"
                                // />
                                <input
                                type="tel"
                                placeholder="رقم واتساب"
                                value={formData.whatsapp}
                                onChange={(e) => {
                                    let value = e.target.value;
                                    
                                    // نتأكد إنه يبدأ بـ +20
                                    if (!value.startsWith('+2')) {
                                        value = '+2' + value.replace(/^\+?2?/, '');
                                    }

                                    // نحافظ على الأرقام فقط بعد +20 ونخلي الحد الأقصى 12 رقم بعد +20
                                    const numberPart = value.replace('+2', '').replace(/\D/g, '').slice(0, 11);
                                    // setWhatsapp('+2' + numberPart);

                                    setFormData({ ...formData, whatsapp: '+2' + numberPart})
                                }}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />  
                            )}
                        </div>
                    </fieldset>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-400 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? "...جارٍ الحفظ" : "حفظ"}
                        </button>
                    </div>
                </motion.form>
            </motion.div>
        </AnimatePresence>
    );
}
