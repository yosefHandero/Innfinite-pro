import AddHotelForm from "@/components/hotel/AddHotelForm";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const NewHotel = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="py-8">
      <AddHotelForm hotel={null} />
    </div>
  );
};

export default NewHotel;
