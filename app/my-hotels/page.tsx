import { getHotelsbyUserId } from "@/actions/getHotelsByUserId";
import HotelList from "@/components/hotel/HotelList";

const myHotels = async () => {
    const hotels = await getHotelsbyUserId()
    if(!hotels) return  <div>No Hotels Found</div>;
    return ( <div>
       <h2 className="text-2xl font-semibold">Here are your hotels.</h2> 
       <HotelList hotels={hotels}/>
    </div> );
}
 
export default myHotels;