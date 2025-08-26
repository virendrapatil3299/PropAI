"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ListingsGrid from "../dashboard/properties/ListingsGrid";
import PropertyDetailsModal from "./properties/PropertyDetailsModal";
import Navbar from "./ZoningOptimizer/Navbar";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import ListingsMap from "./ListingsMap";

import type { Listing } from "./properties/types";

const FILTERS = ["All", "For Sale", "Sold", "For Rent"] as const;
const ITEMS_PER_PAGE = 12;

export default function PropertyListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeFilter, setActiveFilter] =
    useState<(typeof FILTERS)[number]>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState<Listing | null>(null);

  // ✅ Example: in real app, replace with auth context / session
  const currentUserId = "demo-user-123";

  // 🔹 Normalize status strings
  const normalizeStatus = (status: string): string => {
    const s = status.toLowerCase().replace("_", " ");
    if (s.includes("sale")) return "For Sale";
    if (s.includes("rent")) return "For Rent";
    if (s.includes("sold")) return "Sold";
    return "Unknown";
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listings");
        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();

        const parsed: Listing[] = (Array.isArray(data)
          ? data
          : data.property ?? []
        ).map((item: any) => ({
          ...item,
          statusType: normalizeStatus(
            item.statusType || item.status || "Unknown"
          ),
        }));

        setListings(parsed);
      } catch (err: any) {
        setError(err.message || "Unable to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Apply filters
  const filteredListings = listings.filter(
    (l) => activeFilter === "All" || l.statusType === activeFilter
  );

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);
  const pagedListings = filteredListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 h-full relative">
      <Navbar />
      <Card>
        <CardContent>
          {/* 🔹 Filter Tabs */}
          <div className="flex flex-wrap gap-2 ">
            {FILTERS.map((f) => (
              <Button
                key={f}
                variant={activeFilter === f ? "default" : "outline"}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </Button>
            ))}
          </div>

          {/* 🔹 Error */}
          {error && (
            <div className="my-3 w-full rounded-md border-l-4 border-red-500 bg-red-50 px-4 py-2 text-sm text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 🔹 Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/80 to-indigo-50/80 z-50">
              <div className="flex flex-col items-center gap-4 p-6 rounded-2xl">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600 drop-shadow-sm" />
                <span className="text-sm font-semibold tracking-wide text-indigo-700 animate-pulse">
                  Loading listings…
                </span>
                <div className="w-40 h-1 bg-indigo-100 rounded-full overflow-hidden">
                  <div className="h-1 w-1/3 bg-indigo-500 animate-[loadingbar_1.5s_infinite]" />
                </div>
              </div>
            </div>
          )}

          {/* 🔹 Listings Map */}
          <ListingsMap listings={filteredListings} />

          {/* 🔹 Listings Grid */}
          <ListingsGrid
            listings={pagedListings}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            onSelect={setSelectedProperty}
            currentUserId={currentUserId} // ✅ fixed naming
          />
        </CardContent>
      </Card>

      {/* 🔹 Property Details Modal */}
      <PropertyDetailsModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </div>
  );
}
