import { useEffect, useState } from "react"

type School = {
  name: string
  grades: string
  distance_mi: number
  rating: number
}

export default function Schools({ lat, lon }: { lat: number; lon: number }) {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSchools() {
      setLoading(true)
      try {
        const res = await fetch(`/api/schools?lat=${lat}&lon=${lon}`)
        const data = await res.json()
        setSchools(data.results || [])
      } catch (err) {
        console.error("Failed to load schools:", err)
      }
      setLoading(false)
    }
    fetchSchools()
  }, [lat, lon])

  if (loading) return <p className="text-gray-500">Loading nearby schools...</p>

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
      <h2 className="text-xl font-semibold">Nearby Schools</h2>

      {schools.length === 0 ? (
        <p className="text-gray-500">No schools found nearby.</p>
      ) : (
        <ul className="space-y-4">
          {schools.map((school, i) => (
            <li key={i} className="flex items-start gap-4">
              {/* Rating Circle */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                   style={{ backgroundColor: school.rating >= 5 ? "#2563eb" : "#3b82f6" }}>
                {school.rating}/10
              </div>

              {/* School Info */}
              <div>
                <h3 className="font-medium text-blue-700">{school.name}</h3>
                <p className="text-sm text-gray-600">
                  Grades: <span className="font-semibold">{school.grades}</span> &nbsp; • &nbsp;
                  Distance: <span className="font-semibold">{school.distance_mi} mi</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* About Section */}
      <div className="text-sm text-gray-600 border-t pt-4">
        <p className="font-semibold">About GreatSchools</p>
        <p>
          The GreatSchools Summary Rating is based on several metrics and is
          designed to help parents compare schools. Ratings are just a starting
          point — we recommend touring schools in person to learn more.
        </p>
      </div>
    </div>
  )
}
