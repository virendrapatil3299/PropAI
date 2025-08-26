"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, TrendingUp, Heart } from "lucide-react";
import { getGradeColor } from "./helpers";
import type { Listing } from "./types";
import { useState, useEffect } from "react";
import Image from "next/image";

type ListingCardProps = {
  deal: Listing;
  onSelect: (property: Listing) => void;
  Id?: string; // ✅ make optional
};

export default function ListingCard({ deal, Id, onSelect }: ListingCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  // ✅ Check if already saved
  useEffect(() => {
    if (!Id) return;

    let cancelled = false;

    const checkSaved = async () => {
      try {
        const res = await fetch(`/api/saved-homes?Id=${Id}`);
        if (!res.ok) throw new Error("Failed to fetch saved homes");

        const data: { propertyId: string }[] = await res.json();
        if (!cancelled) {
          const alreadySaved = data.some((h) => h.propertyId === deal.propertyId);
          setIsSaved(alreadySaved);
        }
      } catch (err) {
        console.error("Error checking saved homes:", err);
      }
    };

    checkSaved();
    return () => {
      cancelled = true;
    };
  }, [deal.propertyId, Id]);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!Id) return;

    try {
      if (!isSaved) {
        const res = await fetch(`/api/saved-homes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Id, propertyId: deal.propertyId }),
        });
        if (!res.ok) throw new Error("Failed to save home");
        setIsSaved(true);
      } else {
        const res = await fetch(`/api/saved-homes`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Id, propertyId: deal.propertyId }),
        });
        if (!res.ok) throw new Error("Failed to unsave home");
        setIsSaved(false);
      }
    } catch (err) {
      console.error("Error toggling save:", err);
    }
  };

  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={() => onSelect(deal)}
    >
      <div className="relative">
        <img
          src={deal.imgSrc || "/placeholder.svg"}
          alt={deal.title || "Property"}
          width={800}
          height={420}
          className="w-full h-40 object-cover rounded-t-lg"
        />

        {/* Grade Badge */}
        {deal.flexFieldText && (
          <div className="absolute top-3 left-3">
            <Badge className={getGradeColor(deal.flexFieldText)}>
              {deal.flexFieldText}
            </Badge>
          </div>
        )}

        {/* Save button */}
        {Id && (
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="icon"
              className={`bg-white/80 hover:bg-white rounded-full transition ${
                isSaved ? "text-red-500" : "text-gray-500"
              }`}
              onClick={handleSave}
            >
              <Heart className={`w-5 h-5 ${isSaved ? "fill-red-500" : ""}`} />
            </Button>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Title + Price */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-slate-900 truncate">
            {deal.title || deal.propertyId}
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900">
              {deal.price ? `$${deal.price.toLocaleString()}` : "N/A"}
            </div>
            <div className="text-xs text-slate-500">Price</div>
          </div>
        </div>

        {/* Location */}
        {(deal.location || deal.addressCity || deal.addressState) && (
          <div className="flex items-center text-slate-600 mb-3">
            <MapPin className="w-4 h-4 mr-1 text-red-500" />
            <span className="text-sm truncate">
              {deal.location ||
                [deal.addressCity, deal.addressState].filter(Boolean).join(", ")}
            </span>
          </div>
        )}

        {/* Beds / Baths / Area */}
        <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{deal.beds ?? "-"}</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{deal.baths ?? "-"}</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{deal.area ?? "-"}</span>
          </div>
        </div>

        {/* Status & Strategy */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Status:</span>
            <span className="font-medium">{deal.statusType ?? "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Strategy:</span>
            <span className="font-medium capitalize">
              {deal.statusText?.replace(/_/g, " ") ?? "N/A"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-6">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(deal);
              }}
            >
              View Details
            </Button>

            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Analyze clicked for", deal.propertyId);
              }}
            >
              <TrendingUp className="w-4 h-4 mr-1" /> Analyze
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
