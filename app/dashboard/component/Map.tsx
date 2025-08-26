"use client";

import { MapPin } from "lucide-react";
import { Map, Marker, NavigationControl, ScaleControl, GeolocateControl } from "react-map-gl";

type Props = {
  lat: number;
  lon: number;
  label?: string;
};

export default function NeighborhoodMap({ lat, lon, label }: Props) {
  return (
    <div className="w-auto h-96">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: lon || -73.935242, // fallback NYC
          latitude: lat || 40.73061,
          zoom: 12,
        }}
        style={{ width: "100%", height: "115%", borderRadius: "10px" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {/* Marker */}
        <Marker longitude={lon || -73.935242} latitude={lat || 40.73061} anchor="bottom">
          <MapPin className=" text-blue-800 text-2xl px-2 py-1 w-10 h-10">
            {label || ""}
          </MapPin>
        </Marker>

        {/* Controls */}
        <NavigationControl position="top-left" />
        <ScaleControl position="bottom-left" />
        <GeolocateControl position="top-right" />
      </Map>
    </div>
  );
}
