import { HotelWithRooms } from "@/lib/types";
import HotelCard from "./HotelCard";
import { Skeleton } from "../ui/skeleton";

const HotelList = ({ hotels }: { hotels: HotelWithRooms[] }) => {
  if (!hotels || hotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl mb-4">🏨</div>
          <h3 className="text-2xl font-semibold">No hotels found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search filters or explore different destinations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {hotels.map((hotel, index) => (
        <HotelCard key={hotel.id} hotel={hotel} index={index} />
      ))}
    </div>
  );
};

export const HotelListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-[4/3] rounded-xl" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-1/3 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelList;
