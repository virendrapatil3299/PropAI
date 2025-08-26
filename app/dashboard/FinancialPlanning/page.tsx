"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function FinancialPlanning() {
  return (
    <Card className="rounded-2xl shadow-md p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Financial Planning
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          This section will provide detailed financial models, cost estimates, revenue projections, and financing optimization.
        </p>
      </CardContent>
    </Card>
  )
}
