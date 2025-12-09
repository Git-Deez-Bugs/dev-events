"use client";

import { useState } from "react";
import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

export default function BookEvent({ eventId, slug }: { eventId: string; slug: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await createBooking({ eventId, slug, email });

    if (response.success) {
      setSubmitted(true);
      setErrorMessage(null);
      posthog.capture("event_booked", { eventId, slug, email });
    } else {
      setErrorMessage(response.error); // SAFE now
      console.error("Booking failed:", response.error);
      posthog.capture("booking_failed", { eventId, slug, email, error: response.error });
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="button-submit">Submit</button>

          {errorMessage && (
            <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
          )}
        </form>
      )}
    </div>
  );
}
