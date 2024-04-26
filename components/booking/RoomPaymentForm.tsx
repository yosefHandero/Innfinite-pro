'use client'

import useBookRoom from "@/hooks/useBookRoom";
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { Separator } from "@radix-ui/react-dropdown-menu";
import moment from 'moment';
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";
import { Booking } from "@prisma/client";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";

interface RoomPaymentFormProps {
    clientSecret: string;
    handleSetPaymentSuccess:(value:boolean)=>void;
}
type DateRangesTypes = {
     startDate: Date,
    endDate: Date,
}
 function hasOverlap(newStartDate: Date, newEndDate: Date, existingDateRanges: DateRangesTypes[]): boolean {
    const newStart = startOfDay(newStartDate);
    const newEnd = endOfDay(newEndDate);

    return existingDateRanges.some(({ startDate, endDate }) => {
        const existingStart = startOfDay(new Date(startDate));
        const existingEnd = endOfDay(new Date(endDate));

        return (
            isWithinInterval(newStart, { start: existingStart, end: existingEnd }) ||
            isWithinInterval(newEnd, { start: existingStart, end: existingEnd }) ||
            isWithinInterval(existingStart, { start: newStart, end: newEnd }) ||
            isWithinInterval(existingEnd, { start: newStart, end: newEnd })
        );
    });
}
const RoomPaymentForm = ({clientSecret, handleSetPaymentSuccess}: RoomPaymentFormProps) => {
    const {bookingRoomData, resetBookRoom} = useBookRoom()
    const stripe = useStripe()
    const elements = useElements()
    const [loading, setLoading] = useState(false);
    const {toast} = useToast()
    const router = useRouter()

    useEffect(() => {
        if(!stripe) {
            return
        }
        if(!clientSecret) {
            return;
        }
        handleSetPaymentSuccess(false)
        setLoading(false)
      
    }, [stripe]);
    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true)
        if(!stripe || !elements || !bookingRoomData){
            return
    }
    try {
        //date overlaps
        const bookings = await axios.get(`/api/booking/${bookingRoomData.room.id}`)
        console.log('bookings', bookings.data)
        const roomBookingDates = bookings.data.map((booking: Booking)=> {
            return {
                startDate:booking.startDate,
                endDate:booking.endDate
            }
        })
        const overlapFound = hasOverlap(bookingRoomData.startDate, bookingRoomData.endDate, roomBookingDates)
        if(overlapFound) {
            setLoading(false)
            return toast ({
                variant:'destructive',
                description:'Some of the days you are trying to book  have already been booked.  Please choose a different date range.'
            })
        }
        stripe.confirmPayment({
            elements,
            redirect:'if_required'
        }).then((result)=> {
            if(!result.error) {
                axios.patch(`/api/booking/${result.paymentIntent.id}`).then((res)=> {
                    toast({
                        variant: 'success',
                        description: `Room reserved!`,
                    })
                    router.refresh()
                    resetBookRoom()
                    handleSetPaymentSuccess(true)
                    setLoading(false)
                }).catch(error=> {
                    console.log(error)
                    toast({
                        variant: "destructive",
                        description: `${error}`,
                    })
                    setLoading(false)
                }) 
            }  else {
                setLoading(false)
            }
        })
    } catch (error: any) {
        console.log(error)
        setLoading(false)
    }
}
    if (!bookingRoomData?.startDate || !bookingRoomData?.endDate) return <div>Please select a date to book</div>;

    const startDate = moment(bookingRoomData?.startDate).format("YYYY -MM-DD")
    const endDate = moment(bookingRoomData?.endDate).format("YYYY -MM-DD")
    return ( <form onSubmit={handleSubmit} id = "payment-form"> 
    <h2 className="font-semibold mb-2 text-lg">Billing Address</h2>
    <AddressElement options={{
        mode:'billing',
        allowedCountries: ['US'],
    }} />
        <h2 className="font-semibold my-2 text-lg">Payment Information</h2>
        <PaymentElement id="payment-element" options={{layout:'tabs'}}/>
        <div className="flex flex-col gap-1">
            <Separator/>
            <div className="flex flex-col gap-1">
                <h2 className="font-semibold mb-1 text-lg">Your Booking Summary</h2>
                <div>you will check-in on {startDate} at 5PM</div>
                <div>you will check-out on {endDate} at 5PM</div>
                {bookingRoomData?.breakFastIncluded && <div>
                    you will be served  breakfast from 7AM to 9AM.
                </div>}

            </div>
            <Separator/>
            <div className="font-bold text-lg">
                {bookingRoomData?.breakFastIncluded && <div className="mb-2">
                    Breakfast Price: ${bookingRoomData?.room.breakFastPrice}
                </div>}
                Total Price : ${bookingRoomData?.totalPrice}
            </div>
        </div>
     
        {loading && <Alert className="bg-blue-800 text-white">
                  <Terminal className="h-4 w-4 stroke-white" />
                  <AlertTitle>Payment Processing...</AlertTitle>
                  <AlertDescription>
                   Please wait
                  </AlertDescription>
                </Alert>
              }
        <Button disabled = {loading}>
            {loading ?  'Processing...':'Make Payment'}
        </Button>
    </form> );
}
 
export default RoomPaymentForm;