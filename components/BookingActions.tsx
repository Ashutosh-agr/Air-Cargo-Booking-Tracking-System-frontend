"use client"
import {useState} from "react"
import api from "@/lib/api"
import {logger} from "@/lib/logger"

export default function BookingActions() {
  const [refId, setRefId] = useState("")
  const [flightNumber, setFlightNumber] = useState("")
  const [loading, setLoading] = useState<"depart" | "arrive" | "cancel" | null>(
    null
  )
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isFlightNumber = (v: string) => /^[\w-]+$/.test(v.trim())

  const resetMessages = () => {
    setMessage(null)
    setError(null)
  }

  function getAxiosResponse(
    err: unknown
  ): {status?: number; data?: unknown} | undefined {
    if (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      typeof (err as {response?: unknown}).response === "object"
    ) {
      return (err as {response?: {status?: number; data?: unknown}}).response
    }
    return undefined
  }

  async function callPatch(kind: "depart" | "arrive" | "cancel") {
    resetMessages()
    if (!refId.trim()) {
      setError("Reference ID is required")
      return
    }
    if (kind === "depart" || kind === "arrive") {
      if (!flightNumber.trim()) {
        setError("Flight number is required for depart/arrive")
        return
      }
      if (!isFlightNumber(flightNumber)) {
        setError("Flight number can contain letters, numbers, and dashes only")
        return
      }
    }
    try {
      setLoading(kind)
      const url = `/bookings/${encodeURIComponent(refId)}/${kind}`
      const config =
        kind === "cancel" ? undefined : ({params: {flightNumber}} as const)
      logger.info(`booking:${kind}:submit`, {refId, flightNumber})
      const res = await api.patch(url, undefined, config)
      logger.info(`booking:${kind}:success`, res.data)
      setMessage(`Booking ${kind} action completed successfully`)
    } catch (err: unknown) {
      logger.error(`booking:${kind}:error`, err)
      const resp = getAxiosResponse(err)
      const backendMsg =
        typeof resp?.data === "string"
          ? resp?.data
          : typeof (resp?.data as {message?: unknown})?.message === "string"
          ? (resp?.data as {message?: string}).message
          : undefined
      const msg =
        backendMsg ||
        (err instanceof Error
          ? err.message
          : "Action failed. Please try again.")
      setError(msg)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1" htmlFor="refId">
            Reference ID
          </label>
          <input
            id="refId"
            value={refId}
            onChange={(e) => setRefId(e.target.value)}
            placeholder="Enter booking reference"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="flightNumber">
            Flight Number
          </label>
          <input
            id="flightNumber"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            placeholder="e.g., AI202 (required for Depart/Arrive)"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          />
        </div>
      </div>

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-green-800 text-sm">
          <div>{message}</div>
          {refId && (
            <a
              href={`/bookings/${encodeURIComponent(refId)}`}
              className="underline text-green-900 hover:text-green-700"
            >
              View details
            </a>
          )}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => callPatch("depart")}
          disabled={loading !== null}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-60"
        >
          {loading === "depart" ? "Departing..." : "Mark as Departed"}
        </button>
        <button
          onClick={() => callPatch("arrive")}
          disabled={loading !== null}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-60"
        >
          {loading === "arrive" ? "Arriving..." : "Mark as Arrived"}
        </button>
        <button
          onClick={() => callPatch("cancel")}
          disabled={loading !== null}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-60"
        >
          {loading === "cancel" ? "Cancelling..." : "Cancel Booking"}
        </button>
      </div>
    </div>
  )
}
