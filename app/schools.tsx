"use client";

import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
  (process.env.MAPBOX_ACCESS_TOKEN as string);

type SchoolRecord = {
  recordid: string;
  fields: {
    school_name?: string;
    city?: string;
    state?: string;
    street_address?: string;
    latitude?: number;
    longitude?: number;
    [key: string]: unknown;
  };
};

type SchoolsResponse = {
  nhits: number;
  records: SchoolRecord[];
};

type MultiResponse = {
  results: {
    url: string;
    data?: SchoolsResponse;
    error?: string;
  }[];
};

export default function SchoolsMap() {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [data, setData] = useState<MultiResponse | null>(null);
  const [filter, setFilter] = useState<"all" | "private" | "public">("all");
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

  // Fetch school data
  useEffect(() => {
    fetch("/api/schools")
      .then((res) => res.json())
      .then((json: MultiResponse) => setData(json))
      .catch((err) => console.error("API error:", err));
  }, []);

  // Initialize map
  useEffect(() => {
    if (!map) {
      const m = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-98.5795, 39.8283], // USA center
        zoom: 3,
      });
      setMap(m);
    }
  }, [map]);

  // Update markers when data or filter changes
  useEffect(() => {
    if (!map || !data) return;

    // Remove old markers
    markers.forEach((m) => m.remove());

    const newMarkers: mapboxgl.Marker[] = [];

    data.results.forEach((result) => {
      if (!result.data) return;
      const isPrivate = result.url.includes("private");
      const isPublic = result.url.includes("public");

      if (filter === "private" && !isPrivate) return;
      if (filter === "public" && !isPublic) return;

      result.data.records.forEach((rec) => {
        const { latitude, longitude, school_name, city, state } = rec.fields;
        if (!latitude || !longitude) return;

        const marker = new mapboxgl.Marker({
          color: isPrivate ? "blue" : "green",
        })
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup().setHTML(`
              <strong>${school_name || "Unnamed"}</strong><br/>
              ${city || ""}, ${state || ""}
            `)
          )
          .addTo(map);

        newMarkers.push(marker);
      });
    });

    setMarkers(newMarkers);
  }, [map, data, filter]);

  return (
    <div className="h-screen flex flex-col">
      {/* Dropdown filter */}
      <div className="p-2 bg-white shadow z-10 absolute top-2 left-2 rounded">
        <label className="mr-2 font-semibold">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border rounded p-1"
        >
          <option value="all">All</option>
          <option value="private">Private Schools</option>
          <option value="public">Public Schools</option>
        </select>
      </div>

      {/* Map container */}
      <div id="map" className="flex-1" />
    </div>
  );
}
