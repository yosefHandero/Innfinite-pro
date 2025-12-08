import prismadb from "@/lib/prismadb";

export const getHotels = async (searchParams: {
    title?: string;
    country?: string;
    state?: string;
    city?: string;
}) => {
  try {
    const { title, country, state, city } = searchParams;

    // Build dynamic where clause
    const where: any = {};

    // Only add title filter if it's not empty
    if (title && title.trim().length > 0) {
      where.title = {
        contains: title.trim(),
        mode: 'insensitive', // Case-insensitive search
      };
    }

    // Only add location filters if they're not empty
    if (country && country.trim().length > 0) {
      where.country = country.trim();
    }

    if (state && state.trim().length > 0) {
      where.state = state.trim();
    }

    if (city && city.trim().length > 0) {
      where.city = city.trim();
    }

    const hotels = await prismadb.hotel.findMany({
      where,
      include: { rooms: true },
      orderBy: { addedAt: 'desc' },
    });

    return hotels;
  } catch (error: unknown) {
    console.error('Error fetching hotels:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch hotels');
  }
};
