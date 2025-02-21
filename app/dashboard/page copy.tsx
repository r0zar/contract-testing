'use client'

import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';

const PoolConfigurationDashboard = () => {
  // Convert original test data to use the new scoring system
  // Where higher scores are better
  const originalData = {
    "ampCoeff": [1, 10, 50, 100, 500, 1000],
    "originalScores": [-42.91, -35.62, -34.55, -34.41, -34.29, -34.28],
    "profitPercents": [-0.038, -0.044, -0.045, -0.045, -0.045, -0.045],
    "priceImpacts": [2.02, 2.02, 2.02, 2.02, 2.02, 2.02]
  };

  // Convert to new scoring system where higher is better
  const convertedData = originalData.ampCoeff.map((amp, index) => {
    // Function to convert old score to new score (higher is better)
    const convertScore = (oldScore: number) => {
      // Basic conversion - we'll invert the negative value and scale it
      return 90 + (oldScore * -1); // Will give values around 60-80
    };

    return {
      ampCoeff: amp,
      ampName: getAmpName(amp),
      originalScore: originalData.originalScores[index],
      score: convertScore(originalData.originalScores[index]),
      profit: originalData.profitPercents[index],
      impact: originalData.priceImpacts[index]
    };
  });

  // Function to get amp name from coefficient
  function getAmpName(coeff: number) {
    const map = {
      1: "Very Low",
      10: "Low",
      50: "Medium",
      100: "Standard",
      500: "High",
      1000: "Very High"
    };
    return map[coeff as keyof typeof map] || coeff.toString();
  }

  // Prepare configuration data for the bar chart
  const configData = convertedData.map(data => ({
    name: data.ampName,
    score: data.score,
    profit: data.profit,
    impact: data.impact
  }));

  // Extract test sizes data from the original results
  const sizeImpactData = [
    { size: "Small", impact: 0.10, profit: -0.0023 },
    { size: "Medium", impact: 1.00, profit: -0.0220 },
    { size: "Large", impact: 4.96, profit: -0.0893 }
  ];

  // Create summary data for recommendations
  const recommendationsData = [
    {
      category: "Most Stable",
      ampCoeff: 1,
      ampName: "Very Low",
      score: convertedData[0].score,
      profit: convertedData[0].profit,
      impact: convertedData[0].impact,
      reason: "Lowest overall loss to arbitrageurs"
    },
    {
      category: "Most Profitable for Pool",
      ampCoeff: 1,
      ampName: "Very Low",
      score: convertedData[0].score,
      profit: convertedData[0].profit,
      impact: convertedData[0].impact,
      reason: "Minimizes pool value loss to arbitrageurs"
    },
    {
      category: "Most Reliable",
      ampCoeff: 1000,
      ampName: "Very High",
      score: convertedData[5].score,
      profit: convertedData[5].profit,
      impact: convertedData[5].impact,
      reason: "Consistent performance across test cases"
    }
  ];

  // Color helpers
  const getScoreColor = (score: number) => {
    if (score > 75) return "#22c55e"; // Good (green)
    if (score > 65) return "#3b82f6"; // Medium (blue)
    if (score > 55) return "#eab308"; // Warning (yellow)
    return "#ef4444";                // Bad (red)
  };

  const getProfitColor = (profit: number) => {
    if (profit > 0) return "#22c55e";      // Good (green)
    if (profit > -0.03) return "#3b82f6";  // Medium (blue)
    if (profit > -0.05) return "#eab308";  // Warning (yellow)
    return "#ef4444";                      // Bad (red)
  };

  // Available metrics for selection
  const metrics = [
    { name: 'Score', dataKey: 'score', description: 'Higher scores indicate better configurations', colorFn: getScoreColor },
    { name: 'Pool Profit %', dataKey: 'profit', description: 'Higher (less negative) is better for the pool', colorFn: getProfitColor },
    { name: 'Price Impact %', dataKey: 'impact', description: 'Lower is better for stability', colorFn: (v: number) => v < 1 ? "#22c55e" : "#ef4444" }
  ];

  // State for active metric
  const [activeMetric, setActiveMetric] = useState(metrics[0]);

  return (
    <div className="w-full p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-4 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">StableSwap Pool Configuration Dashboard</h1>
          <p className="text-gray-600">Analysis of pool configurations with updated scoring system (higher is better)</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Amplification Coefficient Performance</h2>

          <div className="mb-4">
            <div className="flex space-x-2 mb-2">
              {metrics.map(metric => (
                <button
                  key={metric.dataKey}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${activeMetric.dataKey === metric.dataKey
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setActiveMetric(metric)}
                >
                  {metric.name}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">{activeMetric.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-2 text-gray-700">Configuration Performance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={configData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" label={{ value: 'Amplification Coefficient', position: 'bottom', offset: 0 }} />
                    <YAxis domain={activeMetric.dataKey === 'score' ? [40, 90] :
                      activeMetric.dataKey === 'profit' ? [-0.05, 0] : [0, 3]} />
                    <Tooltip formatter={(value) => [value, activeMetric.name]} />
                    <Legend />
                    <Bar
                      dataKey={activeMetric.dataKey}
                      name={activeMetric.name}
                      fill="#8884d8"
                    >
                      {configData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={activeMetric.colorFn(Number(entry[activeMetric.dataKey as keyof typeof entry]))}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm mt-2 text-gray-600">
                This chart shows how the {activeMetric.name.toLowerCase()} varies across different amplification coefficient values.
              </p>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-2 text-gray-700">Effect by Transaction Size</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={sizeImpactData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="size" />
                    <YAxis yAxisId="left" label={{ value: 'Price Impact %', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Profit %', angle: -90, position: 'insideRight' }} domain={[-0.1, 0]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="impact"
                      name="Price Impact %"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="profit"
                      name="Pool Profit %"
                      stroke="#82ca9d"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm mt-2 text-gray-600">
                This chart shows how transaction size affects both price impact and pool profit.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-2 text-gray-700">Key Observations with Updated Scoring</h3>
            <ul className="list-disc pl-5 text-sm text-gray-600">
              <li><span className="font-medium">Lower amplification coefficients (A=1) score better</span> with the new scoring system because they minimize pool value loss to arbitrageurs</li>
              <li>This is the opposite of the trader-focused perspective where higher amplification was better</li>
              <li>Price impact increases significantly with larger transaction sizes, from 0.1% for small transactions to nearly 5% for large ones</li>
              <li>Profit loss for the pool grows with transaction size, from -0.002% for small transactions to about -0.1% for large transactions</li>
              <li>The "reversed" parameter has minimal impact on performance</li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recommended Configurations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendationsData.map((rec, idx) => (
              <div key={idx} className="bg-white rounded-lg border p-4">
                <h3 className="font-bold text-lg text-gray-800">{rec.category}</h3>
                <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
                <div>
                  <p className="text-gray-700"><span className="font-medium">Amplification:</span> {rec.ampName} ({rec.ampCoeff})</p>
                  <p className="text-gray-700"><span className="font-medium">Score:</span> {rec.score.toFixed(2)} <span className="text-gray-500 text-xs">(higher is better)</span></p>
                  <p className="text-gray-700"><span className="font-medium">Pool Profit:</span> {rec.profit.toFixed(4)}%</p>
                  <p className="text-gray-700"><span className="font-medium">Price Impact:</span> {rec.impact.toFixed(4)}%</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-2 text-gray-700">Implementation Guide</h3>
            <p className="text-sm text-gray-600 mb-2">
              To implement the new scoring system where higher scores are better:
            </p>
            <ol className="list-decimal pl-5 text-sm text-gray-600">
              <li>Modify the scoring function to convert negative values to positive</li>
              <li>Invert the weight of profit impact so less negative values score higher</li>
              <li>Scale the scores appropriately to ensure a useful range (e.g., 0-100)</li>
              <li>Update the sorting to place higher scores first rather than lower scores</li>
              <li>Update all UI elements and documentation to indicate "higher is better"</li>
            </ol>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Understanding Score Conversion</h2>
          <div className="bg-white rounded-lg border p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amp Coefficient</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Score</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Score</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool Profit %</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Impact %</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {convertedData.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.ampName} ({item.ampCoeff})</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.originalScore.toFixed(2)}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 font-medium">{item.score.toFixed(2)}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.profit.toFixed(4)}%</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.impact.toFixed(4)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm mt-4 text-gray-600">
              The new scoring system converts the original negative scores to positive values where higher is better.
              The formula used is: <code className="bg-gray-100 px-1 py-0.5 rounded">newScore = 90 + (oldScore * -1)</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolConfigurationDashboard;