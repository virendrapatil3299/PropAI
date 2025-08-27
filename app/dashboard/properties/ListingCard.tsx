"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, TrendingUp ,Heart } from "lucide-react";
import { getGradeColor } from "./helpers";
import type { Listing } from "./types";

type ListingCardProps = {
  deal: Listing;
  onSelect: (property: Listing) => void;
};

export default function ListingCard({ deal, onSelect }: ListingCardProps) {
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
        <div className="absolute top-3 right-3">
        <div className="bg-white/60 rounded-full p-2 shadow-md hover:bg-white transition">
          <Heart className="w-4 h-4 text-red-500" />
        </div>
      </div>
        {/* Grade Badge */}
        {deal.flexFieldText && (
          <div className="absolute top-3 left-3">
            <Badge className={getGradeColor(deal.flexFieldText)}>
              {deal.flexFieldText}
            </Badge>
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
