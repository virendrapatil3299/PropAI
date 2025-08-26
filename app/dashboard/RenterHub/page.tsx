"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, FileText, Wrench, Info } from "lucide-react";

const renterTools = [
  {
    id: 1,
    title: "Rent Payments",
    description: "Pay your rent securely online and track payment history.",
    icon: Wallet,
    action: "Pay Now",
  },
  {
    id: 2,
    title: "Lease Agreements",
    description: "View and manage your rental agreements and documents.",
    icon: FileText,
    action: "View Lease",
  },
  {
    id: 3,
    title: "Maintenance Requests",
    description: "Submit and track repair or maintenance requests.",
    icon: Wrench,
    action: "Request Service",
  },
  {
    id: 4,
    title: "Renter Tips",
    description: "Explore guides to make renting easier and stress-free.",
    icon: Info,
    action: "Read Tips",
  },
];

export default function RenterHubPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Renter Hub
      </h1>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {renterTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card
              key={tool.id}
              className="rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-semibold">
                  {tool.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{tool.description}</p>
                <Button className="w-full">{tool.action}</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
