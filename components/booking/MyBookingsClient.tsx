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
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface MyBookingsClientProps {
booking:Booking & {Room:Room | null} &{Hotel:Hotel | null};
index?: number;
}
const MyBookingsClient: React.FC<MyBookingsClientProps> = ({ booking, index = 0 }) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-lg line-clamp-1">{Hotel.title}</CardTitle>
          {booking.paymentStatus ? (
            <Badge variant="success" className="flex-shrink-0">
              <CheckCircle className="h-3 w-3 mr-1" />
              Paid
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex-shrink-0">
              <XCircle className="h-3 w-3 mr-1" />
              Unpaid
            </Badge>
          )}
        </div>
        <CardDescription className="space-y-2">
          <AmenityItem>
            <MapPin className="size-4"/>
            {country?.name}, {state?.name}, {Hotel.city}
          </AmenityItem>
          <p className="text-sm text-muted-foreground line-clamp-2">{Hotel.locationDescription}</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div>
          <h3 className="font-semibold text-base mb-1">{Room.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{Room.description}</p>
        </div>
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg bg-muted">
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
        <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm">Booking Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-in</span>
              <span className="font-medium">{startDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-out</span>
              <span className="font-medium">{endDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium">{dayCount} night{dayCount > 1 ? 's' : ''}</span>
            </div>
            {booking.breakFastIncluded && (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Breakfast included</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Total</span>
              <span className="text-xl font-bold">${booking.totalPrice}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Booked {moment(booking.bookedAt).fromNow()}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-2 pt-4">
        <Button 
          disabled={bookingIsLoading} 
          variant="outline" 
          onClick={()=>router.push(`/hotel-details/${Hotel.id}`)}
          className="flex-1"
        >
          View Hotel
        </Button>
        {!booking.paymentStatus && booking.userId === userId && (
          <Button 
            disabled={bookingIsLoading} 
            onClick={()=> handleBookRoom()}
            className="flex-1"
          >
            {bookingIsLoading ? "Processing..." : "Pay Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
    </motion.div>
  );
};

export default MyBookingsClient;
