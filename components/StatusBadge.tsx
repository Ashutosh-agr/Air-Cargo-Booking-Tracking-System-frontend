type Props = {status: string}

const colors: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  SCHEDULED: "bg-blue-100 text-blue-700 border-blue-200",
  DEFAULT: "bg-gray-100 text-gray-700 border-gray-200",
}

export default function StatusBadge({status}: Props) {
  const key = (status || "").toUpperCase()
  const cls = colors[key] ?? colors.DEFAULT
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${cls}`}
    >
      {status}
    </span>
  )
}
