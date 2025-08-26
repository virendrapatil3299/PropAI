"use client";
import { useState, useEffect } from "react";
import { Bike,Footprints  } from "lucide-react";

type Props = {
  lat: number;
  lon: number; // or "lng" if your property uses that
};

export default function Mobility({ lat, lon }: Props) {
  const [walkScore, setWalkScore] = useState<number | null>(null);
  const [bikeScore, setBikeScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchScores(lat: number, lon: number) {
      try {
        // Walk Isochrone (15 min)
        const walkRes = await fetch(
          `/api/ors?type=isochrone&start=${lon},${lat}&range=900&mode=foot-walking`
        );
        const walkData = await walkRes.json();

        // Bike Isochrone (15 min)
        const bikeRes = await fetch(
          `/api/ors?type=isochrone&start=${lon},${lat}&range=900&mode=cycling-regular`
        );
        const bikeData = await bikeRes.json();

        // Fake score from polygon size
        const walkArea = JSON.stringify(walkData).length;
        const bikeArea = JSON.stringify(bikeData).length;

        setWalkScore(Math.min(100, Math.floor(walkArea % 100)));
        setBikeScore(Math.min(100, Math.floor(bikeArea % 100)));
      } catch (err) {
        console.error("Error fetching scores", err);
        setError("Failed to fetch scores");
      } finally {
        setLoading(false);
      }
    }

    if (lat && lon) {
      fetchScores(lat, lon);
    } else {
      setError("No location available");
      setLoading(false);
    }
  }, [lat, lon]);

  return (
    <div className="p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold mb-4">Getting around</h2>

      {loading && <p>Loading scores...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && walkScore !== null && bikeScore !== null && (
        <div className="flex space-x-8">
          {/* Walk Score */}
          <div className="flex items-center space-x-3 text">
            <Footprints  className="w-12 h-12 text-green-400 rounded-full flex items-center justify-center  text-lg">
              🚶
            </Footprints>
            <div>
              <p className="font-semibold">
                Walk Score®{" "}
                <span className="text-blue-600">{walkScore}</span> / 100
              </p>
              <p className="text-sm text-gray-600">
                {walkScore > 85
                  ? "Walker's Paradise"
                  : walkScore > 70
                  ? "Very Walkable"
                  : walkScore > 50
                  ? "Somewhat Walkable"
                  : "Walk-Dependent"}
              </p>
            </div>
          </div>

          {/* Bike Score */}
          <div className="flex items-center space-x-3">
            <Bike className="w-12 h-12 rounded-full text-green-400 flex items-center justify-center  text-lg">
              🚴
            </Bike>
            <div>
              <p className="font-semibold">
                Bike Score®{" "}
                <span className="text-blue-600">{bikeScore}</span> / 100
              </p>
              <p className="text-sm text-gray-600">
                {bikeScore > 85
                  ? "Biker's Paradise"
                  : bikeScore > 70
                  ? "Very Bikeable"
                  : bikeScore > 50
                  ? "Bikeable"
                  : "Bike-Dependent"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
