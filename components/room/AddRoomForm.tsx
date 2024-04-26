'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Hotel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { Loader2, Pencil, XCircle } from "lucide-react";
import { UploadButton } from "../uploadthing";
import { useRouter } from "next/navigation";

interface AddRoomFormProps{
    hotel?: Hotel & {
        rooms: Room[]
    }
    room?  : Room;
    handleDialogueOpen: ()=> void;
}
const formSchema = z.object({
title: z.string().min(3, {
    message: "Title must be at least 3 characters long"
}),
description: z.string().min(10, {
    message: "Description must be at least 10 characters long"
}),
bedCount: z.coerce.number().min(1, {message: 'Bed count is required'}),
guestCount: z.coerce.number().min(1, {message: 'Guest count is required'}),
bathroomCount: z.coerce.number().min(1, {message: 'Bathroom count is required'}),
kingBedCount: z.coerce.number().min(0),
queenBedCount: z.coerce.number().min(0),
image: z.string().min(1, {
    message: "Image is required"
}),
breakFastPrice: z.coerce.number().optional(),
roomPrice: z.coerce.number().min(1, {message: 'Rooom price is required'}),
roomService: z.boolean().optional(),
coffeeshop: z.boolean().optional(),
TV: z.boolean().optional(),
balcony: z.boolean().optional(),
Wifi: z.boolean().optional(),
cityView: z.boolean().optional(),
oceanView: z.boolean().optional(),
forestView: z.boolean().optional(),
moutainView: z.boolean().optional(),
soundProof: z.boolean().optional(),
airCondition: z.boolean().optional(),
})
const AddRoomForm = ({hotel, room, handleDialogueOpen}: AddRoomFormProps) => {
      const [image, setImage] = useState<string | undefined>(room?.image);
  const [loading, setLoading] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const {toast} = useToast()
  const router = useRouter();

      const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: room || {
     title: '',
description:'',
bedCount: 0,
guestCount:0,
bathroomCount:0,
kingBedCount:0,
queenBedCount:0,
image: '',
breakFastPrice:0,
roomPrice:0,
roomService:false,
coffeeshop:  false,
TV:false,
balcony:false,
Wifi:false,
cityView:false,
oceanView:false,
forestView:false,
moutainView:false,
soundProof:false,
airCondition:false
    },
  });
    useEffect(() => {
    if (typeof image === "string") {
      form.setValue("image", image, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [image]);
    const handleDeletingImage =
    (image: string) => async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation(); // Prevents the event from propagating further up the DOM
      setDeletingImage(true);
      const imageKey = image.substring(image.lastIndexOf("/") + 1);

      try {
        const res = await axios.post("/api/uploadthing/delete", { imageKey });
        if (res.data.success) {
          setImage("");
          toast({
            variant: "success",
            title: "Image deleted successfully.",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to delete image.",
        });
      } finally {
        setDeletingImage(false);
      }
    };
   const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setLoading(true);
    if (hotel && room) {
      //update
      axios
        .patch(`/api/room/${room.id}`, values)
        .then((res) => {
          toast({
            variant: "success",
            description: "Room updated",
          });
          router.refresh();
          setLoading(false);
          handleDialogueOpen();
        })
        .catch((err) => {
          console.log("error", err.response?.data);
          toast({
            variant: "destructive",
            description: "Something went wrong",
          });
          setLoading(false);
        });
    } else {
        if(!hotel) return
      axios
        .post("/api/room", {...values,  hotelId: hotel!.id})
        //something dif at hotelId
        .then((res) => {
          toast({
            variant: "success",
            description: "Room created",
          });
          router.refresh();
          setLoading(false);
          handleDialogueOpen();
        })
        .catch((err) => {
          console.log("error", err.response?.data);
          toast({
            variant: "destructive",
            description: "Something went wrong",
          });
          setLoading(false);
        });
    }
  };
    return ( <div className="max-h-[75vh] overflow-y-auto px-2">
        <Form {...form}>
            <form className="spac-y-6">
                       <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Ttitle *</FormLabel>
                    <FormDescription>Provide your room name</FormDescription>
                    <FormControl>
                      <Input placeholder="Double Room" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Description *</FormLabel>
                    <FormDescription>
                        Provide a detailed description of the room
                    </FormDescription>
                    <FormControl>
                      <Textarea placeholder="
                      Describe your double room here...
                      " {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>Choose Room Amenities</FormLabel>
                <FormDescription>
                    What makes this room a good choice
                </FormDescription>
                <div className="grid grid-cols-2 gap-2 mr-2">
                   <FormField
                    control={form.control}
                    name="roomService"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Room Service</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                       <FormField
                    control={form.control}
                    name="TV"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>TV</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                       <FormField
                    control={form.control}
                    name="balcony"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Balcony</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                       <FormField
                    control={form.control}
                    name="Wifi"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Free wifi</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                       <FormField
                    control={form.control}
                    name="cityView"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>City View</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                       <FormField
                    control={form.control}
                    name="oceanView"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Ocean View</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                    <FormField
                    control={form.control}
                    name="forestView"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Forest View</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                                   <FormField
                    control={form.control}
                    name="moutainView"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Mountain View</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                                   <FormField
                    control={form.control}
                    name="soundProof"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Sound Proofed</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                                   <FormField
                    control={form.control}
                    name="airCondition"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Air Condition</FormLabel>
                        <FormMessage />
                      </FormItem>
                      
                    )}
                  />
                </div>
              </div>
                    <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-3">
                    <FormLabel>Upload an Image </FormLabel>
                    <FormDescription>
                      Upload a picture of your room
                    </FormDescription>
                    <FormControl>
                      {image ? (
                        <>
                          <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                            <Image
                              fill
                              src={image}
                              alt="Hotel Image"
                              className="object-contain"
                            />

                            <Button
                              onClick={(event) =>
                                handleDeletingImage(image)(event)
                              }
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="absolute right-[-12px] top-0"
                            >
                              {deletingImage ? <Loader2 /> : <XCircle />}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex  flex-col items-center border-dashed pt-4 border border-primary/50 rounded-md ">
                            <UploadButton
                              endpoint="imageUploader"
                              onClientUploadComplete={(res) => {
                                // Do something with the response
                                console.log("Files: ", res);
                                setImage(res[0].url);
                                toast({
                                  variant: "success",
                                  description: "Upload  successful",
                                });
                              }}
                              onUploadError={(error: Error) => {
                                // Do something with the error.
                                toast({
                                  variant: "destructive",
                                  description: `ERROR! ${error.message}`,
                                });
                              }}
                            />
                          </div>
                        </>
                      )}
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-row gap-6">
                <div className="flex-1 flex flex-col gap-6">
                 <FormField
                control={form.control}
                name="roomPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Price in $*</FormLabel>
                    <FormDescription>
                        Please enter room price per night.
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0}{...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bedCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Count *</FormLabel>
                    <FormDescription>
                        How many beds are there in this room?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8}{...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Count *</FormLabel>
                    <FormDescription>
                        If the number of guests is different from the bed count, please specify here.
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0}{...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathroomCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathroom Count *</FormLabel>
                    <FormDescription>
                        How many bathrooms does this room have?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                </div>
                <div className="flex-1 flex flex-col gap-6">
                     <FormField
                control={form.control}
                name="breakFastPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breakfast Price in $ </FormLabel>
                    <FormDescription>
                        What price do you charge for breakfast in this room per night?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0}{...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kingBedCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>King Beds </FormLabel>
                    <FormDescription>
                        How many Kingbeds are there in this room?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8}{...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="queenBedCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Queen beds</FormLabel>
                    <FormDescription>
                        If your hotel has queen beds, how many does this room have?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0}{...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                </div>
              </div>
              <div className="pt-4 pb-2">
                                {room ? (
                  <Button type="button" onClick={form.handleSubmit(onSubmit)} className="max-w-[150px]" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4" /> Updating
                      </>
                    ) : (
                      <>
                        <Pencil className="mr-2 h-4 w-4" />
                        Update
                      </>
                    )}
                  </Button>
                ) : (
                  <Button  onClick={form.handleSubmit(onSubmit)} type="button" disabled={loading} className="max-w-[150px]">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4" /> Creating
                      </>
                    ) : (
                      <>
                        <Pencil className="mr-2 h-4 w-4" />
                        Create Room
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
        </Form>
    </div> );
}
 
export default AddRoomForm;