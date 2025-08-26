"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ListingCard from "./ListingCard"
import type { Listing } from "./types"
import MapView from "../ListingsMap"

type ListingsGridProps = {
  listings: Listing[]
  loading: boolean
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number | ((p: number) => number)) => void
  onSelect: (property: Listing) => void
  currentUserId: string
  
}

export default function ListingsGrid({
  listings,
  loading,
  currentPage,
  totalPages,
  setCurrentPage,
  onSelect,
  currentUserId,
}: ListingsGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left side - Listings */}
      <div className="overflow-y-auto h-[calc(100vh-140px)] p-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-slate-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listings.map((deal, index) => (
              <ListingCard
                key={deal.propertyId ?? `listing-${index}`}
                deal={deal}
                onSelect={onSelect}
                Id={currentUserId} // ✅ FIX: userId passed correctly
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>
            <span className="px-4 py-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Right side - Map */}
      <div className="hidden lg:block">
        <MapView listings={listings} 
         />
      </div>
    </div>
  )
}
