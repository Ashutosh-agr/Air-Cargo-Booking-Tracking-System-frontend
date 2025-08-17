import BookingForm from "@/components/BookingForm"
import BookingActions from "@/components/BookingActions"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8">
        <section className="bg-white shadow-lg rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Create New Booking
          </h1>
          <p className="text-gray-500 mb-6">
            Fill in the booking details below and start tracking your cargo
            immediately.
          </p>
          <BookingForm />
        </section>

        <section className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Update Booking Status
          </h2>
          <p className="text-gray-500 mb-6">
            Use these quick actions to mark a booking as departed, arrived, or
            canceled.
          </p>
          <BookingActions />
        </section>
      </div>
    </main>
  )
}
