"use client"
import {useState} from "react"
import {useRouter} from "next/navigation"
import api from "@/lib/api"
import {logger} from "@/lib/logger"

type BookingFormFields = {
  refId: string
  origin: string
  destination: string
  pieces: number
  weightKg: number
}

export default function BookingForm() {
  const router = useRouter()
  const [form, setForm] = useState<BookingFormFields>({
    refId: "",
    origin: "",
    destination: "",
    pieces: 1,
    weightKg: 1,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target
    if (name === "pieces") {
      const v = Math.max(1, parseInt(value || "0", 10))
      setForm({...form, pieces: v})
      return
    }
    if (name === "weightKg") {
      const v = Math.max(0, parseInt(value || "0", 10))
      setForm({...form, weightKg: v})
      return
    }
    if (name === "origin" || name === "destination") {
      setForm({...form, [name]: value.toUpperCase()})
      return
    }
    setForm({...form, [name]: value})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      logger.info("booking:create:submit", form)
      const res = await api.post("/bookings", form)
      // Navigate to detail page for the created or existing booking
      router.push(`/bookings/${encodeURIComponent(form.refId)}`)
      logger.info("booking:create:success", res.data)
    } catch (err) {
      logger.error("booking:create:error", err)
      alert("❌ Failed to create booking.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1" htmlFor="refId">
          Reference ID
        </label>
        <input
          id="refId"
          name="refId"
          type="text"
          value={form.refId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1" htmlFor="origin">
            Origin
          </label>
          <input
            id="origin"
            name="origin"
            type="text"
            value={form.origin}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="destination">
            Destination
          </label>
          <input
            id="destination"
            name="destination"
            type="text"
            value={form.destination}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1" htmlFor="pieces">
            Pieces
          </label>
          <input
            id="pieces"
            name="pieces"
            type="number"
            min={1}
            value={form.pieces}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="weightKg">
            Weight (kg)
          </label>
          <input
            id="weightKg"
            name="weightKg"
            type="number"
            min={0}
            step={0.01}
            value={form.weightKg}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 disabled:opacity-60 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        {loading ? "Creating..." : "Create Booking"}
      </button>
    </form>
  )
}
