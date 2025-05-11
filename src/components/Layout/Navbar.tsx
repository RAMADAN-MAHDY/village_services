"use client";
import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('');

  const handleLinkClick = (link:string):void => {
    setActiveLink(link);
  };

  return (
    <nav className="bg-blue-500 sm:text-[18px]  text-white py-4 shadow-md fixed top-0 w-full h-[70px] z-40">
      <div className="container mx-auto mt-[-10px] flex justify-between items-center sm:px-10 px-1">
      <img src="/WhatsApp Image 2025-05-11 at 12.30.52_8eb85ce5.jpg" alt="Logo" className="w-[57px] rounded-4xl h-[60px]mt-[-40px ]" />
        {/* <h1 className="text-2xl font-bold"> مجتمعنا</h1> */}
       
        <ul className="flex space-x-4">
          <li>
            <Link
              href="/"
              className={`relative sm:p-3 p-2 rounded-3xl group ${activeLink === '/' ? 'text-yellow-300 bg-[#545]' : 'bg-[#6628b8]'}`}
              onClick={() => handleLinkClick('/')}
            >
              <span className="relative z-10">ANA SAYFA</span>
              <span className="absolute rounded-3xl inset-0 bg-[#545] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out"></span>
            </Link>
          </li>
          <li>
            {/* <Link
              href="/About"
              className={`relative sm:p-3 p-2 rounded-3xl group ${activeLink === '/About' ? 'text-yellow-300 bg-[#545]' : 'bg-[#754691]'}`}
              onClick={() => handleLinkClick('/About')}
            >
              <span className="relative z-10">من نحن </span>
              <span className="absolute rounded-3xl inset-0 bg-[#545] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out"></span>
            </Link> */}
          </li>
          <li>
            <Link
              href="/add-service"
              className={`relative sm:p-3 p-2 rounded-3xl group ${activeLink === '/add-service' ? 'text-yellow-300 bg-[#545]' : 'bg-[#8d518d]'}`}
              onClick={() => handleLinkClick('/add-service')}
            >
              <span className="relative z-10">Hizmet Ekle</span>
              <span className="absolute rounded-3xl inset-0 bg-[#545] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out"></span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;