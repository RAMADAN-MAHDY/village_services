"use client";

import AddServiceForm from '../../components/Forms/AddServiceForm';

import { useState } from 'react';

export default function AddServicePage() {
    const [showServiceForm, setShowServiceForm] = useState<boolean>(true);

    return (
        <div className='h-[100vh]'>
            <h2 className="text-center font-bold my-3 p-3 text-3xl"> Hizmetinizi paylaşın </h2>
            <div className={`flex justify-center items-center h-[70px] bg-[#3d69bbda] text-white py-3 space-x-4`}>
                <button
                    className="px-4 py-2 relative bg-blue-600 hover:bg-blue-700 group text-white font-semibold rounded shadow-md transition duration-300"
                    onClick={() => {
                        setShowServiceForm(true);
                    }}
                >
                    <span className="relative z-10">Hizmet Ekle</span>
                    <span className={`absolute inset-0 bg-[#1c3774] scale-x-0 ${showServiceForm && "scale-x-100"} origin-right  transition-transform duration-500 ease-in-out`}></span>
                </button>

            </div>
            {showServiceForm && <AddServiceForm onSubmit={(service) => console.log(service)} />}
        </div>
    );
}