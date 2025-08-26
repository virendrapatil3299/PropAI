"use client"

import { useEffect, useState } from "react"

type CrimeRateStats = {
  population: number
  stats: Record<string, { count: number; rate: number }>
}

type Props = {
  lat: number
  lon: number
}

export default function CRIMEPAGE({ lat, lon }: Props) {
  const [data, setData] = useState<CrimeRateStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!lat || !lon) return

    const fetchCrime = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `/api/la-crime?crimeRate=true&lat=${lat}&lon=${lon}`
        )
        const text = await res.text()

        if (!res.ok) throw new Error(text)

        const json = JSON.parse(text)
        if (!json.stats || !json.population)
          throw new Error("Unexpected API response structure")
        setData(json)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Unknown error")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCrime()
  }, [lat, lon])

  if (loading)
    return (
      <p className="p-4 text-gray-600 font-medium">
        Loading crime data for ({lat}, {lon})...
      </p>
    )

  if (error)
    return (
      <p className="p-4 text-red-600 font-semibold">
        Error fetching crime data: {error}
      </p>
    )

  if (!data) return <p>No data available.</p>

  return (
    <div className="p-4 border rounded-lg bg-gray-50 shadow-md">
      <h2 className="text-lg font-semibold mb-2">
        Crime Rate Stats (per 100k residents)
      </h2>
      <p className="text-sm text-gray-700 mb-4">
        Population considered: {data.population.toLocaleString()}
      </p>

      <table className="table-auto border-collapse w-full text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1 text-left">Year</th>
            <th className="border px-2 py-1 text-left">Number of Crimes</th>
            <th className="border px-2 py-1 text-left">Rate /100k</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data.stats).map(([year, stats]) => (
            <tr key={year} className="hover:bg-gray-100">
              <td className="border px-2 py-1">{year}</td>
              <td className="border px-2 py-1">{stats.count}</td>
              <td className="border px-2 py-1">{stats.rate.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
