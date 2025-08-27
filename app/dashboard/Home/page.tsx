'use client';

import { useEffect, useState } from "react";
import DashboardUI from "./DashboardUI";
import type { MarketData, Investment, PortfolioStats, AIInsight } from "./types";
import DashboardLayout from "../SavedPage/layout";  

export default function DashboardPage() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioStats | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Market data
        const resMarket = await fetch("/api/marketData");
        const marketJson = await resMarket.json();

        const formattedMarket: MarketData[] = marketJson.map((item: any) => ({
          region: item.region || item.address,
          averagePrice: item.averagePrice || 0,  // ✅ use number directly
          priceChange: item.priceChange || 0,
          daysOnMarket: item.daysOnMarket || 0,
        }));


        // Investments
        const resInvest = await fetch("/api/investments");
        const investJson = await resInvest.json();

        const formattedInvestments: Investment[] = investJson.map((item: any) => ({
          property: {
            address: item.address || "Unknown address",
            city: item.city || "Unknown city",
            state: item.state || "N/A",
          },
          currentValue: item.currentValue ?? 0,  // ✅ default to 0 if null/undefined
          cashFlow: item.cashFlow ?? 0,
          roi: item.roi ?? 0,
        }));


        // Portfolio
        const resPortfolio = await fetch("/api/portfolio");
        const portfolioJson = await resPortfolio.json();
        const formattedPortfolio: PortfolioStats = {
          value: portfolioJson.value,
          cashFlow: portfolioJson.cashFlow,
          roi: portfolioJson.roi,
          propertiesTracked: portfolioJson.propertiesTracked,
        };

        // AI Insights
        const resInsights = await fetch("/api/insights");
        const insightsJson = await resInsights.json();
        const formattedInsights: AIInsight[] = insightsJson.map((item: any) => ({
          type: item.type,
          message: item.message,
        }));

        setMarketData(formattedMarket);
        setInvestments(formattedInvestments);
        setPortfolio(formattedPortfolio);
        setInsights(formattedInsights);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

 if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-blue-500 font-medium">Loading your dashboard...</p>
      </div>
    </div>
  );
}


  return (
    <DashboardLayout>
      <DashboardUI
        portfolio={portfolio}
        marketData={marketData}
        investments={investments}
        insights={insights}
      />
    </DashboardLayout>
  );
}

  