"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
<<<<<<< HEAD
import DashboardLayout from "../SavedPage/layout";
=======
>>>>>>> 2914fb91c67f6175371b759a2bfabc474be8ba3b

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  image: string;
}

const mockData: Property[] = [
  {
    id: 1,
    title: "Modern Apartment",
    location: "Mumbai, India",
    price: "₹75,000/month",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Luxury Villa",
    location: "Pune, India",
    price: "₹2.5 Cr",
    image:
      "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Cozy Studio",
    location: "Bangalore, India",
    price: "₹45,000/month",
    image:
      "https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=800&q=80",
  },
];

export default function RecentlyViewedPage() {
  return (
<<<<<<< HEAD
    <DashboardLayout>
=======
>>>>>>> 2914fb91c67f6175371b759a2bfabc474be8ba3b
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Eye className="h-5 w-5 text-blue-600" />
        Recently Viewed
      </h1>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockData.map((property) => (
          <Card
            key={property.id}
            className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <img
              src={property.image}
              alt={property.title}
              className="h-48 w-full object-cover"
            />
            <CardContent className="p-4 space-y-2">
              <h2 className="text-lg font-semibold text-gray-800">
                {property.title}
              </h2>
              <p className="text-sm text-gray-600">{property.location}</p>
              <p className="text-blue-600 font-medium">{property.price}</p>
              <Button className="w-full mt-2">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
<<<<<<< HEAD
    </DashboardLayout>
=======
>>>>>>> 2914fb91c67f6175371b759a2bfabc474be8ba3b
  );
}
