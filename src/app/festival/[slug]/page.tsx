'use client';
 
import { useParams, notFound } from 'next/navigation';
import { getFestivalBySlug } from '@/data/festivals';
import FestivalPage from '@/components/festival/FestivalPage';
 
export default function FestivalSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const festival = getFestivalBySlug(slug);
  if (!festival) notFound();
  return <FestivalPage festival={festival} />;
}