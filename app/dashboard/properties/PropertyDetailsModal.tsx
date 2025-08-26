"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Bed, Bath, Square, Home, MapPin, Building2 } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import ListingsMap from "../component/Map"
import type { Listing } from "./types"
import Schools from "../component/Schools"
import MOBILITY from "../component/MobilityScores"
import Image from "next/image"

type PropertyDetailsModalProps = {
  property: Listing | null
  onClose: () => void
}

export default function PropertyDetailsModal({ property, onClose }: PropertyDetailsModalProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)

  if (!property) return null

  const mapLocation =
    property.latLong?.latitude && property.latLong?.longitude
      ? { lat: property.latLong.latitude, lng: property.latLong.longitude }
      : null

  const descriptionPreview =
    property.description && property.description.length > 180
      ? property.description.slice(0, 180) + "..."
      : property.description

  return (
    <Dialog open={!!property} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full min-w-4xl mx-auto h-[95vh] p-0 overflow-y-auto rounded-3xl shadow-2xl bg-white border border-gray-100">
        <VisuallyHidden>
          <DialogTitle>Property Details</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-3xl shadow">
          <h2 className="text-xl font-semibold text-white">Property Details</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col p-6 space-y-6">
          {/* Top: Main Image + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative">
              <Image
                src={property.imgSrc}
                alt="Main property"
                width={800}
                height={420}
                className="w-full aspect-video lg:h-[420px] object-cover rounded-2xl shadow-lg"
                unoptimized
              />
              {property.isNew && (
                <span className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 text-xs rounded-full shadow-md">
                  New Construction
                </span>
              )}
              <button className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-lg text-xs font-medium shadow hover:bg-white transition">
                See all photos
              </button>
            </div>

            {mapLocation && (
              <div className="rounded-2xl overflow-hidden shadow">
                <ListingsMap lat={mapLocation.lat} lon={mapLocation.lng} />
              </div>
            )}
          </div>

          {/* Gallery preview */}
          {property.gallery?.length ?  0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {property.gallery.slice(0, 4).map((g, i) => (
                <Image
                  key={i}
                  src={g}
                  alt={`Gallery ${i}`}
                  width={800}
                  height={420}
                  className="w-full h-32 sm:h-36 object-cover rounded-xl shadow-md hover:shadow-lg transition"
                  unoptimized
                />
              ))}
            </div>
          ):null}

          {/* Quick Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Fact icon={<Bed />} label="Beds" value={property.beds} />
            <Fact icon={<Bath />} label="Baths" value={property.baths} />
            <Fact icon={<Square />} label="Area" value={`${property.area} sqft`} />
            <Fact icon={<Home />} label="Type" value={property.statusText} />
          </div>

          {/* Address */}
          {property.address && (
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <span className="text-sm text-gray-800 font-medium">{property.address}</span>
            </div>
          )}

          {/* Builder & Flex Field */}
          {property.builderName && (
            <InfoCard icon={<Building2 className="w-5 h-5 text-indigo-600" />} text={property.builderName} />
          )}
          {property.flexFieldText && (
            <InfoCard icon={<Building2 className="w-5 h-5 text-indigo-600" />} text={property.flexFieldText} />
          )}

          {/* Tags */}
          {property.tags?.length ? 0 && (
            <div className="flex flex-wrap gap-2">
              {property.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          ):null}

          {/* Description */}
          {property.description && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-indigo-700">What's Special</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {showFullDescription ? property.description : descriptionPreview}
              </p>
              {property.description.length > 180 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-indigo-600 text-sm font-medium hover:underline"
                >
                  {showFullDescription ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}

          {/* Mobility & Schools */}
          {mapLocation && (
            <>
              <MOBILITY lat={mapLocation.lat} lon={mapLocation.lng} />
              <Schools lat={mapLocation.lat} lon={mapLocation.lng} />
            </>
          )}
        </div>

        {/* Price + CTA */}
        <div className="sticky bottom-0 z-30 bg-white border-t p-4 flex items-center justify-between shadow-md rounded-b-3xl">
          <h2 className="text-2xl font-bold text-gray-900">{property.price}</h2>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200">
            Request Tour
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* Fact card */
function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow border p-4">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        {icon}
      </div>
      <span className="text-sm text-gray-500 mt-1">{label}</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  )
}

/* Info card */
function InfoCard({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-sm">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-800 truncate">{text}</span>
    </div>
  )
}
