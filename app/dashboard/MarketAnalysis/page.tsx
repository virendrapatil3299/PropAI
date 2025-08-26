'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Calculator, PieChart, Target, BarChart3 } from 'lucide-react';
import type { Investment } from './types';

interface InvestmentAnalysisProps {
  investments?: Investment[];
}

const InvestmentAnalysis: React.FC<InvestmentAnalysisProps> = ({ investments = [] }) => {
  const [portfolio, setPortfolio] = useState<Investment[]>(investments);
  const [newInvestment, setNewInvestment] = useState({
    address: '',
    purchasePrice: '',
    monthlyRent: '',
    expenses: '',
    downPayment: ''
  });

  const [analysisResult, setAnalysisResult] = useState<{
    roi: number;
    cashFlow: number;
    capRate: number;
    paybackPeriod: number;
    recommendation: string;
    aiComment?: string;
  } | null>(null);

  // Portfolio metrics
  const totalPortfolioValue = portfolio.reduce((sum, inv) => sum + (inv.currentValue ?? 0), 0);
  const totalCashFlow = portfolio.reduce((sum, inv) => sum + (inv.cashFlow ?? 0), 0);
  const totalROI = portfolio.length
    ? portfolio.reduce((sum, inv) => sum + (inv.roi ?? 0), 0) / portfolio.length
    : 0;

  const analyzeInvestment = async () => {
    const purchase = parseFloat(newInvestment.purchasePrice);
    const rent = parseFloat(newInvestment.monthlyRent);
    const expenses = parseFloat(newInvestment.expenses || '0');
    const downPmt = parseFloat(newInvestment.downPayment);

    if (!purchase || !rent || !downPmt || !newInvestment.address) {
      alert('Please fill all required fields correctly.');
      return;
    }

    let propertyData = { currentValue: purchase, address: newInvestment.address, city: '', state: '' };
    try {
      const response = await fetch(`/api/attom?address=${encodeURIComponent(newInvestment.address)}`);
      if (response.ok) {
        const data = await response.json();
        propertyData = {
          currentValue: data.currentValue ?? purchase,
          address: data.address ?? newInvestment.address,
          city: data.city ?? '',
          state: data.state ?? ''
        };
      }
    } catch {
      console.warn('ATTOM fetch error, using defaults');
    }

    const annualRent = rent * 12;
    const annualExpenses = expenses * 12;
    const netIncome = annualRent - annualExpenses;
    const cashFlow = rent - expenses;
    const capRate = purchase > 0 ? (netIncome / purchase) * 100 : 0;
    const roi = downPmt > 0 ? ((netIncome - purchase * 0.05) / downPmt) * 100 : 0;
    const paybackPeriod = cashFlow > 0 ? downPmt / (cashFlow * 12) : 0;

    let recommendation = 'Neutral';
    if (roi > 15 && capRate > 6) recommendation = 'Strong Buy';
    else if (roi > 10 && capRate > 4) recommendation = 'Buy';
    else if (roi < 5 || capRate < 2) recommendation = 'Avoid';

    let aiComment = '';
    try {
      const res = await fetch(`/api/gemini-ai?roi=${roi.toFixed(2)}&capRate=${capRate.toFixed(2)}`);
      if (res.ok) {
        const data = await res.json();
        aiComment = data.comment ?? '';
      }
    } catch {
      console.warn('Gemini AI error');
    }

    const investment: Investment = {
      id: Date.now().toString(),
      property: { address: propertyData.address, city: propertyData.city, state: propertyData.state },
      currentValue: propertyData.currentValue,
      roi: parseFloat(roi.toFixed(1)),
      cashFlow: parseFloat(cashFlow.toFixed(2)),
      equity: downPmt,
      monthlyRent: rent
    };

    setAnalysisResult({ roi, cashFlow, capRate, paybackPeriod, recommendation, aiComment });
    setPortfolio([investment, ...portfolio]);
    setNewInvestment({ address: '', purchasePrice: '', monthlyRent: '', expenses: '', downPayment: '' });
  };

  return (
    <div className="space-y-10 p-6 max-w-7xl mx-auto">
      {/* Portfolio Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Portfolio Value', value: `$${(totalPortfolioValue / 1_000_000).toFixed(1)}M`, icon: <DollarSign className="w-6 h-6" />, color: 'from-blue-500 to-indigo-500' },
          { label: 'Monthly Cash Flow', value: `$${totalCashFlow.toLocaleString()}`, icon: <TrendingUp className="w-6 h-6" />, color: 'from-teal-500 to-emerald-500' },
          { label: 'Average ROI', value: `${totalROI.toFixed(1)}%`, icon: <Target className="w-6 h-6" />, color: 'from-orange-500 to-pink-500' },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-r ${item.color} text-white rounded-2xl p-6 flex justify-between items-center shadow-lg hover:scale-105 transition`}
          >
            <div>
              <p className="text-sm opacity-80">{item.label}</p>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">{item.icon}</div>
          </motion.div>
        ))}
      </div>

      {/* Analyzer Form + Results */}
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center mb-6 space-x-2">
          <Calculator className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Investment Analyzer</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="space-y-4">
            {['address','purchasePrice','downPayment','monthlyRent','expenses'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {field.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type={['purchasePrice','downPayment','monthlyRent','expenses'].includes(field) ? 'number' : 'text'}
                  value={newInvestment[field as keyof typeof newInvestment]}
                  onChange={(e) => setNewInvestment({...newInvestment, [field]: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
            ))}
            <button
              onClick={analyzeInvestment}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:opacity-90 transition flex items-center justify-center space-x-2 shadow-lg"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analyze Investment</span>
            </button>
          </div>

          {/* Analysis Result */}
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-100 text-center">
                  <p className="text-sm text-blue-700">ROI</p>
                  <p className="text-2xl font-bold text-blue-800">{analysisResult.roi.toFixed(1)}%</p>
                </div>
                <div className="p-4 rounded-xl bg-teal-100 text-center">
                  <p className="text-sm text-teal-700">Cap Rate</p>
                  <p className="text-2xl font-bold text-teal-800">{analysisResult.capRate.toFixed(1)}%</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-green-100 text-center">
                <p className="text-sm text-green-700">Monthly Cash Flow</p>
                <p className="text-2xl font-bold text-green-800">${analysisResult.cashFlow.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-orange-100 text-center">
                <p className="text-sm text-orange-700">Payback Period</p>
                <p className="text-xl font-bold text-orange-800">{analysisResult.paybackPeriod.toFixed(1)} yrs</p>
              </div>
              <div className={`p-4 rounded-xl text-center shadow ${
                analysisResult.recommendation === 'Strong Buy' ? 'bg-green-200 text-green-800' :
                analysisResult.recommendation === 'Buy' ? 'bg-blue-200 text-blue-800' :
                analysisResult.recommendation === 'Avoid' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
              }`}>
                <p className="text-xl font-bold">{analysisResult.recommendation}</p>
                {analysisResult.aiComment && <p className="text-sm mt-1">{analysisResult.aiComment}</p>}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Portfolio List */}
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Current Investments</h3>
          <PieChart className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {portfolio.map(inv => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border dark:border-gray-700 shadow transition"
            >
              <div className="flex justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{inv.property.address}</h4>
                  {inv.property.city && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {inv.property.city}, {inv.property.state}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">${inv.currentValue?.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Value</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>ROI: <span className="font-semibold text-green-600">{inv.roi}%</span></div>
                <div>Cash Flow: <span className="font-semibold text-blue-600">${inv.cashFlow}/mo</span></div>
                <div>Equity: <span className="font-semibold text-teal-600">${inv.equity}</span></div>
                <div>Rent: <span className="font-semibold text-orange-600">${inv.monthlyRent}</span></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestmentAnalysis;
