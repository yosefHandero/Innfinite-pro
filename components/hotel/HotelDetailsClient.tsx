"use client";

import { Booking } from "@prisma/client";
import { HotelWithRooms } from "@/lib/types";
import useLocation from "@/hooks/useLocation";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import {
  Car,
  Clapperboard,
  Coffee,
  Dumbbell,
  MapPin,
  ShoppingBasket,
  Wine,
  Star,
  Wifi,
} from "lucide-react";
import { IoMdRestaurant } from "react-icons/io";
import { FaSpa } from "react-icons/fa6";
import { MdDryCleaning } from "react-icons/md";
import RoomCard from "../room/RoomCard";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

const HotelDetailsClient = ({
  hotel,
  bookings,
}: {
  hotel: HotelWithRooms;
  bookings?: Booking[];
}) => {
  const { getCountryByCode, getStateByCode } = useLocation();
  const country = getCountryByCode(hotel.country);
  const state = getStateByCode(hotel.country, hotel.state);

  const amenities = [
    hotel.restaurant && { icon: IoMdRestaurant, label: "Restaurant" },
    hotel.gym && { icon: Dumbbell, label: "Gym" },
    hotel.spa && { icon: FaSpa, label: "Spa" },
    hotel.bar && { icon: Wine, label: "Bar" },
    hotel.laundry && { icon: MdDryCleaning, label: "Laundry" },
    hotel.shopping && { icon: ShoppingBasket, label: "Shopping" },
    hotel.parking && { icon: Car, label: "Free Parking" },
    hotel.movieNights && { icon: Clapperboard, label: "Movie Nights" },
    hotel.coffeeshop && { icon: Coffee, label: "Coffee Shop" },
    hotel.wifi && { icon: Wifi, label: "Free WiFi" },
  ].filter(Boolean);

  const minPrice =
    hotel.rooms.length > 0
      ? Math.min(...hotel.rooms.map((room) => room.roomPrice))
      : null;

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Hero Image Section */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden"
      >
        <Image
          fill
          src={hotel.image}
          alt={hotel.title}
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-4xl"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
              {hotel.title}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">
                  {country?.name}, {state?.name}, {hotel.city}
                </span>
              </div>
              {minPrice && (
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  From ${minPrice}/night
                </Badge>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold">About this hotel</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {hotel.description}
            </p>
          </motion.section>

          <Separator />

          {/* Location Details */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold">Location</h2>
            <p className="text-muted-foreground leading-relaxed">
              {hotel.locationDescription}
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span>
                {country?.name}, {state?.name}, {hotel.city}
              </span>
            </div>
          </motion.section>

          <Separator />

          {/* Amenities */}
          {amenities.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map(
                  (amenity, index) =>
                    amenity && (
                      <AmenityItem key={index}>
                        <amenity.icon className="size-5 text-primary" />
                        <span className="font-medium">{amenity.label}</span>
                      </AmenityItem>
                    )
                )}
              </div>
            </motion.section>
          )}

          <Separator />

          {/* Rooms Section */}
          {hotel.rooms.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-semibold mb-2">Available Rooms</h2>
                <p className="text-muted-foreground">
                  Choose from {hotel.rooms.length} room
                  {hotel.rooms.length > 1 ? "s" : ""} available
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hotel.rooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <RoomCard hotel={hotel} room={room} bookings={bookings} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* Right Column - Sticky Summary Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:sticky lg:top-20"
          >
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
              <div>
                <h3 className="font-semibold text-lg mb-2">Quick Info</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {hotel.city}, {country?.name}
                    </span>
                  </div>
                  {minPrice && (
                    <div className="pt-2 border-t border-border">
                      <div className="text-2xl font-bold text-foreground">
                        ${minPrice}
                        <span className="text-sm font-normal text-muted-foreground">
                          /night
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsClient;
