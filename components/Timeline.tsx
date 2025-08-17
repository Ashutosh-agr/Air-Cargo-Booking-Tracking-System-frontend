export type TimelineItem = {
  title: string
  subtitle?: string
  timestamp?: string
}

export default function Timeline({items}: {items: TimelineItem[]}) {
  return (
    <ul className="relative border-l border-gray-300 pl-4 space-y-4">
      {items.map((it, i) => (
        <li key={i} className="ml-2">
          <div className="absolute -left-2 w-4 h-4 bg-indigo-600 rounded-full" />
          <p className="font-semibold text-gray-800">{it.title}</p>
          {it.subtitle && (
            <p className="text-sm text-gray-600">{it.subtitle}</p>
          )}
          {it.timestamp && (
            <span className="text-xs text-gray-500">{it.timestamp}</span>
          )}
        </li>
      ))}
    </ul>
  )
}
