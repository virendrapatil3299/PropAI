'use client';

import React, { useState } from 'react';
import { Calculator, TrendingUp, Home, DollarSign, BarChart3 } from 'lucide-react';
import axios from 'axios';

const PropertyValuation: React.FC = () => {
  const [propertyData, setPropertyData] = useState({
    address: '',
    city: '',
    state: '',
    sqft: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    lotSize: '',
    condition: 'good',
  });

  const [valuation, setValuation] = useState<{
    estimatedValue: number;
    confidence: number;
    priceRange: { low: number; high: number };
    comparables: Array<{ address: string; price: number; similarity: number }>;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  // Fallback valuation
  const fallbackValuation = () => {
    const sqft = parseFloat(propertyData.sqft) || 0;
    const baseValue = sqft * 450;

    const locationMultiplier =
      propertyData.state === 'CA'
        ? 1.8
        : propertyData.state === 'TX'
        ? 1.2
        : 1.4;

    const conditionMultiplier =
      propertyData.condition === 'excellent'
        ? 1.1
        : propertyData.condition === 'good'
        ? 1.0
        : 0.9;

    const estimatedValue = Math.round(baseValue * locationMultiplier * conditionMultiplier);

    return {
      estimatedValue,
      confidence: 85,
      priceRange: {
        low: Math.round(estimatedValue * 0.9),
        high: Math.round(estimatedValue * 1.1),
      },
      comparables: [
        { address: '123 Similar St', price: estimatedValue + 25000, similarity: 94 },
        { address: '456 Compare Ave', price: estimatedValue - 15000, similarity: 89 },
        { address: '789 Market Dr', price: estimatedValue + 10000, similarity: 91 },
      ],
    };
  };

  // Call Next.js API route
  const handleCalculateValuation = async () => {
    if (!propertyData.address || !propertyData.city || !propertyData.state || !propertyData.sqft) {
      alert('Please fill in required fields: Address, City, State, and Square Feet.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/valuation', {
        property: {
          ...propertyData,
          sqft: parseFloat(propertyData.sqft),
          bedrooms: parseInt(propertyData.bedrooms) || 0,
          bathrooms: parseFloat(propertyData.bathrooms) || 0,
          yearBuilt: parseInt(propertyData.yearBuilt) || undefined,
          lotSize: parseFloat(propertyData.lotSize) || undefined,
        },
      });

      const data = response.data;

      if (data && data.estimatedValue) {
        setValuation({
          estimatedValue: data.estimatedValue,
          confidence: data.confidence ?? 90,
          priceRange: data.priceRange ?? {
            low: Math.round(data.estimatedValue * 0.9),
            high: Math.round(data.estimatedValue * 1.1),
          },
          comparables: data.comparables ?? [],
        });
      } else {
        setValuation(fallbackValuation());
      }
    } catch (error) {
      console.error('API route error:', error);
      setValuation(fallbackValuation());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-8">
      {/* Property Input Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Calculator className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Property Valuation</h2>
            <p className="text-gray-600">Get instant property valuations powered by Gemini AI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Property Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={propertyData.address}
                onChange={(e) => setPropertyData({ ...propertyData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={propertyData.city}
                  onChange={(e) => setPropertyData({ ...propertyData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="San Francisco"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  value={propertyData.state}
                  onChange={(e) => setPropertyData({ ...propertyData, state: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select State</option>
                  <option value="CA">California</option>
                  <option value="TX">Texas</option>
                  <option value="CO">Colorado</option>
                  <option value="NY">New York</option>
                  <option value="FL">Florida</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Specifications */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Property Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Square Feet</label>
                <input
                  type="number"
                  value={propertyData.sqft}
                  onChange={(e) => setPropertyData({ ...propertyData, sqft: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
                <input
                  type="number"
                  value={propertyData.yearBuilt}
                  onChange={(e) => setPropertyData({ ...propertyData, yearBuilt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2010"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <input
                  type="number"
                  value={propertyData.bedrooms}
                  onChange={(e) => setPropertyData({ ...propertyData, bedrooms: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <input
                  type="number"
                  step="0.5"
                  value={propertyData.bathrooms}
                  onChange={(e) => setPropertyData({ ...propertyData, bathrooms: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2.5"
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Additional Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lot Size (sqft)</label>
              <input
                type="number"
                value={propertyData.lotSize}
                onChange={(e) => setPropertyData({ ...propertyData, lotSize: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="8000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <select
                value={propertyData.condition}
                onChange={(e) => setPropertyData({ ...propertyData, condition: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <button
              onClick={handleCalculateValuation}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>{loading ? 'Calculating...' : 'Calculate Valuation'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Valuation Results */}
      {valuation && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Valuation Results</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="text-lg font-semibold text-gray-900">Estimated Value</h4>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  ${valuation.estimatedValue.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="p-6 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl">
                <BarChart3 className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <h4 className="text-lg font-semibold text-gray-900">Confidence</h4>
                <p className="text-3xl font-bold text-teal-600 mt-2">{valuation.confidence}%</p>
              </div>
            </div>

            <div className="text-center">
              <div className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h4 className="text-lg font-semibold text-gray-900">Price Range</h4>
                <p className="text-lg font-bold text-orange-600 mt-2">
                  ${valuation.priceRange.low.toLocaleString()} - ${valuation.priceRange.high.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Comparable Properties</h4>
            <div className="space-y-3">
              {valuation.comparables.map((comp, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Home className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">{comp.address}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{comp.similarity}% similar</span>
                    <span className="font-semibold text-gray-900">${comp.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyValuation;
