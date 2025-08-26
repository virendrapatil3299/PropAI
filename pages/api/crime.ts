// pages/api/la-crime.ts
import type { NextApiRequest, NextApiResponse } from "next"

const BASE_URL = "https://data.lacity.org/resource/2nrs-mtv8.json"

// Approx LA population
const LA_POPULATION = 3898747

// Haversine formula to calculate distance in meters between two lat/lon points
function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000 // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { limit = "1000", crimeRate, lat, lon, radius = "5000" } = req.query

  const parsedLimit = parseInt(limit as string, 10)
  if (isNaN(parsedLimit) || parsedLimit <= 0) {
    return res.status(400).json({ error: "Invalid limit parameter" })
  }

  const latNum = lat ? parseFloat(lat as string) : null
  const lonNum = lon ? parseFloat(lon as string) : null
  const radNum = parseInt(radius as string, 10) || 5000

  if (!latNum || !lonNum) {
    return res.status(400).json({ error: "lat and lon are required for location search" })
  }

  const params = new URLSearchParams({
    $limit: "5000", // fetch enough to filter manually
  })

  const url = `${BASE_URL}?${params.toString()}`
  console.log("Fetching LA crime data:", url)

  try {
    const response = await fetch(url)
    const text = await response.text()

    if (text.trim().startsWith("<")) {
      console.error("HTML response instead of JSON:", text.slice(0, 200))
      return res.status(500).json({ error: "Unexpected HTML response from LA Data API" })
    }

    const parsedData = JSON.parse(text)
    if (!Array.isArray(parsedData)) {
      console.error("Unexpected response structure:", parsedData)
      return res.status(500).json({ error: "Unexpected response structure" })
    }

    // Filter records by distance
    const filtered = parsedData.filter((item: any) => {
      if (!item.lat || !item.lon) return false
      const d = distanceMeters(latNum, lonNum, parseFloat(item.lat), parseFloat(item.lon))
      return d <= radNum
    }).slice(0, parsedLimit) // limit results

    // If crimeRate flag is set, calculate crimes per 100k
    if (crimeRate === "true") {
      const yearlyStats: Record<string, { count: number; rate: number }> = {}
      filtered.forEach((item: any) => {
        if (!item.date_occ) return
        const year = new Date(item.date_occ).getFullYear().toString()
        if (!yearlyStats[year]) yearlyStats[year] = { count: 0, rate: 0 }
        yearlyStats[year].count++
      })
      Object.keys(yearlyStats).forEach((year) => {
        yearlyStats[year].rate = (yearlyStats[year].count / LA_POPULATION) * 100000
      })
      return res.status(200).json({
        population: LA_POPULATION,
        stats: yearlyStats,
      })
    }

    return res.status(200).json(filtered)
  } catch (error) {
    console.error("Internal error fetching LA crime data:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
