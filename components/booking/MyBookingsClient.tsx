"use client";
import { Booking, Hotel, Room } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import {
  AirVent,
  Bath,
  Bed,
  BedDouble,
  Castle,
  Home,
  MapPin,
  Mountain,
  Ship,
  Trees,
  Tv,
  User,
  UtensilsCrossed,
  VolumeX,
  Wifi,
} from "lucide-react";
import { Separator } from "../ui/separator";
import {  useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {  useState } from "react";

import { useToast } from "../ui/use-toast";
import { differenceInCalendarDays} from "date-fns";
import { useAuth } from "@clerk/nextjs";
import useBookRoom from "@/hooks/useBookRoom";
import useLocation from "@/hooks/useLocation";
import moment from "moment";

interface MyBookingsClientProps {
booking:Booking & {Room:Room | null} &{Hotel:Hotel | null};
}
const MyBookingsClient: React.FC<MyBookingsClientProps> = ({ booking }) => {
  const {setRoomData,
     paymentIntentId,
     setClientSecret, 
    setPaymentIntentId
  } = useBookRoom()
  const [loading, setLoading] = useState(false);
const [bookingIsLoading, setBookingIsLoading] = useState(false);
const {getCountryByCode, getStateByCode} = useLocation()
const {userId} = useAuth();
const router =  useRouter();
const {Hotel, Room} =  booking;

const {toast} = useToast()
if(!Hotel || !Room) return <div>Missing Data...</div>

const country = getCountryByCode(Hotel.country)
const state = getStateByCode(Hotel.state , Hotel.country )

const startDate = moment(booking.startDate).format( 'YYYY-MM-DD');
const endDate = moment(booking.endDate).format('YYYY-MM-DD') ;
const dayCount = differenceInCalendarDays(booking.endDate, booking.startDate)





 

  const handleBookRoom =   () => {
    if(!userId) return toast({
      variant:"destructive",
      description :"Please login first!"
    })
    if(!Hotel?.userId) return toast({
      variant:"destructive",
      description :"Something went wrong!"
    })

      setBookingIsLoading(true)

      const bookingRoomData = {
        room: Room,
        totalPrice:booking.totalPrice,
        breakFastIncluded: booking.breakFastIncluded,
        startDate: booking.startDate,
        endDate: booking.endDate,
        
      }
      setRoomData(bookingRoomData)

      fetch('/api/create-payment-intent', {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          booking: {
            hotelOwnerId: Hotel.userId,
            hotelId: Hotel.id,
            roomId: Room.id,
            startDate: bookingRoomData.startDate,
            endDate: bookingRoomData.endDate,
            breakFastIncluded:bookingRoomData.breakFastIncluded,
            totalPrice:bookingRoomData.totalPrice

          },
          payment_intent_id: paymentIntentId
        }),
      }).then((res)=> {
        setBookingIsLoading(false)
        if(res.status === 401){
          return router.push('/login')

        }
        return  res.json()


      }).then(data=> {
  setClientSecret(data?.client_secret)
  setPaymentIntentId(data?.id);

        router.push('/book-room')
      }).catch((error:any)=> {
        console.log('Error: ', error);
        toast({
          variant: 'destructive',
          description: `ERROR! ${error.message}`,
        })
      })

    }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{Hotel.title}</CardTitle>
        <CardDescription>
            <div className="font-semibold mt-4">
            <AmenityItem> <MapPin className="size-4"/>
            {country?.name}, {state?.name}, {Hotel.city}
            </AmenityItem>
        </div>
          <p className="text-primary/90 mb-2 py-2">{Hotel.locationDescription}</p>

        </CardDescription>

        <CardTitle>{Room.title}</CardTitle>
        <CardDescription>{Room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={Room.image}
            alt={Room.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          <AmenityItem>
            <Bed className="h-4 w-4" />
            {Room.bedCount} Bed{"(s)"}
          </AmenityItem>
          <AmenityItem>
            <User className="h-4 w-4" />
            {Room.guestCount} Guest{"(s)"}
          </AmenityItem>
          <AmenityItem>
            <Bath className="h-4 w-4" />
            {Room.bathroomCount} Bathroom{"(s)"}
          </AmenityItem>
          {!!Room.kingBedCount && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {Room.kingBedCount} King Bed{"(s)"}
            </AmenityItem>
          )}
          {!!Room.queenBedCount && (
            <AmenityItem>
              <Bed className="h-4 w-4" />
              {Room.queenBedCount} Queen Bed{"(s)"}
            </AmenityItem>
          )}
          {Room.roomService && (
            <AmenityItem>
              <UtensilsCrossed className="h-4 w-4" />
              Room Services
            </AmenityItem>
          )}
          {Room.TV && (
            <AmenityItem>
              <Tv className="h-4 w-4" />
              TV
            </AmenityItem>
          )}
          {Room.balcony && (
            <AmenityItem>
              <Home className="h-4 w-4" />
              Balcony
            </AmenityItem>
          )}
          {Room.Wifi && (
            <AmenityItem>
              <Wifi className="h-4 w-4" />
              Free Wifi
            </AmenityItem>
          )}
          {Room.cityView && (
            <AmenityItem>
              <Castle className="h-4 w-4" />
              City View
            </AmenityItem>
          )}
          {Room.oceanView && (
            <AmenityItem>
              <Ship className="h-4 w-4" />
              Ocean View
            </AmenityItem>
          )}
          {Room.forestView && (
            <AmenityItem>
              <Trees className="h-4 w-4" />
              Forest View
            </AmenityItem>
          )}
          {Room.moutainView && (
            <AmenityItem>
              <Mountain className="h-4 w-4" />
              Mountain View
            </AmenityItem>
          )}
          {Room.airCondition && (
            <AmenityItem>
              <AirVent className="h-4 w-4" />
              Air Condition
            </AmenityItem>
          )}
          {Room.soundProof && (
            <AmenityItem>
              <VolumeX className="h-4 w-4" />
              Sound Proof
            </AmenityItem>
          )}
        </div>
        <Separator />
        <div>
          <div className="flex gap-4 justify-between">
            <div>
              Room Price: <span className="font-bold">${Room.roomPrice}</span>{" "}
              <span className="text-xs"></span>/24hrs
            </div>
          </div>
          {!!Room.breakFastPrice && (
            <div>
              BreakFast Price:
              <span className="font-bold">${Room.breakFastPrice}</span>
            </div>
          )}
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <CardTitle>Booking Details</CardTitle>
          <div className="text-primary/90">
            <div>Room booked by {booking.userName} for {dayCount} days = {moment(booking.bookedAt).fromNow()}</div>
            <div>Check-in {startDate} at 5PM</div>
            <div>Check-out {endDate} at 5PM</div>
            {booking.breakFastIncluded && <div>
                Breakfast  Included
            </div>}
            {booking.paymentStatus ? <div className="text-teal-500">
                Paid: ${booking.totalPrice}- Room Reserved
            </div> : <div className="text-rose-500">
                Not Paid ${booking.totalPrice} - Room Not Reserved
            </div>}

          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
 <Button disabled ={bookingIsLoading} variant="secondary" onClick={()=>router.push(`/hotel-details/${Hotel.id}`)}>View Hotel</Button>
    {!booking.paymentStatus && booking.userId === userId  &&   <Button disabled = {bookingIsLoading} onClick={()=> handleBookRoom()}>{bookingIsLoading ? "Processing...": "Pay Now"}</Button>
}
      </CardFooter>
   
    </Card>
  );
};

export default MyBookingsClient;
