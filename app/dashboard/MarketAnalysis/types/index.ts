// types.ts

// Full Property type for DB / API use
export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt: number;
  propertyType: string;
  listingDate: string;
  daysOnMarket: number;
  aiValuation: number;
  confidence: number;
  priceChange: number;
  images: string[];
  features: string[];
}

// Light Property type just for analysis UI
export interface SimpleProperty {
  address: string;
  city: string;
  state: string;
}

// Investment now references SimpleProperty
export interface Investment {
  id: string;
  property: SimpleProperty;
  currentValue: number;
  roi: number;
  cashFlow: number;
  equity: number;
  monthlyRent: number;
}
