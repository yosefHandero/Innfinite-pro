"use client";

import { usePathname, useRouter } from "next/navigation";
import { HotelWithRooms } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { Dumbbell, MapPin, Star, Wifi, Car } from "lucide-react";
import useLocation from "@/hooks/useLocation";
import { Button } from "../ui/button";
import { RiMovie2Line } from "react-icons/ri";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";

const HotelCard = ({
  hotel,
  index = 0,
}: {
  hotel: HotelWithRooms;
  index?: number;
}) => {
  const pathname = usePathname();
  const isMyHotels = pathname.includes("my-hotels");
  const router = useRouter();
  const { getCountryByCode } = useLocation();
  const country = getCountryByCode(hotel.country);
  const minPrice =
    hotel.rooms.length > 0
      ? Math.min(...hotel.rooms.map((room) => room.roomPrice))
      : null;

  const amenities = [
    hotel.wifi && { icon: Wifi, label: "WiFi" },
    hotel.parking && { icon: Car, label: "Parking" },
    hotel.gym && { icon: Dumbbell, label: "Gym" },
    hotel.movieNights && { icon: RiMovie2Line, label: "Movies" },
  ]
    .filter(Boolean)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={() => !isMyHotels && router.push(`/hotel-details/${hotel.id}`)}
      className={cn(
        "group col-span-1 cursor-pointer",
        isMyHotels && "cursor-default"
      )}
    >
      <div className="relative h-full bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            fill
            src={hotel.image}
            alt={hotel.title}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Price Badge */}
          {minPrice && (
            <div className="absolute top-3 right-3">
              <Badge
                variant="secondary"
                className="bg-background/95 backdrop-blur-sm text-foreground font-semibold"
              >
                <span className="text-lg">${minPrice}</span>
                <span className="text-xs ml-1">/night</span>
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {hotel.title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="line-clamp-1">
                {country?.name}, {hotel.city}
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {hotel.description}
          </p>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              {amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  {amenity && (
                    <>
                      <amenity.icon className="h-3.5 w-3.5" />
                      <span>{amenity.label}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            {minPrice ? (
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">
                  ${minPrice}
                </span>
                <span className="text-xs text-muted-foreground">/night</span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">
                No rooms available
              </span>
            )}
            {isMyHotels && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/hotel/${hotel.id}`);
                }}
                variant="outline"
                size="sm"
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HotelCard;
