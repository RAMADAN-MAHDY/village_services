"use client";
import HeroSection from '../components/Home/HeroSection';
// import Categories from '../components/Home/Categories';
import ShowServices from '../components/showSerices/showSerices';

export default function HomePage() {



  return (
    <>
      <HeroSection />


      {/* <Categories 
        categories={[
          { id: 1, url : "/category/id" , name: "طب" },
          { id: 2, url : "/category/id" , name: "صيدله" },
          { id: 3, url : "/category/id" , name: "عطاره" },
          { id: 4, url : "/category/id" , name: "بقاله" },
          { id: 5, url : "/category/id" , name: "حلويات" },
          { id: 6, url : "/category/id" , name: "اعمال حره" },
          { id: 8, url : "/category/id" , name: "انتاج حيواني" },
          { id: 9, url : "/category/id" , name: "انتاج نباتي" },
        ]}
      /> */}
     
           <ShowServices />

    </>
  );
}
