"use client"
import {useState} from "react"
import api from "@/lib/api"
import {logger} from "@/lib/logger"

type FlightRequest = {
  flightNumber: string
  airlineName: string
  departureTime: string // ISO string
  arrivalTime: string // ISO string
  origin: string
  destination: string
}

type FlightResponse = {
  id?: string | number
  flightNumber: string
  airlineName: string
  departureTime: string
  arrivalTime: string
  origin: string
  destination: string
}

function toIsoFromLocal(dtLocal: string) {
  // dtLocal like "2025-08-16T12:30" -> ISO in UTC
  if (!dtLocal) return ""
  const d = new Date(dtLocal)
  return d.toISOString()
}

export default function FlightForm() {
  const [form, setForm] = useState<FlightRequest>({
    flightNumber: "",
    airlineName: "",
    departureTime: "",
    arrivalTime: "",
    origin: "",
    destination: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState<FlightResponse | null>(null)

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target
    setForm((prev) => ({...prev, [name]: value}))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setCreated(null)
    try {
      const payload: FlightRequest = {
        ...form,
        departureTime: toIsoFromLocal(form.departureTime),
        arrivalTime: toIsoFromLocal(form.arrivalTime),
      }
      logger.info("flights:create:submit", payload)
      const res = await api.post<FlightResponse>("/flight", payload)
      setCreated(res.data)
      logger.info("flights:create:success", res.data)
    } catch (err) {
      logger.error("flights:create:error", err)
      alert("Failed to create flight")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="flightNumber"
            >
              Flight Number
            </label>
            <input
              id="flightNumber"
              name="flightNumber"
              value={form.flightNumber}
              onChange={onChange}
              className="mt-1 w-full rounded-lg border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="AI-101"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="airlineName"
            >
              Airline
            </label>
            <input
              id="airlineName"
              name="airlineName"
              value={form.airlineName}
              onChange={onChange}
              className="mt-1 w-full rounded-lg border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Air India"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="origin">
              Origin
            </label>
            <input
              id="origin"
              name="origin"
              value={form.origin}
              onChange={onChange}
              className="mt-1 w-full rounded-lg border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="DEL"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="destination"
            >
              Destination
            </label>
            <input
              id="destination"
              name="destination"
              value={form.destination}
              onChange={onChange}
              className="mt-1 w-full rounded-lg border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="BOM"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="departureTime"
            >
              Departure Time
            </label>
            <input
              id="departureTime"
              name="departureTime"
              type="datetime-local"
              value={form.departureTime}
              onChange={onChange}
              className="mt-1 w-full rounded-lg border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="arrivalTime"
            >
              Arrival Time
            </label>
            <input
              id="arrivalTime"
              name="arrivalTime"
              type="datetime-local"
              value={form.arrivalTime}
              onChange={onChange}
              className="mt-1 w-full rounded-lg border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create Flight"}
        </button>
      </form>

      {created && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <p className="font-semibold">Flight created successfully</p>
          <div className="mt-1 text-green-900 space-y-1">
            {created.id && <div>ID: {String(created.id)}</div>}
            <div>
              {created.flightNumber} • {created.airlineName}
            </div>
            <div>
              {created.origin} → {created.destination}
            </div>
            <div>
              {new Date(created.departureTime).toLocaleString()} →{" "}
              {new Date(created.arrivalTime).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
