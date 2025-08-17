"use client"
import {useState} from "react"
import {useRouter} from "next/navigation"
// import {logger} from "@/lib/logger"
const logger = {
  info: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.info(...args)
    }
  },
}

export default function BookingSearch() {
  const [refId, setRefId] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (refId.trim()) {
      logger.info("search:submit", {refId})
      router.push(`/bookings/${refId}`)
    }
  }

  return (
    <div className="flex gap-2">
      <input
        value={refId}
        onChange={(e) => setRefId(e.target.value)}
        placeholder="Enter Booking Reference ID"
        className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            handleSearch()
          }
        }}
      />
      <button
        onClick={handleSearch}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg transition"
      >
        Search
      </button>
    </div>
  )
}
