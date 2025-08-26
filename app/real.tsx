'use client'

import { useEffect, useState } from "react";

type ApifyListing = {
  id: number;
  title: string;
  price: string;
  location: string;
  url: string;
  statusType?: string;
  imgSrc: string;
  beds?: number;
  baths?: number;
};

export default function ListingsPage() {
  const [listings, setListings] = useState<ApifyListing[]>([]);
  const [filter, setFilter] = useState<"all" | "rent" | "sale">("all");

  useEffect(() => {
    const fetchListings = async () => {
      const res = await fetch("/api/listings");
      const data = await res.json();
      setListings(data);
    };
    fetchListings();
  }, []);

  const filteredListings = listings.filter((item) => {
    if (filter === "all") return true;
    if (filter === "rent")
      return item.statusType?.toLowerCase().includes("rent");
    if (filter === "sale")
      return item.statusType?.toLowerCase().includes("sale");
    return true;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🏡 Property Listings</h1>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("rent")}
          className={`px-4 py-2 rounded-lg ${
            filter === "rent" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          For Rent
        </button>
        <button
          onClick={() => setFilter("sale")}
          className={`px-4 py-2 rounded-lg ${
            filter === "sale" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          For Sale
        </button>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <div
            key={`${listing.id}-${listing.url}`} // ✅ unique key
            className="border rounded-xl shadow-sm p-4 bg-white hover:shadow-lg transition"
          >
            {listing.imgSrc && (
              <img
                src={listing.imgSrc}
                alt={listing.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-lg font-semibold">{listing.title}</h2>
            <p className="text-gray-600">{listing.location}</p>
            <p className="font-bold text-blue-600">{listing.price}</p>
            <p className="text-sm text-gray-500">
              {listing.beds} Beds • {listing.baths} Baths
            </p>
            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-blue-500 underline"
            >
              View Details →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
