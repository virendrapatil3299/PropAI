// types.ts
export interface MarketData {
  region: string;
  averagePrice: number;
  priceChange: number;
  daysOnMarket: number;
}

export interface Investment {
  property: {
    address: string;
    city: string;
    state: string;
  };
  currentValue: number;
  cashFlow: number;
  roi: number;
}

export interface PortfolioStats {
  value: number;
  cashFlow: number;
  roi: number;
  propertiesTracked: number;
}

export interface AIInsight {
  type: "prediction" | "opportunity" | "risk";
  message: string;
}
