"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ZoningOptimizer() {
  return (
    <Card className="rounded-2xl shadow-md p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Zoning Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          The Zoning Optimizer analyzes zoning regulations and identifies the best 
          property use and development potential to maximize returns.  
          Future features: interactive zoning maps, permitted-use checker, and AI-driven recommendations.
        </p>
      </CardContent>
    </Card>
  )
}
