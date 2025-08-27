"use client";

import { useEffect, useState } from "react";
import ListingCard from "../properties/ListingCard";
import type { Listing } from "../properties/types";
  import DashboardLayout from "../SavedPage/layout";


export default function SavedPage() {
  const [savedHomes, setSavedHomes] = useState<Listing[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ Load saved homes from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedHomes") || "[]");
    setSavedHomes(saved);

    // Example: load userId from localStorage or auth provider
    const uid = localStorage.getItem("Id");
    setUserId(uid);
  }, []);

  const handleSelect = (property: Listing) => {
    console.log("Selected property:", property);
  };

  return (
    <DashboardLayout>
    <div className="p-6 mt-20 border">
      <h1 className="text-2xl font-bold mb-6">❤️ Saved Homes</h1>

      {savedHomes.length === 0 ? (
        <p className="text-slate-600">No saved homes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedHomes.map((deal, index) => (
            <ListingCard
              key={deal.propertyId ?? `saved-${index}`}
              deal={deal}
              Id={userId ?? ""} // ✅ required for API saving
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </div>
  </DashboardLayout>
  );
}
