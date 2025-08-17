"use client"
import {useState} from "react"
import api from "@/lib/api"
import {logger} from "@/lib/logger"
import FlightForm from "@/components/FlightForm"
import JourneyLine from "@/components/JourneyLine"

type Flight = {
  id?: string
  flightNumber: string
  airlineName: string
  departureTime: string
  arrivalTime: string
  origin: string
  destination: string
}

type OneStop = {
  firstLeg: Flight
  secondLeg: Flight
}

type FlightRouteResponse = {
  direct: Flight[]
  oneStop: OneStop[]
}

function toISODate(dateStr: string) {
  // Input like 2025-08-16 -> 2025-08-16 (already ISO date). Backend expects ISO.DATE.
  return dateStr
}

export default function FlightsPage() {
  const [direct, setDirect] = useState<Flight[]>([])
  const [oneStop, setOneStop] = useState<OneStop[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [departureDate, setDepartureDate] = useState("")

  async function loadRoutes() {
    setLoading(true)
    setError(null)
    try {
      const params = {
        origin,
        destination,
        departureDate: toISODate(departureDate),
      }
      logger.info("flights:routes:fetch", params)
      const res = await api.get<FlightRouteResponse>("/flight/routes", {params})
      const data = res.data
      setDirect(Array.isArray(data?.direct) ? data.direct : [])
      setOneStop(Array.isArray(data?.oneStop) ? data.oneStop : [])
    } catch (err: unknown) {
      logger.error("flights:routes:error", err)
      const status =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as {response?: {status?: number}}).response === "object"
          ? (err as {response?: {status?: number}}).response?.status
          : undefined
      const message =
        status === 404
          ? "No routes found for the given criteria. Try different values."
          : err instanceof Error
          ? err.message
          : "Failed to load routes"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-[1.3fr_1fr]">
        <section className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Available Routes</h2>
            {loading && <span className="text-sm text-gray-500">Loading…</span>}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!origin || !destination || !departureDate) {
                setError("Please fill origin, destination and date")
                return
              }
              loadRoutes()
            }}
            className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3"
          >
            <input
              placeholder="Origin (e.g., DEL)"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="rounded-lg border p-2"
              required
            />
            <input
              placeholder="Destination (e.g., BOM)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="rounded-lg border p-2"
              required
            />
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="rounded-lg border p-2"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Search
            </button>
          </form>
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">
                Direct flights
              </h3>
              <div className="space-y-3">
                {direct.map((f, idx) => (
                  <div
                    key={(f.id ?? `${f.flightNumber}-${idx}`) + "-direct"}
                    className="border rounded-xl p-4 flex flex-col gap-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-semibold">
                        {f.flightNumber} • {f.airlineName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(f.departureTime).toLocaleString()} →{" "}
                        {new Date(f.arrivalTime).toLocaleString()}
                      </div>
                    </div>
                    <JourneyLine
                      origin={f.origin}
                      destination={f.destination}
                    />
                  </div>
                ))}
                {!loading && direct.length === 0 && (
                  <div className="text-sm text-gray-500">No direct flights</div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">
                One-stop flights
              </h3>
              <div className="space-y-3">
                {oneStop.map((leg, idx) => (
                  <div
                    key={`${leg.firstLeg.flightNumber}-${leg.secondLeg.flightNumber}-${idx}`}
                    className="border rounded-xl p-4 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-semibold">
                        {leg.firstLeg.flightNumber} • {leg.firstLeg.airlineName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(leg.firstLeg.departureTime).toLocaleString()}{" "}
                        → {new Date(leg.firstLeg.arrivalTime).toLocaleString()}
                      </div>
                    </div>
                    <JourneyLine
                      origin={leg.firstLeg.origin}
                      destination={leg.firstLeg.destination}
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-semibold">
                        {leg.secondLeg.flightNumber} •{" "}
                        {leg.secondLeg.airlineName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(leg.secondLeg.departureTime).toLocaleString()}{" "}
                        → {new Date(leg.secondLeg.arrivalTime).toLocaleString()}
                      </div>
                    </div>
                    <JourneyLine
                      origin={leg.secondLeg.origin}
                      destination={leg.secondLeg.destination}
                    />
                  </div>
                ))}
                {!loading && oneStop.length === 0 && (
                  <div className="text-sm text-gray-500">
                    No one-stop options
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Flight</h2>
          <FlightForm />
        </section>
      </div>
    </main>
  )
}
