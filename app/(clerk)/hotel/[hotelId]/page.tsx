import { getHotelById } from "@/actions/hotel/getHotelById";
import AddHotelForm from "@/components/hotel/AddHotelForm";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

interface HotelPageProps {
  params: {
    hotelId: string;
  };
}

const Hotel = async ({ params }: HotelPageProps) => {
  try {
    const { userId } = auth();

    if (!userId) {
      redirect("/sign-in");
    }

    const hotel = await getHotelById(params.hotelId);

    if (!hotel) {
      notFound();
    }

    if (hotel.userId !== userId) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 min-h-[60vh]">
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-2xl font-semibold">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to edit this hotel.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="py-8 md:py-12">
        <AddHotelForm hotel={hotel} />
      </div>
    );
  } catch (error) {
    console.error("Error loading hotel:", error);
    notFound();
  }
};

export default Hotel;
