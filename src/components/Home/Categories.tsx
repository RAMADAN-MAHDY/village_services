"use client";
import SearchBar from '@/components/Home/SearchBar';
import SectionTitle from '@/components/Shared/SectionTitle';
import Link from 'next/link';
import { useState } from 'react';
import React from 'react';

const Categories = ({ categories }: { categories: { id: number; url : string ; name: string }[] }) => {
     const [query, setQuery] = useState<string>('');
     const [CategoriesFilter, setCategoriesFilter] = useState<{ id: number; url : string ; name: string }[]>(categories);


    const handleSearch = (query: string) => {
        setQuery(query);
        const filteredCategories = categories.filter((category) =>
          category.name.toLowerCase().includes(query.toLowerCase())
        );
        setCategoriesFilter(filteredCategories);
      }
    

  return (
    <>
      <SearchBar 
            placeholder="بحث عن الخدمات  ..." 
            onChange={handleSearch}
          />

      <SectionTitle title="الفئات المتاحه " />

    <div className="categories grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {CategoriesFilter?.map((category) => (
      
          <Link href={category.url} 
          key={category.id}
          className="category-card bg-white rounded-lg shadow-[0px_4px_17px_rgba(55.45.40.0,5)] font-bold text-[20px] p-4 text-center hover:shadow-[0px_14px_17px_rgba(55.45.40.0,5)] transition-shadow duration-300 cursor-pointer">{category.name}</Link>
        
      ))}
    </div>
    </>
  );
};

export default Categories;