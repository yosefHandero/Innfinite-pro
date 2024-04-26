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
  Loader2,
  Mountain,
  PencilIcon,
  Ship,
  Trash,
  Trees,
  Tv,
  User,
  UtensilsCrossed,
  VolumeX,
  Wand2,
  Wifi,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddRoomForm from "./AddRoomForm";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { DatePickerWithRange } from "./DateRangePicker";
import { DateRange } from "react-day-picker";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { useAuth } from "@clerk/nextjs";
import useBookRoom from "@/hooks/useBookRoom";
import { Client } from "@clerk/nextjs/server";
// import { Value } from "@radix-ui/react-select";

interface RoomCardProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room: Room;
  bookings?: Booking[];
}
const RoomCard = ({ hotel, room, bookings = [] }: RoomCardProps) => {
  const {setRoomData,
     paymentIntentId,
     setClientSecret, 
    setPaymentIntentId
  } = useBookRoom()
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [totalPrice, setTotalPrice] = useState(room.roomPrice);
  const [includeBreakFast, setIncludeBreakFast] = useState(false);
  const [days, setDays] = useState(1);

  const pathname = usePathname();
  const { toast } = useToast();
  const {userId} = useAuth();
  const router = useRouter();
  const HotelDetailsPage = pathname.includes("hotel-details");
  const isBookRoom = pathname.includes('book-room');

useEffect(() => {
  if (date && date.from && date.to) {
    const dayCount = differenceInCalendarDays(date.to, date.from);
    setDays(dayCount);
    if (dayCount && room.roomPrice) {
      if (includeBreakFast && room.breakFastPrice) {
        setTotalPrice((dayCount * room.roomPrice) + (dayCount * room.breakFastPrice));
      } else {
        setTotalPrice(dayCount * room.roomPrice);
      }
    } else {
      setTotalPrice(room.roomPrice);
    }
  }
}, [date, room.roomPrice, includeBreakFast]);

const disabledDates = useMemo(()=> {
let dates: Date[]= [];
const roomBookings = bookings.filter(booking=>booking.roomId===room.id && booking.paymentStatus)
roomBookings.forEach(booking => {
  const range = eachDayOfInterval({
    start: new Date(booking.startDate),
    end:  new Date(booking.endDate)
  })
  dates = [...dates, ...range]
})
  return dates

}, [bookings])

  const handleDialogueOpen = () => {
    setOpen((prev) => !prev);
  };
  const handleDeleteRoom = (room: Room) => {
    setLoading(true);
    const imageKey = room.image.substring(room.image.lastIndexOf("/") + 1);
    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then(() => {
        axios
          .delete(`/api/room/${room.id}`)
          .then(() => {
            router.refresh();
            toast({
              variant: "success",
              description: "Room Deleted",
            });
          })
          .catch(() => {
            setLoading(false);
          });
        toast({
          variant: "destructive",
          description: "Something went wrong!",
        });
      })
      .catch(() => {
        setLoading(false);
        toast({
          variant: "destructive",
          description: "Something went wrong!",
        });
      });
  };
  const handleBookRoom =   () => {
    if(!userId) return toast({
      variant:"destructive",
      description :"Please login first!"
    })
    if(!hotel?.userId) return toast({
      variant:"destructive",
      description :"Something went wrong!"
    })
    if(date?.from && date?.to){
      setBookingLoading(true)

      const bookingRoomData = {
        room,
        totalPrice,
        breakFastIncluded: includeBreakFast,
        startDate: date.from,
        endDate: date.to,
        
      }
      setRoomData(bookingRoomData)

      fetch('/api/create-payment-intent', {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          booking: {
            hotelOwnerId: hotel.userId,
            hotelId: hotel.id,
            roomId: room.id,
            startDate: date.from,
            endDate: date.to,
            breakFastIncluded:includeBreakFast,
            totalPrice:totalPrice

          },
          payment_intent_id: paymentIntentId
        }),
      }).then((res)=> {
        setBookingLoading(false)
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

    } else {
      toast ({
      variant:"destructive",
      description :"Select date"
    })
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={room.image}
            alt={room.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          <AmenityItem>
            <Bed className="h-4 w-4" />
            {room.bedCount} Bed{"(s)"}
          </AmenityItem>
          <AmenityItem>
            <User className="h-4 w-4" />
            {room.guestCount} Guest{"(s)"}
          </AmenityItem>
          <AmenityItem>
            <Bath className="h-4 w-4" />
            {room.bathroomCount} Bathroom{"(s)"}
          </AmenityItem>
          {!!room.kingBedCount && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {room.kingBedCount} King Bed{"(s)"}
            </AmenityItem>
          )}
          {!!room.queenBedCount && (
            <AmenityItem>
              <Bed className="h-4 w-4" />
              {room.queenBedCount} Queen Bed{"(s)"}
            </AmenityItem>
          )}
          {room.roomService && (
            <AmenityItem>
              <UtensilsCrossed className="h-4 w-4" />
              Room Services
            </AmenityItem>
          )}
          {room.TV && (
            <AmenityItem>
              <Tv className="h-4 w-4" />
              TV
            </AmenityItem>
          )}
          {room.balcony && (
            <AmenityItem>
              <Home className="h-4 w-4" />
              Balcony
            </AmenityItem>
          )}
          {room.Wifi && (
            <AmenityItem>
              <Wifi className="h-4 w-4" />
              Free Wifi
            </AmenityItem>
          )}
          {room.cityView && (
            <AmenityItem>
              <Castle className="h-4 w-4" />
              City View
            </AmenityItem>
          )}
          {room.oceanView && (
            <AmenityItem>
              <Ship className="h-4 w-4" />
              Ocean View
            </AmenityItem>
          )}
          {room.forestView && (
            <AmenityItem>
              <Trees className="h-4 w-4" />
              Forest View
            </AmenityItem>
          )}
          {room.moutainView && (
            <AmenityItem>
              <Mountain className="h-4 w-4" />
              Mountain View
            </AmenityItem>
          )}
          {room.airCondition && (
            <AmenityItem>
              <AirVent className="h-4 w-4" />
              Air Condition
            </AmenityItem>
          )}
          {room.soundProof && (
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
              Room Price: <span className="font-bold">${room.roomPrice}</span>{" "}
              <span className="text-xs"></span>/24hrs
            </div>
          </div>
          {!!room.breakFastPrice && (
            <div>
              BreakFast Price:
              <span className="font-bold">${room.breakFastPrice}</span>
            </div>
          )}
        </div>
        <Separator />
      </CardContent>
      {!isBookRoom &&
      <CardFooter>
        {HotelDetailsPage ? 
          <div className="flex flex-col gap-6">
            <div>
              <div className="mb-2">Select days</div>
              <DatePickerWithRange date={date} setDate={setDate} disabledDates={disabledDates} />
            </div>
            {
              room.breakFastPrice > 0 && <div>
                <div className="mb-2">Do you  want to include breakfast?</div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="breakfast" onCheckedChange={(value)=>setIncludeBreakFast(!!value)}/>
                  <label htmlFor="breakfast">Include breakfast in the price</label>
                </div>
              </div>
            }
            <div>Total Price : <span className="font-bold">${totalPrice}</span> for  <span className="font-bold">{days} Day(s)</span></div>
            <Button onClick={()=> {handleBookRoom()}} disabled = {bookingLoading} type="button"> 
              {bookingLoading ? <Loader2/> : <Wand2 className="mr-2 h-4 w-4"/>}
              {bookingLoading ? 'Loading...' : 'Book Room'}
            </Button>
          </div> :  <div className="flex w-full justify-between">
            <Button
              disabled={loading}
              type="button"
              variant="ghost"
              onClick={() => handleDeleteRoom(room)}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <Button
                  type="button"
                  className="max-w-[150px]"
                  variant="outline"
                >
                  <PencilIcon className="mr-2 h-4 w-4" /> Edit Room
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[900px] w-[90%]">
                <DialogHeader className="px-2">
                  <DialogTitle>Update Room</DialogTitle>
                  <DialogDescription>
                    Please fill out the form to update a room information.
                  </DialogDescription>
                </DialogHeader>
                <AddRoomForm
                  hotel={hotel}
                  room={room}
                  handleDialogueOpen={handleDialogueOpen}
                />
              </DialogContent>
            </Dialog>
          </div>
        }
      </CardFooter>}
    </Card>
  );
};

export default RoomCard;
