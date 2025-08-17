"use client"
import {use, useEffect, useState} from "react"
import api from "@/lib/api"
import {logger} from "@/lib/logger"
import StatusBadge from "@/components/StatusBadge"
import Timeline, {TimelineItem} from "@/components/Timeline"
import JourneyLine from "@/components/JourneyLine"

type BookingEvent = {
  eventType: string
  location: string
  flightNumber?: string
  timestamp: string
}

type BookingData = {
  refId: string
  bookingStatus: string
  origin: string
  destination: string
  pieces: number
  weightKg: number
  event?: BookingEvent[]
}

export default function BookingDetail({
  params,
}: {
  params: Promise<{refId: string}>
}) {
  const {refId} = use(params)
  const [data, setData] = useState<BookingData | null>(null)

  useEffect(() => {
    async function fetchBooking() {
      try {
        logger.info("booking:detail:fetch", {refId})
        const res = await api.get(`/bookings/${refId}`)
        setData(res.data)
      } catch (err) {
        logger.error("booking:detail:error", err)
      }
    }
    fetchBooking()
  }, [refId])

  if (!data)
    return (
      <main className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
        <div className="text-gray-600">Loading booking details…</div>
      </main>
    )

  const timeline: TimelineItem[] = (data.event ?? []).map((e) => ({
    title: e.eventType,
    subtitle: `${e.location}${
      e.flightNumber ? ` – Flight ${e.flightNumber}` : ""
    }`,
    timestamp: e.timestamp,
  }))

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Booking #{data.refId}
          </h2>
          <StatusBadge status={data.bookingStatus} />
        </div>

        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Route:</strong> {data.origin} → {data.destination}
          </p>
          <p>
            <strong>Pieces:</strong> {data.pieces}, <strong>Weight:</strong>{" "}
            {data.weightKg} kg
          </p>
          <div className="mt-4">
            <JourneyLine
              origin={data.origin}
              destination={data.destination}
              events={(data.event ?? []).map((e) => ({
                label: e.location,
                timestamp: e.timestamp,
              }))}
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6">Timeline</h3>
        <Timeline items={timeline} />
      </div>
    </main>
  )
}
