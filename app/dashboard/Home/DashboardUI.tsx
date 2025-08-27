import { TrendingUp, TrendingDown, DollarSign, Home, Target } from "lucide-react";
import type { MarketData, Investment, PortfolioStats, AIInsight } from "./types";

interface DashboardUIProps {
  portfolio: PortfolioStats | null;
  marketData: MarketData[];
  investments: Investment[];
  insights: AIInsight[];
}

export default function DashboardUI({
  portfolio,
  marketData,
  investments,
  insights,
}: DashboardUIProps) {
  const formatChange = (value: number) => {
    const positive = value >= 0;
    return (
      <span className={`flex items-center text-sm font-medium ${positive ? "text-green-600" : "text-red-600"}`}>
        {positive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {positive ? `+${value}%` : `${value}%`}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Portfolio Stats */}
      {portfolio && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-gray-500">Portfolio Value</h3>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold">${portfolio.value.toLocaleString()}</p>
            {formatChange(12.5)}
          </div>

          <div className="bg-white p-4 rounded-2xl shadow flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-gray-500">Monthly Cash Flow</h3>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">${portfolio.cashFlow.toLocaleString()}</p>
            {formatChange(8.2)}
          </div>

          <div className="bg-white p-4 rounded-2xl shadow flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-gray-500">Average ROI</h3>
              <Target className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold">{portfolio.roi}%</p>
            {formatChange(2.1)}
          </div>

          <div className="bg-white p-4 rounded-2xl shadow flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-gray-500">Properties Tracked</h3>
              <Home className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold">{portfolio.propertiesTracked}</p>
            {formatChange(4)}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Market Performance */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Market Performance</h2>
          <div className="space-y-3">
            {marketData.map((m, idx) => (
              <div key={idx} className="p-3 border rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{m.region}</h3>
                  <p className="text-gray-600">${m.averagePrice.toLocaleString()} avg price</p>
                  <p className="text-gray-500">{m.daysOnMarket} days on market</p>
                </div>
                {formatChange(m.priceChange)}
              </div>
            ))}
          </div>
        </div>

        {/* Investment Portfolio */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Investment Portfolio</h2>
          <div className="space-y-3">
            {investments.map((inv, idx) => (
              <div key={idx} className="p-3 border rounded-lg flex justify-between">
                <div>
                  <h3 className="font-medium">{inv.property.address}</h3>
                  <p className="text-gray-600">
                    {inv.property.city}, {inv.property.state}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-bold">{inv.roi}% ROI</p>
                  <p className="text-gray-500">${inv.cashFlow}/mo</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">AI Market Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((ins, idx) => (
            <div key={idx} className="p-3 border rounded-lg bg-gray-50">
              <h3 className="font-medium capitalize mb-1">{ins.type}</h3>
              <p className="text-gray-600 text-sm">{ins.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
