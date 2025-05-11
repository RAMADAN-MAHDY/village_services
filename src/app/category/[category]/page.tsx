"use client";

import ServiceList from '../../../components/Service/ServiceList';
import SectionTitle from '../../../components/Shared/SectionTitle';

const mockCategories = [
    {
      id: 1,
      title: 'Plumbing Services',
      description: 'All kinds of plumbing repairs and installations.',
    },
    {
      id: 2,
      title: 'Carpentry Services',
      description: 'Woodwork, furniture repairs, and custom designs.',
    },
    {
      id: 3,
      title: 'Cleaing Services',
      description: 'Home and office cleaning by professionals.',
    },
  ]; 




export default function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params; // Destructure category directly from params

  console.log(category);
  return (
    <>
      <SectionTitle title={`خدمات  ${category}`} />
      <ServiceList services={mockCategories} />
    </>
  );
}