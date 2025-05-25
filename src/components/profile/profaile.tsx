"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "../../components/Shared/SectionTitle";
import ServiceDescription from "@/components/showSerices/ServiceDescription";
import Loading from "@/app/loading";
import ConfirmDialog from "./ConfirmDialog";
import EditServiceForm from "@/components/profile/EditServiceForm";
import EditHelpRequestForm from './EditHelpRequestForm';
interface User {
    _id: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
}


interface Service {
    _id: string;
    user: User;
    description: string;
    category: string;
    contactMethods: string[];
    phone?: string;
    whatsapp?: string;
    email?: string;
    image: string[];
    type?: "providing" | "help";
}

interface ProfileData {
    Providingservic: Service[];
    HelpRequestservic: Service[];
}

export default function Profile() {
    const [providingServices, setProvidingServices] = useState<Service[]>([]);
    const [helpRequests, setHelpRequests] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [confirmEditId, setConfirmEditeId] = useState<string | null>(null);
    const [confirmEditId_for_request_ser, setconfirmEditId_for_request_ser] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDeleteRequestId, setConfirmDeleteRequestId] = useState<string | null>(null);
    const [showRequest, setShowRequest] = useState<boolean>(false);
    const [showServices, setShowServices] = useState<boolean>(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/GET_Router/Profile", {
                    credentials: "include",
                });
                const data: ProfileData = await res.json();
                setProvidingServices(data.Providingservic);
                setHelpRequests(data.HelpRequestservic);
                // console.log(data)
            } catch (error) {
                console.error("فشل في جلب البيانات:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [confirmEditId, confirmEditId_for_request_ser]);

    const handleDeleteConfirmed = async () => {
        if (!confirmDeleteId) return;

        setDeletingId(confirmDeleteId);
        try {
            const res = await fetch(`/api/DELETE_Routes/Providingservice?id=${confirmDeleteId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                setProvidingServices((prev) => prev.filter((item) => item._id !== confirmDeleteId));
            } else {
                console.error("فشل في حذف الخدمة");
            }
        } catch (err) {
            console.error("خطأ أثناء حذف الخدمة", err);
        } finally {
            setDeletingId(null);
            setConfirmDeleteId(null);
        }
    };

    const handleDeleteRequest = async (id: string) => {
        try {
            const res = await fetch(`/api/DELETE_Routes/RequestService?id=${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                setHelpRequests((prev) => prev.filter((item) => item._id !== id));
            } else {
                console.error("فشل في حذف الطلب");
            }
        } catch (err) {
            console.error("خطأ أثناء حذف الطلب", err);
        }
    };

    const onClosed = () => {
        setConfirmEditeId(null);
        setconfirmEditId_for_request_ser(null);
    };


    if (loading) return <Loading />;

    return (
        <article className="min-h-screen" dir="rtl">
            <SectionTitle title="الملف الشخصي" />

            <div className="flex justify-center items-center h-[70px] bg-[#3d69bbda] text-white py-3">
                <div className="text-center">
                    <h1>ادارة خدماتك او طلباتك</h1>
                    <h3>يمكنك تعديل او حذف خدماتك او طلباتك</h3>
                </div>
            </div>

            {/* الزراير المسؤوله عن العرض */}
            <div className='mt-0 flex shadow-[0px_4px_20px_rgba(12.12.82.0.5)] bg-[#65afec41] justify-around sm:px-[10%] text-[#fff] py-6 text-[18px] ' dir="ltr">
                <button className='relative p-2 bg-[#7444a5] rounded-2xl shadow-[0px_15px_10px_rgba(12.12.12.0.5)] hover:shadow-[0px_15px_20px_rgba(12.12.12.0.5)]'
                    onClick={() => {
                        setShowRequest(true);
                        setShowServices(false);
                    }}
                >


                    <span className="relative z-10">  عرض طلباتي</span>

                    <span className={`absolute rounded-2xl inset-0 bg-[#1c3774] scale-x-0 ${showRequest && "scale-x-100"} origin-right  transition-transform duration-900 ease-in-out`}></span>
                </button>

                <button className='relative p-2 bg-[#7444a5] rounded-2xl shadow-[0px_15px_10px_rgba(12.12.12.0.5)] hover:shadow-[0px_15px_20px_rgba(12.12.12.0.5)]'
                    onClick={() => {
                        setShowRequest(false);
                        setShowServices(true);
                    }}  >

                    <span className="relative z-10"> عرض خدماتي</span>

                    <span className={`absolute rounded-2xl inset-0 bg-[#1c3774] scale-x-0 ${showServices && "scale-x-100"} origin-left  transition-transform duration-900 ease-in-out`}></span>

                </button>
            </div>

            {/* خدماتك اللي بتقدمها */}
            {showServices &&

                <section className="bg-[#33292244] p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <h2 className="col-span-full text-white text-xl font-bold mb-2">الخدمات التي تقدمها</h2>
                    {(!providingServices || providingServices?.length === 0) ? (
                        <p className="text-white col-span-full">لا يوجد خدمات</p>
                    ) : (
                        providingServices?.map((service) => (
                            <motion.div
                                key={service._id}
                                initial={{ opacity: 0, y: 90 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col"
                            >
                                <div className="p-4 flex flex-col h-full">
                                    {/* الصورة */}
                                    {service.image && service?.image?.length > 0 ? (
                                        <img
                                            src={service.image[0]}
                                            alt={service.category}
                                            className="w-full h-48 object-cover mb-2"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-2">
                                            <span className="text-gray-500">لا توجد صورة</span>
                                        </div>
                                    )}

                                    <h2 className="text-lg font-semibold mb-2">{service.category}</h2>
                                    <ServiceDescription description={service.description} />
                                    {/* <div className="text-sm text-gray-600 my-2">
                                    <p>📞 {service.phone}</p>
                                </div> */}
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

                                    {/* زراير الحذف والتعديل */}
                                    <div className="flex justify-end gap-2 mt-auto pt-4 border-t">
                                        <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                            onClick={() => {
                                                setConfirmEditeId(service._id)
                                            }}>
                                            تعديل
                                        </button>
                                        <button
                                            onClick={() => setConfirmDeleteId(service._id)}
                                            className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                            disabled={deletingId === service._id} // لو جاري الحذف نوقف الزر
                                        >حذف
                                        </button>

                                    </div>
                                </div>
                            </motion.div>

                        ))
                    )}
                </section>
            }

            {/* الطلبات اللي بتطلبها */}
            {showRequest &&
                <section className="bg-[#8b753621] p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <h2 className="col-span-full text-white text-xl font-bold mt-10 mb-2">الطلبات التي تحتاجها</h2>
                    {helpRequests.length === 0 ? (
                        <p className="text-white col-span-full">لا يوجد طلبات</p>
                    ) : (
                        helpRequests.map((request) => (
                            <motion.div
                                key={request._id}
                                initial={{ opacity: 0, x: 90, y: 90 }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ duration: 1.5 }}
                                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col"
                            >
                                <div className="p-4 flex flex-col h-full">
                                    <h2 className="text-lg font-semibold mb-2">{request.category}</h2>
                                    <ServiceDescription description={request.description} />
                                    <ul className="text-sm text-gray-600">
                                        {request.contactMethods.includes("phone") && (
                                            <li>
                                                📞{" "}
                                                <a
                                                    href={`tel:${request.phone}`}
                                                    className="text-blue-500 hover:underline"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {request.phone}
                                                </a>
                                            </li>
                                        )}
                                        {request.contactMethods.includes("whatsapp") && (
                                            <li>
                                                💬{" "}
                                                <a
                                                    href={`https://wa.me/${request.whatsapp}`}
                                                    className="text-green-500 hover:underline"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    واتساب
                                                </a>
                                            </li>
                                        )}
                                        {request.contactMethods.includes("email") && (
                                            <li>
                                                📧{" "}
                                                <a
                                                    href={`mailto:${request.email}`}
                                                    className="text-red-500 hover:underline"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {request.email}
                                                </a>
                                            </li>
                                        )}
                                    </ul>

                                    {/* زراير في الأسفل */}
                                    <div className="flex justify-end gap-2 mt-auto pt-4 border-t">
                                        <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                            onClick={() => {
                                                setconfirmEditId_for_request_ser(request._id)
                                            }}>
                                            تعديل
                                        </button>
                                        <button
                                            onClick={() => setConfirmDeleteRequestId(request._id)}
                                            className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                        >
                                            حذف
                                        </button>

                                    </div>
                                </div>
                            </motion.div>

                        ))
                    )}
                </section>
            }


            {/* مودال تأكيد الحذف */}
            {confirmDeleteId && (
                <ConfirmDialog
                    message="هل أنت متأكد من حذف هذه الخدمة؟"
                    onConfirm={handleDeleteConfirmed}
                    onCancel={() => setConfirmDeleteId(null)}
                    loading={deletingId === confirmDeleteId}
                    confirmText="حذف"
                    cancelText="إلغاء"
                />
            )}

            {confirmDeleteRequestId && (
                <ConfirmDialog
                    message="هل أنت متأكد من حذف هذا الطلب؟"
                    onConfirm={async () => {
                        await handleDeleteRequest(confirmDeleteRequestId);
                        setConfirmDeleteRequestId(null);
                    }}
                    onCancel={() => setConfirmDeleteRequestId(null)}
                    confirmText="حذف"
                    cancelText="إلغاء"
                />
            )}

            {confirmEditId && <EditServiceForm service={providingServices} serviceId={confirmEditId} onClose={onClosed} />}

            {confirmEditId_for_request_ser && <EditHelpRequestForm HelpReques={helpRequests} requestId={confirmEditId_for_request_ser} onClose={onClosed} />}
        </article>
    );
}
