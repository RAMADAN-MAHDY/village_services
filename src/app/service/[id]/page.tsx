"use client";

import ServiceDetails from '../../../components/Service/ServiceDetails';
import SectionTitle from '../../../components/Shared/SectionTitle';

interface ServiceDetailsPageParams {
  params: {
    id: string;
  };
}

export default function ServiceDetailsPage({ params }: ServiceDetailsPageParams) {
  const { id } = params;

  return (
    <>
      <SectionTitle title="Service Details" />
      <ServiceDetails serviceId={id} />
    </>
  );
}