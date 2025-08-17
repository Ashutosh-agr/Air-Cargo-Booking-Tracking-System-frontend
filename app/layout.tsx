import "./globals.css"
import Link from "next/link"

export const metadata = {
  title: "Air Cargo Booking & Tracking Portal",
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <header className="border-b bg-white sticky top-0 z-30 shadow">
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-lg font-semibold text-indigo-700 text-center md:text-left">
                Air Cargo Booking & Tracking Portal
              </h1>
              <nav className="text-sm text-gray-700 flex flex-wrap justify-center md:justify-end gap-6">
                <Link
                  href="/"
                  className="hover:text-indigo-600 font-medium px-2 py-1 rounded transition-colors"
                >
                  Booking
                </Link>
                <Link
                  href="/bookings/history"
                  className="hover:text-indigo-600 font-medium px-2 py-1 rounded transition-colors"
                >
                  History
                </Link>
                <Link
                  href="/flights"
                  className="hover:text-indigo-600 font-medium px-2 py-1 rounded transition-colors"
                >
                  Flights
                </Link>
              </nav>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
