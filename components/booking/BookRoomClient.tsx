"use client";
import useBookRoom from "@/hooks/useBookRoom";
import {Elements} from  '@stripe/react-stripe-js';
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import RoomCard from "../room/RoomCard";
import RoomPaymentForm from "./RoomPaymentForm";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const BookRoomClient = () => {
  const { bookingRoomData, clientSecret } = useBookRoom();
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const {theme} = useTheme()
  const router = useRouter()
useEffect(() => {
  setPageLoaded(true)
}, []);
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: theme === 'dark' ? 'night' : 'stripe',
      labels: 'floating'
    }
  }
  const handleSetPaymentSuccess = (value:boolean)=> {
    setPaymentSuccess(value)
  }
  if(pageLoaded && !paymentSuccess && (!bookingRoomData || !clientSecret)) return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-6 py-16 px-4"
    >
      <AlertCircle className="w-16 h-16 text-destructive" />
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Oops! Something went wrong</h2>
        <p className="text-muted-foreground">This page could not be loaded properly.</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant='outline' onClick={()=> router.push('/')}>Go Home</Button>
        <Button onClick={()=> router.push('/my-bookings')}>View Bookings</Button>
      </div>
    </motion.div>
  )
  if(paymentSuccess) return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center gap-6 py-16 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="w-12 h-12 text-success" />
        </motion.div>
      </motion.div>
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Payment Successful!</h2>
        <p className="text-muted-foreground">Your room has been reserved successfully.</p>
      </div>
      <Button onClick={()=> router.push('/my-bookings')} size="lg">
        View My Bookings
      </Button>
    </motion.div>
  )
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[800px] mx-auto py-8 px-4"
    >
      {clientSecret && bookingRoomData && (
        <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Complete Your Booking</h2>
              <p className="text-muted-foreground">
                Review your room details and complete payment to reserve your stay.
              </p>
            </div>
            <div className="border border-border rounded-xl overflow-hidden">
                <RoomCard room={bookingRoomData.room} />
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Payment Information</h3>
              <Elements options={options} stripe={stripePromise}>
                <RoomPaymentForm clientSecret={clientSecret} handleSetPaymentSuccess={handleSetPaymentSuccess} />
              </Elements>
            </div>
        </div>
      )}
    </motion.div>
  );
};

export default BookRoomClient;
