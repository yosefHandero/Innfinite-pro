import { getHotels } from "@/actions/hotel/getHotels";
import HotelList from "@/components/hotel/HotelList";
import HeroSection from "@/components/hotel/HeroSection";
import { Suspense } from "react";
import { HotelListSkeleton } from "@/components/hotel/HotelList";

interface HomeProps {
  searchParams: {
    title: string;
    country: string;
    state: string;
    city: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const hotels = await getHotels(searchParams);
  const hasFilters =
    searchParams.title ||
    searchParams.country ||
    searchParams.state ||
    searchParams.city;

  return (
    <div className="flex flex-col min-h-screen">
      {!hasFilters && <HeroSection />}
      <div className="flex-1 py-8">
        <Suspense fallback={<HotelListSkeleton />}>
          <HotelList hotels={hotels || []} />
        </Suspense>
      </div>
    </div>
  );
}
