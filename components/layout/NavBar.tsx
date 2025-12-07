"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import Container from "../Container";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../ui/button";
import SearchInput from "../SearchInput";
import { ModeToggle } from "../theme-toggle";
import { NavMenu } from "./NavMenu";
import { motion } from "framer-motion";
import { Hotel, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();
  const isAuthPage = pathname?.includes("sign-in") || pathname?.includes("sign-up");

  if (isAuthPage) return null;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => router.push("/")}
          >
            <div className="relative h-8 w-8">
              <Image
                src="/hotel.svg"
                alt="Innfinite Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Innfinite
            </span>
          </motion.div>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <SearchInput />
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className={cn(
                pathname === "/" && "bg-accent text-accent-foreground"
              )}
            >
              <Hotel className="h-4 w-4 mr-2" />
              Hotels
            </Button>
            {userId && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/my-bookings")}
                  className={cn(
                    pathname === "/my-bookings" &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  My Bookings
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/my-hotels")}
                  className={cn(
                    pathname === "/my-hotels" &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  <User className="h-4 w-4 mr-2" />
                  My Hotels
                </Button>
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            <NavMenu />
            {userId ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => router.push("/sign-in")}
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  Sign in
                </Button>
                <Button
                  onClick={() => router.push("/sign-up")}
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </motion.nav>
  );
};

export default NavBar;
