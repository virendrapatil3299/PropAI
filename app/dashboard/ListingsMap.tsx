"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl, { accessToken, Map } from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Bed, Bath, Square, Heart, X } from "lucide-react"
import Image from "next/image"

mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
  (process.env.MAPBOX_ACCESS_TOKEN as string)

export type Listing = {
  id: string | number
  price?: string
  latLong?: { latitude: number ; longitude: number  }
  imgSrc?: string
  address?: string
  area?: string
  baths?: number
  beds?: number
  statusType?: "For Sale" | "For Rent" | "Sold" | "Unknown"
}

console.log(accessToken);

const toNumber = (v: unknown): number | undefined => {
  const n = typeof v === "string" ? parseFloat(v) : (v as number)
  return Number.isFinite(n) ? n : undefined
}

const hasValidCoords = (l: Listing) => {
  const lat = toNumber(l.latLong?.latitude)
  const lng = toNumber(l.latLong?.longitude)
  return typeof lat === "number" && typeof lng === "number"
}

type ListingsMapProps = {
  listings?: Listing[]
  onSelect?: (property: Listing | null) => void
  center?: [number, number] // optional: [lng, lat]
}

const statusColors: Record<string, string> = {
  "For Sale": "#16a34a", // green
  "For Rent": "#2563eb", // blue
  "Sold": "#dc2626",     // red
  "Unknown": "#6b7280",  // gray
}

export default function ListingsMap({ listings = [], onSelect, center }: ListingsMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Map | null>(null)
  const [selected, setSelected] = useState<Listing | null>(null)

  // Notify parent
  useEffect(() => {
    if (onSelect) onSelect(selected)
  }, [selected, onSelect])

  // Center map on prop
  useEffect(() => {
    const map = mapRef.current
    if (!map || !center) return
    map.easeTo({ center, zoom:15 })
  }, [center])

  // Init map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-118.2426, 34.0549],
      zoom: 10,
    })

    map.addControl(new mapboxgl.NavigationControl())
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Render pins only
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const validListings = listings.filter(hasValidCoords)
    if (validListings.length === 0) return

    // Cleanup old layers/sources
    const layerIds = ["unclustered-point", "unclustered-label"]
    layerIds.forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id)
    })
    if (map.getSource("listings")) map.removeSource("listings")

    // GeoJSON
    const geojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: validListings.map((l) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            toNumber(l.latLong!.longitude)!,
            toNumber(l.latLong!.latitude)!,
          ],
        },
        properties: {
          id: l.id,
          price: l.price || "",
          statusType: l.statusType || "Unknown",
          data: JSON.stringify(l),
        },
      })),
    }

    map.addSource("listings", { type: "geojson", data: geojson })

    // Pins
    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "listings",
      paint: {
        "circle-color": [
          "match",
          ["get", "statusType"],
          "For Sale", statusColors["For Sale"],
          "For Rent", statusColors["For Rent"],
          "Sold", statusColors["Sold"],
          statusColors["Unknown"], // default
        ],
        "circle-radius": 10,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    })

    // Price labels
    map.addLayer({
      id: "unclustered-label",
      type: "symbol",
      source: "listings",
      layout: {
        "text-field": ["get", "price"],
        "text-size": 11,
        "text-offset": [0, 1.2],
        "text-font": ["Open Sans Bold"],
      },
      paint: {
        "text-color": "#111",
        "text-halo-color": "#fff",
        "text-halo-width": 2,
      },
    })

    // Pin click → card
    map.on("click", "unclustered-point", (e) => {
      const feature = e.features?.[0]
      if (!feature) return
      try {
        const listing: Listing = JSON.parse(feature.properties!.data)
        setSelected(listing)
        map.easeTo({
          center: (feature.geometry as GeoJSON.Point).coordinates as [
            number,
            number
          ],
          zoom: 15,
        })
      } catch {
        console.error("Invalid listing data")
      }
    })

    // Cursor
    map.on("mouseenter", "unclustered-point", () => {
      map.getCanvas().style.cursor = "pointer"
    })
    map.on("mouseleave", "unclustered-point", () => {
      map.getCanvas().style.cursor = ""
    })

    // ✅ Fit map to all pins
    if (validListings.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      validListings.forEach((l) => {
        bounds.extend([
          toNumber(l.latLong!.longitude)!,
          toNumber(l.latLong!.latitude)!,
        ])
      })
      map.fitBounds(bounds, { padding: 50, maxZoom: 14 })
    }
  }, [listings])

  return (
    <div className="relative w-full h-[400px] sm:h-full mt-2 rounded-xl overflow-hidden shadow-md">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

      {/* Floating card */}
      {selected && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl w-[90%] sm:w-72 overflow-hidden z-10 animate-fadeIn">
          <img
            src={selected.imgSrc || "/placeholder.jpg"}
            alt={selected.address || "Property"}
            className="w-full h-44 object-cover"
          />
          <div className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">{selected.price}</h3>
              <div className="absolute top-3 right-3">
                <div className="bg-white/60 rounded-full p-2 shadow-md hover:bg-white transition">
                  <Heart className="w-4 h-4 text-red-500" />
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-1 line-clamp-1">
              {selected.address}
            </p>

            <div className="flex items-center space-x-4 text-sm text-slate-600 my-3">
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                <span>{selected.beds ?? "-"}</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                <span>{selected.baths ?? "-"}</span>
              </div>
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1" />
                <span>{selected.area ?? "-"}</span>
              </div>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="flex items-center justify-center w-full bg-slate-100 hover:bg-slate-200 transition rounded-lg py-2 text-sm font-medium text-slate-700"
            >
              <X className="w-4 h-4 mr-1" /> Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
