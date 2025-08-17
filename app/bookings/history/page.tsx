"use client"
import BookingSearch from "@/components/BookingSearch"

export default function BookingHistoryHome() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <section className="bg-white shadow-lg rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Track Booking
          </h1>
          <p className="text-gray-500 mb-6">
            Search your booking by reference ID and check its latest status with
            full timeline history.
          </p>
          <BookingSearch />
        </section>
      </div>
    </main>
  )
}
