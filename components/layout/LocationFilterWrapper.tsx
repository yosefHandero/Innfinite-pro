"use client";

import { usePathname } from "next/navigation";
import LocationFilter from "../LocationFilter";

const LocationFilterWrapper = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  
  if (!isHomePage) return null;
  
  return <LocationFilter />;
};

export default LocationFilterWrapper;

