"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import ListingsGrid from "./ListingsGrid"
import PropertyDetailsModal from "./PropertyDetailsModal"

import type { Listing } from "./types"

const ITEMS_PER_PAGE = 12

export default function PropertyListings() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProperty, setSelectedProperty] = useState<Listing | null>(null)

  // ✅ hardcoded for now (later fetch from auth context/session)
  const currentUserId = "demo-user-123"

  const [filter, setFilter] = useState({
    query: "",
    statusType: "all",
    price: "all",
    bedsBaths: "all",
    homeType: "all",
    more: "all",
  })

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listings")
        if (!res.ok) throw new Error("Failed to fetch listings")
        const data = await res.json()

        // ✅ normalize incoming listings
        const parsed: Listing[] = (Array.isArray(data) ? data : data.property ?? []).map((l: Listing) => ({
          ...l,
          status: l.statusType || "all",
          homeType: l.homeType || "all",
          price: typeof l.price === "string" ? l.price : String(l.price ?? "0"),
        }))
        console.log("Fetched listings:", parsed)

        setListings(parsed)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unable to load listings")
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  const filteredListings = listings
    .filter((l) =>
      !filter.query ||
      l.title?.toLowerCase().includes(filter.query.toLowerCase()) ||
      l.addressCity?.toLowerCase().includes(filter.query.toLowerCase()) ||
      l.addressStreet?.toLowerCase().includes(filter.query.toLowerCase())
    )
    .filter((l) => filter.statusType === "all" || l.statusType === filter.statusType)
    .filter((l) => {
      if (filter.price === "all") return true
      const priceNum = parseInt(l?.price?.replace(/[^0-9]/g, "") || "0", 10)
      if (filter.price === "0-100k") return priceNum <= 100000
      if (filter.price === "100k-500k") return priceNum >= 100000 && priceNum <= 500000
      if (filter.price === "500k+") return priceNum >= 500000
      return true
    })
    .filter((l) => {
      if (filter.bedsBaths === "all") return true
      const min = parseInt(filter.bedsBaths, 10)
      return (l.beds ?? 0) >= min || (l.baths ?? 0) >= min
    })
    .filter((l) => filter.homeType === "all" || l.homeType === filter.homeType)
    .filter((l) => {
      if (filter.more === "all") return true
      if (filter.more === "new") {
        const created = new Date(l.createdAt ?? "")
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return created >= thirtyDaysAgo
      }
      if (filter.more === "open_house") {
        return l.statusType?.toLowerCase().includes("open")
      }
      return true
    })

  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE)
  const pagedListings = filteredListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="space-y-6 overflow-x-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Explore Properties</CardTitle>
          <p className="text-slate-600">Filter by Location, Price, and Deal Score</p>
        </CardHeader>
        <CardContent>
          <ListingsGrid
            listings={pagedListings}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            onSelect={setSelectedProperty}
            currentUserId={currentUserId} // ✅ FIX: now passed
          />
        </CardContent>
      </Card>

      <PropertyDetailsModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </div>
  )
}
