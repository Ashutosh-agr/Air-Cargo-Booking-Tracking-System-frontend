type EventPoint = {
  label?: string
  timestamp?: string
}

export default function JourneyLine({
  origin,
  destination,
  events = [],
}: {
  origin: string
  destination: string
  events?: EventPoint[]
}) {
  const points = [{label: origin}, ...events, {label: destination}]
  const count = points.length

  return (
    <div className="w-full">
      <div className="relative h-10">
        {/* base line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 rounded" />
        {points.map((p, i) => {
          const left = count > 1 ? (i / (count - 1)) * 100 : 0
          const isEdge = i === 0 || i === count - 1
          return (
            <div
              key={i}
              className="absolute -translate-x-1/2 top-1/2 -translate-y-1/2 text-center"
              style={{left: `${left}%`}}
            >
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  isEdge
                    ? "bg-indigo-600 border-indigo-600"
                    : "bg-white border-indigo-500"
                }`}
                title={p.label || p.timestamp}
              />
            </div>
          )
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-600 mt-2">
        <span className="font-semibold">{origin}</span>
        <span className="font-semibold">{destination}</span>
      </div>
    </div>
  )
}
