"use server";

import connectDB from "../mongodb";
import Booking from "@/database/booking.model";

type CreateBookingResponse =
  | { success: true }
  | { success: false; error: string };

export const createBooking = async ({ eventId, slug, email, }: {
  eventId: string;
  slug: string;
  email: string;
}): Promise<CreateBookingResponse> => {
  try {
    await connectDB();

    const existing = await Booking.findOne({ eventId, email });
    if (existing) {
      return { success: false, error: "You have already booked this event." };
    }

    await Booking.create({ eventId, slug, email });

    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown server error occurred.";

    return { success: false, error: message };
  }
};
