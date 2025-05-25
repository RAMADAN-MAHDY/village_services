"use client";
import { useState } from 'react';
import HeroSection from '../components/Home/HeroSection';
// import Categories from '../components/Home/Categories';
import ShowServices from '../components/showSerices/showSerices';
import ShowRequest from '@/components/showRequest/showRequest'
export default function HomePage() {
    const [showRequest, setShowRequest] = useState<boolean>(false);
    const [showServices, setShowServices] = useState<boolean>(false);


    return (
        <>
            <HeroSection />
 
            <div className='mt-0 flex shadow-[0px_4px_20px_rgba(12.12.82.0.5)] bg-[#65afec41] justify-around sm:px-[10%] text-[#fff] py-6 text-[18px] '>
                <button className='relative p-2 bg-[#7444a5] rounded-2xl shadow-[0px_15px_10px_rgba(12.12.12.0.5)] hover:shadow-[0px_15px_20px_rgba(12.12.12.0.5)]'
                    onClick={() => {
                        setShowRequest(true);
                        setShowServices(false);
                    }}
                >


                    <span className="relative z-10">  عرض الطلبات</span>

                    <span className={`absolute rounded-2xl inset-0 bg-[#1c3774] scale-x-0 ${showRequest && "scale-x-100"} origin-right  transition-transform duration-900 ease-in-out`}></span>
                </button>

                <button className='relative p-2 bg-[#7444a5] rounded-2xl shadow-[0px_15px_10px_rgba(12.12.12.0.5)] hover:shadow-[0px_15px_20px_rgba(12.12.12.0.5)]'
                    onClick={() => {
                        setShowRequest(false);
                        setShowServices(true);
                    }}  >

                    <span className="relative z-10"> عرض الخدمات</span>

                    <span className={`absolute rounded-2xl inset-0 bg-[#1c3774] scale-x-0 ${showServices && "scale-x-100"} origin-left  transition-transform duration-900 ease-in-out`}></span>

                </button>
            </div>

            {showRequest && <ShowRequest />}

            {showServices && <ShowServices />}

        </>
    );
}
