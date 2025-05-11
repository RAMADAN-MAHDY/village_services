"use client";

import AddServiceForm from '../../components/Forms/AddServiceForm';
import HelpRequestForm from '../../components/Forms/HelpRequestForm';
import SectionTitle from '../../components/Shared/SectionTitle';
import { useState } from 'react';

export default function AddServicePage() {
  const [showServiceForm, setShowServiceForm] = useState<boolean>(false);
  const [showHelpForm, setShowHelpForm] = useState<boolean>(false);

  return (
    <div className='h-[100vh]'>
      <SectionTitle title="شارك خدمتك أو اطلب المساعدة" />
      <div className={`flex justify-center items-center h-[70px] bg-[#3d69bbda] text-white py-3 space-x-4`}>
        <button
          className="px-4 py-2 relative bg-blue-600 hover:bg-blue-700 group text-white font-semibold rounded shadow-md transition duration-300"
          onClick={() => {
            setShowServiceForm(true);
            setShowHelpForm(false);
          }}
        >
              <span className="relative z-10"> اضافة خدمة</span>

              <span className={`absolute inset-0 bg-[#1c3774] scale-x-0 ${showServiceForm && "scale-x-100"} origin-right  transition-transform duration-500 ease-in-out`}></span>

        </button>

        <button
          className="px-4 py-2 relative group bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow-md transition duration-300"
          onClick={() => {
            setShowHelpForm(true);
            setShowServiceForm(false);
          }}
        >
         
              <span className="relative z-10">  طلب خدمة</span>

            <span className={`absolute inset-0 bg-[#135a22] scale-x-0 ${showHelpForm && "scale-x-100"} origin-left transition-transform duration-500 ease-in-out`}></span>
        </button>
      </div>
      {showServiceForm && <AddServiceForm onSubmit={(service) => console.log(service)} />}
      {showHelpForm && <HelpRequestForm onSubmit={(request) => console.log(request)} />}
    </div>
  );
}