"use client";
import { useState } from 'react';
import HeroSection from '../components/Home/HeroSection';
// import Categories from '../components/Home/Categories';
import ShowServices from '../components/showSerices/showSerices';
import ShowRequest from '@/components/showRequest/showRequest';
import ChatAi from '../components/chatAi/chatAi';
import { motion, AnimatePresence } from 'framer-motion';
import  AboutUs from '@/components/aboutUs/AboutUs';

export default function HomePage() {
    const [showRequest, setShowRequest] = useState<boolean>(false);
    const [showServices, setShowServices] = useState<boolean>(false);
    const [showchat, setShowchat] = useState<boolean>(false);

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
              
            {!showRequest && !showServices && <AboutUs />}

            <button className={`fixed font-bold right-0 hover:text-[#000] hover:bg-[#b394d1] top-[10%] ${showchat ? "z-60 " : "z-30"} bg-[#7444a5] text-white p-3 rounded-l-2xl hover:w-[140px] shadow-lg hover:shadow-xl transition-all duration-500`}
                onClick={() => {
                    setShowchat(!showchat);
                }
                }>
                <span className="material-icons"> {!showchat ? "المساعد الذكي" : " اغلاق"}</span>
            </button>

            {showchat &&
                <AnimatePresence>
                    <motion.div
                        transition={{ duration: 1.0, ease: 'easeInOut' }}
                        initial={{ opacity: 0, y: -100 ,x: 290 }}
                        animate={{ opacity: 1, y: 0,  x: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className='fixed sm:top-[10%] top-[-50px] left-0 sm:left-[30%] lg:left-[20%] w-full sm:w-[400px] lg:w-[800px]  bg-[#010f08] shadow-lg rounded-t-lg overflow-hidden z-50 bottom-0'
                    >
                       
                        <ChatAi />
                    </motion.div>
                </AnimatePresence>

            }
        </>
    );
}
