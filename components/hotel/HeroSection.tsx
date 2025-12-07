"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Container from "../Container";
import SearchInput from "../SearchInput";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5">
      <Container>
        <div className="relative py-16 md:py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance"
            >
              Find Your Perfect
              <span className="text-primary"> Stay</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Discover amazing hotels and book your next adventure with ease
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Button
                size="lg"
                onClick={() => router.push("/")}
                className="text-base px-8 py-6 h-auto"
              >
                Explore Hotels
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/my-hotels")}
                className="text-base px-8 py-6 h-auto"
              >
                List Your Hotel
              </Button>
            </motion.div>
          </motion.div>

          {/* Popular Destinations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 md:mt-20"
          >
            <p className="text-sm font-medium text-muted-foreground mb-4 text-center">
              Popular destinations
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {["New York", "Paris", "Tokyo", "London", "Dubai"].map(
                (city, index) => (
                  <motion.button
                    key={city}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-full bg-card border border-border hover:border-primary/50 transition-colors text-sm font-medium"
                    onClick={() => {
                      router.push(`/?city=${city}`);
                    }}
                  >
                    {city}
                  </motion.button>
                )
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default HeroSection;

