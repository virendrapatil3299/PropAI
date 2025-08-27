"use client";

import { MapPin } from "lucide-react";
import {
  Map,
  Marker,
  NavigationControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";

type Props = {
  lat: number;
  lon: number;
  label?: string;
};

export default function NeighborhoodMap({ lat, lon, label }: Props) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  console.log(token);

  if (!token) {
    console.error("❌ Mapbox token is missing. Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to .env.local");
    return <div className="text-red-600">Mapbox token missing</div>;
  }

  return (
    <div className="w-auto h-96">
      <Map
        mapboxAccessToken={token}
        initialViewState={{
          longitude: lon || -73.935242, // fallback NYC
          latitude: lat || 40.73061,
          zoom: 12,
        }}
        style={{ width: "100%", height: "115%", borderRadius: "10px" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {/* Marker */}
        <Marker
          longitude={lon || -73.935242}
          latitude={lat || 40.73061}
          anchor="bottom"
        >
          <MapPin className="text-blue-800 w-10 h-10" />
          {label && <span className="bg-white text-xs p-1 rounded shadow">{label}</span>}
        </Marker>

        {/* Controls */}
        <NavigationControl position="top-left" />
        <ScaleControl position="bottom-left" />
        <GeolocateControl position="top-right" />
      </Map>
    </div>
  );
}
