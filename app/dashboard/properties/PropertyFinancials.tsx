"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function currency(n: number | null | undefined) {
  if (n == null || isNaN(n as number)) return "—"
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
}

export default function PropertyFinancials() {
  // Inputs
  const [price, setPrice] = useState(474990)
  const [downPaymentPct, setDownPaymentPct] = useState(20)
  const [loanTermYears, setLoanTermYears] = useState(30)
  const [interestRate, setInterestRate] = useState<number | null>(6.45)
  const [monthlyTaxes, setMonthlyTaxes] = useState(641)
  const [monthlyInsurance, setMonthlyInsurance] = useState(166)
  const [monthlyHOA, setMonthlyHOA] = useState(0)
  const [monthlyUtilities, setMonthlyUtilities] = useState({
    water: 0,
    gas: 0,
    electric: 0,
    internet: 0,
  })
  const [includeMI, setIncludeMI] = useState(true)

  // Derived loan amount
  const loanAmount = useMemo(
    () => price * (1 - (downPaymentPct || 0) / 100),
    [price, downPaymentPct]
  )

  // Mortgage math
  const monthlyPI = useMemo(() => {
    if (!interestRate || !loanAmount || !loanTermYears) return 0
    const r = interestRate / 100 / 12
    const n = loanTermYears * 12
    const pmt =
      (loanAmount * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1)
    return isFinite(pmt) ? pmt : 0
  }, [interestRate, loanAmount, loanTermYears])

  // PMI if <20% DP
  const monthlyMI = useMemo(() => {
    if (!includeMI || downPaymentPct >= 20) return 0
    return (loanAmount * 0.005) / 12
  }, [includeMI, downPaymentPct, loanAmount])

  const totalUtilities = Object.values(monthlyUtilities).reduce((a, b) => a + b, 0)

  const totalMonthly = useMemo(
    () =>
      (monthlyPI || 0) +
      (monthlyMI || 0) +
      (monthlyTaxes || 0) +
      (monthlyInsurance || 0) +
      (monthlyHOA || 0) +
      totalUtilities,
    [monthlyPI, monthlyMI, monthlyTaxes, monthlyInsurance, monthlyHOA, totalUtilities]
  )

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Top Summary */}
      <div className="text-center">
        <h2 className="text-lg font-medium">Monthly payment calculator</h2>
        <p className="text-3xl font-bold mt-1">{currency(totalMonthly)}</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Accordion type="multiple" className="w-full">
            {/* Principal & Interest */}
            <AccordionItem value="pi">
              <AccordionTrigger className="px-4">
                Principal & Interest <span className="ml-auto font-semibold">{currency(monthlyPI)}</span>
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-3">
                <Field label="Home Price ($)">
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </Field>
                <Field label="Down Payment (%)">
                  <Input
                    type="number"
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                  />
                </Field>
                <Field label="Loan Term (years)">
                  <Input
                    type="number"
                    value={loanTermYears}
                    onChange={(e) => setLoanTermYears(Number(e.target.value))}
                  />
                </Field>
                <Field label="Interest Rate (%)">
                  <Input
                    type="number"
                    value={interestRate ?? ""}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </Field>
              </AccordionContent>
            </AccordionItem>

            {/* Mortgage Insurance */}
            <AccordionItem value="mi">
              <AccordionTrigger className="px-4">
                Mortgage Insurance{" "}
                <span className="ml-auto font-semibold">{currency(monthlyMI)}</span>
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-3">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeMI}
                    onChange={(e) => setIncludeMI(e.target.checked)}
                  />
                  <span>Include mortgage insurance</span>
                </label>
              </AccordionContent>
            </AccordionItem>

            {/* Property Taxes */}
            <AccordionItem value="taxes">
              <AccordionTrigger className="px-4">
                Property Taxes{" "}
                <span className="ml-auto font-semibold">{currency(monthlyTaxes)}</span>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <Field label="Property Taxes ($/mo)">
                  <Input
                    type="number"
                    value={monthlyTaxes}
                    onChange={(e) => setMonthlyTaxes(Number(e.target.value))}
                  />
                </Field>
              </AccordionContent>
            </AccordionItem>

            {/* Home Insurance */}
            <AccordionItem value="insurance">
              <AccordionTrigger className="px-4">
                Home Insurance{" "}
                <span className="ml-auto font-semibold">{currency(monthlyInsurance)}</span>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <Field label="Home Insurance ($/mo)">
                  <Input
                    type="number"
                    value={monthlyInsurance}
                    onChange={(e) => setMonthlyInsurance(Number(e.target.value))}
                  />
                </Field>
              </AccordionContent>
            </AccordionItem>

            {/* HOA Fees */}
            <AccordionItem value="hoa">
              <AccordionTrigger className="px-4">
                HOA Fees{" "}
                <span className="ml-auto font-semibold">{currency(monthlyHOA)}</span>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <Field label="HOA Fees ($/mo)">
                  <Input
                    type="number"
                    value={monthlyHOA}
                    onChange={(e) => setMonthlyHOA(Number(e.target.value))}
                  />
                </Field>
              </AccordionContent>
            </AccordionItem>

            {/* Utilities */}
            <AccordionItem value="utilities">
              <AccordionTrigger className="px-4">
                Utilities{" "}
                <span className="ml-auto font-semibold">{currency(totalUtilities)}</span>
              </AccordionTrigger>
              <AccordionContent className="p-4 grid grid-cols-2 gap-3">
                {Object.entries(monthlyUtilities).map(([k, v]) => (
                  <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
                    <Input
                      type="number"
                      value={v}
                      onChange={(e) =>
                        setMonthlyUtilities((prev) => ({
                          ...prev,
                          [k]: Number(e.target.value),
                        }))
                      }
                    />
                  </Field>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <p className="text-xs text-gray-500 text-center">
        All calculations are estimates. Not financial advice.
      </p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm block">{label}</label>
      {children}
    </div>
  )
}
