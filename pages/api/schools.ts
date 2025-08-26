// pages/api/schools.ts
import type { NextApiRequest, NextApiResponse } from "next"

type School = {
  name: string
  grade: string
  distance_mi: number
  rating: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ results: School[] } | { error: string }>
) {
  const { lat, lon } = req.query

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat/lon query params" })
  }

  // ✅ Use geofilter.distance instead of within_circle
  const url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-public-schools/records?limit=10&geofilter.distance=${lat},${lon},5000`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      const text = await response.text()
      throw new Error(
        `OpenDataSoft error: ${response.status} ${response.statusText} - ${text}`
      )
    }

    const data = await response.json()

    const results: School[] = (data.results || []).map((f: { name: string; st_grade: string; end_grade: string }) => ({
      name: f.name || "Unknown School",
      grade: `${f.st_grade || "?"}-${f.end_grade || "?"}`,
      distance_mi: parseFloat((Math.random() * 5).toFixed(1)), // TODO: calculate actual distance
      rating: Math.floor(Math.random() * 10) + 1, // placeholder until GreatSchools API
    }))

    res.status(200).json({ results })
  } catch (err: unknown) {
    console.error(err)
    res.status(500).json({ error: (err as Error).message || "Internal server error" })
  }
}
