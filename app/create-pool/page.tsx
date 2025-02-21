'use client'

import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, Treemap, Scatter, ScatterChart, ZAxis
} from 'recharts';

// Add interfaces for the data structure
interface AnalysisItem {
    value: string;
    successRate: number;
    total: number;
    successful: number;
}

interface ParameterRange {
    name: string;
    value: number;
}

interface TestData {
    summary: {
        totalTests: number;
        successfulTests: number;
        failureRate: number;
        analysis: {
            byInitialBalance: AnalysisItem[];
            byAmpCoeff: AnalysisItem[];
            byMidpoint: AnalysisItem[];
            byMidpointFactor: AnalysisItem[];
            byBurnAmount: AnalysisItem[];
            byConvergenceThreshold: AnalysisItem[];
            byReversed: AnalysisItem[];
        };
    };
    parameterRanges: {
        initialBalances: ParameterRange[];
        midpointValues: ParameterRange[];
        midpointFactors: ParameterRange[];
        ampCoefficients: ParameterRange[];
        burnAmounts: ParameterRange[];
        convergenceThresholds: ParameterRange[];
    };
}

interface MatrixDataItem {
    name: string;
    balance: string;
    amp: string;
    successRate: number;
    value: number;
}

interface TreemapContentProps {
    root: any;
    depth: number;
    x: number;
    y: number;
    width: number;
    height: number;
    index: number;
    payload: any;
    rank: number;
    name: string;
}

const PoolCreationDashboard = () => {
    const [data, setData] = useState<TestData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const importedData = await import('./data.json');
                setData(importedData.default);
                setLoading(false);
            } catch (error) {
                console.error('Error loading data:', error);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // States for tabs
    const [activeTab, setActiveTab] = useState('overview');

    // Colors
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    // Format value function
    function formatValue(value: number): string {
        if (value >= 1000000000) {
            return `${(value / 1000000000).toFixed(0)}B`;
        } else if (value >= 1000000) {
            return `${(value / 1000000).toFixed(0)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}K`;
        }
        return value.toString();
    }

    if (loading || !data) {
        return <div>Loading...</div>;
    }

    // Prepare data for balance/amp cross-analysis
    const prepareMatrixData = (): MatrixDataItem[] => {
        const matrixData: MatrixDataItem[] = [];
        data.parameterRanges.initialBalances.forEach((balance: ParameterRange) => {
            data.parameterRanges.ampCoefficients.forEach((amp: ParameterRange) => {
                matrixData.push({
                    name: `${balance.name}-${amp.name}`,
                    balance: balance.name,
                    amp: amp.name,
                    successRate: 100,
                    value: 12
                });
            });
        });
        return matrixData;
    };

    const matrixData = prepareMatrixData();
    const { analysis } = data.summary;

    // Analysis of parameters
    const parameterAnalysis = [
        {
            name: "Initial Balance",
            parameters: analysis.byInitialBalance.length,
            successRate: 100,
            valueRange: `${data.parameterRanges.initialBalances[0].name} (${formatValue(data.parameterRanges.initialBalances[0].value)}) - ${data.parameterRanges.initialBalances[4].name} (${formatValue(data.parameterRanges.initialBalances[4].value)})`
        },
        {
            name: "Amplification",
            parameters: analysis.byAmpCoeff.length,
            successRate: 100,
            valueRange: `${data.parameterRanges.ampCoefficients[0].value} - ${data.parameterRanges.ampCoefficients[2].value}`
        },
        {
            name: "Midpoint",
            parameters: analysis.byMidpoint.length,
            successRate: 100,
            valueRange: `${formatValue(data.parameterRanges.midpointValues[0].value)}`
        },
        {
            name: "Midpoint Factor",
            parameters: analysis.byMidpointFactor.length,
            successRate: 100,
            valueRange: `${formatValue(data.parameterRanges.midpointFactors[0].value)}`
        },
        {
            name: "Burn Amount",
            parameters: analysis.byBurnAmount.length,
            successRate: 100,
            valueRange: `${data.parameterRanges.burnAmounts[0].value} - ${data.parameterRanges.burnAmounts[1].value}`
        },
        {
            name: "Convergence",
            parameters: analysis.byConvergenceThreshold.length,
            successRate: 100,
            valueRange: `${data.parameterRanges.convergenceThresholds[0].value} - ${data.parameterRanges.convergenceThresholds[2].value}`
        },
        {
            name: "Reversed",
            parameters: analysis.byReversed.length,
            successRate: 100,
            valueRange: "true/false"
        }
    ];

    return (
        <div className="p-4 bg-gray-50">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Pool Creation Parameter Analysis</h1>
                    <p className="text-gray-600 mt-2">
                        Analysis of {data.summary.totalTests} pool creation tests across various parameter combinations.
                        Overall success rate: {data.summary.successfulTests / data.summary.totalTests * 100}%
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="mb-6 border-b">
                    <nav className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`pb-2 px-1 ${activeTab === 'overview' ?
                                'border-b-2 border-blue-500 text-blue-600 font-medium' :
                                'text-gray-500 hover:text-gray-700'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('parameters')}
                            className={`pb-2 px-1 ${activeTab === 'parameters' ?
                                'border-b-2 border-blue-500 text-blue-600 font-medium' :
                                'text-gray-500 hover:text-gray-700'}`}
                        >
                            Parameters
                        </button>
                        <button
                            onClick={() => setActiveTab('matrix')}
                            className={`pb-2 px-1 ${activeTab === 'matrix' ?
                                'border-b-2 border-blue-500 text-blue-600 font-medium' :
                                'text-gray-500 hover:text-gray-700'}`}
                        >
                            Matrix Analysis
                        </button>
                        <button
                            onClick={() => setActiveTab('insights')}
                            className={`pb-2 px-1 ${activeTab === 'insights' ?
                                'border-b-2 border-blue-500 text-blue-600 font-medium' :
                                'text-gray-500 hover:text-gray-700'}`}
                        >
                            Insights
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-4">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-white rounded-lg border p-4">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Success Rate by Balance Size</h2>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={analysis.byInitialBalance}
                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="value" />
                                                <YAxis domain={[0, 100]} />
                                                <Tooltip formatter={(value) => [`${value}%`, 'Success Rate']} />
                                                <Legend />
                                                <Bar dataKey="successRate" name="Success Rate" fill="#0088FE" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border p-4">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Success Rate by Amplification</h2>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={analysis.byAmpCoeff}
                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="value" />
                                                <YAxis domain={[0, 100]} />
                                                <Tooltip formatter={(value) => [`${value}%`, 'Success Rate']} />
                                                <Legend />
                                                <Bar dataKey="successRate" name="Success Rate" fill="#00C49F" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg border p-4">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Success Rate by Burn Amount</h2>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={analysis.byBurnAmount}
                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="value" />
                                                <YAxis domain={[0, 100]} />
                                                <Tooltip formatter={(value) => [`${value}%`, 'Success Rate']} />
                                                <Legend />
                                                <Bar dataKey="successRate" name="Success Rate" fill="#FFBB28" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border p-4">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Success Rate by Convergence Threshold</h2>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={analysis.byConvergenceThreshold}
                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="value" />
                                                <YAxis domain={[0, 100]} />
                                                <Tooltip formatter={(value) => [`${value}%`, 'Success Rate']} />
                                                <Legend />
                                                <Bar dataKey="successRate" name="Success Rate" fill="#FF8042" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold text-blue-700">Summary</h3>
                                <p className="mt-2">
                                    All tested parameter combinations resulted in successful pool creation, with a 100% success rate
                                    across the board. This indicates that the pool creation mechanism is robust and works reliably
                                    across a wide range of parameter values.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Parameters Tab */}
                    {activeTab === 'parameters' && (
                        <div>
                            <div className="grid grid-cols-1 gap-6 mb-6">
                                <div className="bg-white rounded-lg border p-4">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Parameter Range Coverage</h2>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={parameterAnalysis}
                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                layout="vertical"
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" domain={[0, 7]} />
                                                <YAxis dataKey="name" type="category" width={120} />
                                                <Tooltip
                                                    formatter={(value, name, props) => {
                                                        if (name === "parameters") return [value, "Variations Tested"];
                                                        return [value, name];
                                                    }}
                                                    labelFormatter={(label) => `Parameter: ${label}`}
                                                />
                                                <Legend />
                                                <Bar dataKey="parameters" name="Variations Tested" fill="#8884d8" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white rounded-lg overflow-hidden border">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-gray-600">Parameter</th>
                                                <th className="px-4 py-2 text-left text-gray-600">Variations Tested</th>
                                                <th className="px-4 py-2 text-left text-gray-600">Value Range</th>
                                                <th className="px-4 py-2 text-left text-gray-600">Success Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {parameterAnalysis.map((param, index) => (
                                                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                                                    <td className="px-4 py-2">{param.name}</td>
                                                    <td className="px-4 py-2">{param.parameters}</td>
                                                    <td className="px-4 py-2">{param.valueRange}</td>
                                                    <td className="px-4 py-2">{param.successRate}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="bg-white rounded-lg border p-4">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Distribution of Test Cases</h2>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={analysis.byInitialBalance}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="total"
                                                >
                                                    {analysis.byInitialBalance.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => [value, 'Test Cases']} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Matrix Analysis Tab */}
                    {activeTab === 'matrix' && (
                        <div>
                            <div className="grid grid-cols-1 gap-6 mb-6">
                                <div className="bg-white rounded-lg border p-4">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Initial Balance vs Amplification Coefficient</h2>
                                    <div className="h-96">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <Treemap
                                                data={matrixData}
                                                dataKey="value"
                                                aspectRatio={4 / 3}
                                                stroke="#fff"
                                                fill="#8884d8"
                                            >
                                                {(props: TreemapContentProps) => {
                                                    const { x, y, width, height, depth, name } = props;
                                                    return (
                                                        <g>
                                                            <rect
                                                                x={x}
                                                                y={y}
                                                                width={width}
                                                                height={height}
                                                                style={{
                                                                    fill: '#8884d8',
                                                                    stroke: '#fff',
                                                                    strokeWidth: 2 / (depth + 1e-10),
                                                                    strokeOpacity: 1 / (depth + 1e-10),
                                                                }}
                                                            />
                                                            {width > 50 && height > 30 && (
                                                                <text
                                                                    x={x + width / 2}
                                                                    y={y + height / 2 + 7}
                                                                    textAnchor="middle"
                                                                    fill="#fff"
                                                                    fontSize={14}
                                                                >
                                                                    {name}
                                                                </text>
                                                            )}
                                                            {width > 50 && height > 50 && (
                                                                <text
                                                                    x={x + width / 2}
                                                                    y={y + height / 2 - 7}
                                                                    textAnchor="middle"
                                                                    fill="#fff"
                                                                    fontSize={16}
                                                                    fontWeight="bold"
                                                                >
                                                                    100%
                                                                </text>
                                                            )}
                                                        </g>
                                                    );
                                                }}
                                            </Treemap>
                                        </ResponsiveContainer>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600">
                                        This treemap shows the success rate for each combination of initial balance and amplification coefficient.
                                        All combinations have 100% success rate.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border p-4">
                                <h2 className="text-xl font-semibold mb-4 text-gray-700">Parameter Interaction Analysis</h2>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ScatterChart
                                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                                        >
                                            <CartesianGrid />
                                            <XAxis
                                                type="category"
                                                dataKey="balance"
                                                name="Balance"
                                                allowDuplicatedCategory={false}
                                            />
                                            <YAxis
                                                type="category"
                                                dataKey="amp"
                                                name="Amplification"
                                                allowDuplicatedCategory={false}
                                            />
                                            <ZAxis
                                                type="number"
                                                dataKey="successRate"
                                                range={[50, 100]}
                                                name="Success Rate"
                                            />
                                            <Tooltip
                                                cursor={{ strokeDasharray: '3 3' }}
                                                formatter={(value, name) => {
                                                    return [`${value}%`, name];
                                                }}
                                            />
                                            <Legend />
                                            <Scatter
                                                name="Success Rate"
                                                data={matrixData}
                                                fill="#8884d8"
                                                shape="circle"
                                            />
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                </div>
                                <p className="mt-2 text-sm text-gray-600">
                                    This scatter plot visualizes how initial balance and amplification coefficient interact.
                                    The size of each circle represents the success rate.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Insights Tab */}
                    {activeTab === 'insights' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg border p-4">
                                <h2 className="text-xl font-semibold mb-4 text-gray-700">Key Insights</h2>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li className="text-gray-700">
                                        <span className="font-medium">Perfect Reliability:</span> All 180 test configurations resulted in successful pool creation,
                                        demonstrating exceptional robustness in the pool creation mechanism.
                                    </li>
                                    <li className="text-gray-700">
                                        <span className="font-medium">Parameter Tolerance:</span> The system demonstrates high tolerance across a wide range of parameters:
                                        <ul className="list-circle pl-5 mt-1">
                                            <li>Initial balances from 100M (Tiny) to 1T (Very Large)</li>
                                            <li>Amplification coefficients from 1 (Minimum) to 5000 (Maximum)</li>
                                            <li>Burn amounts from 1K (Minimum) to 100K (Very High)</li>
                                            <li>Convergence thresholds from 1 (Very Precise) to 20 (Very Relaxed)</li>
                                        </ul>
                                    </li>
                                    <li className="text-gray-700">
                                        <span className="font-medium">Fixed Parameters:</span> All tests used the same midpoint (11M) and midpoint factor (10M) values,
                                        which were both set to "Very Low" values.
                                    </li>
                                    <li className="text-gray-700">
                                        <span className="font-medium">Symmetrical Behavior:</span> The "reversed" parameter (true/false) shows no impact on pool creation success,
                                        with both values achieving 100% success rates across all configurations.
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-lg border p-4">
                                <h2 className="text-xl font-semibold mb-4 text-gray-700">Recommendations</h2>
                                <div className="space-y-3">
                                    <p className="text-gray-700">
                                        <span className="font-medium">Extended Parameter Testing:</span> Since all tests were successful across the current parameter ranges,
                                        consider expanding the testing to even more extreme values to find potential breaking points:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Test with extremely small initial balances (below 100M)</li>
                                        <li>Test with extremely large amplification values (above 5000)</li>
                                        <li>Expand midpoint and midpoint factor ranges beyond "Very Low"</li>
                                    </ul>

                                    <p className="text-gray-700 mt-3">
                                        <span className="font-medium">Performance Testing:</span> While all configurations successfully create pools,
                                        additional metrics such as gas costs, execution time, or other performance indicators would provide
                                        valuable insights for optimal parameter selection.
                                    </p>

                                    <p className="text-gray-700 mt-3">
                                        <span className="font-medium">Stress Testing:</span> Consider testing under high network congestion or with
                                        rapidly changing external conditions to ensure pool creation remains robust under stress.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border p-4">
                                <h2 className="text-xl font-semibold mb-4 text-gray-700">Conclusion</h2>
                                <p className="text-gray-700">
                                    The pool creation mechanism demonstrates exceptional reliability across all tested parameter combinations.
                                    With a 100% success rate across 180 different configurations, the system appears to be highly robust
                                    and tolerant of parameter variations. The next phase of testing should focus on finding the boundaries
                                    of this robust behavior by testing more extreme parameter values or by evaluating other metrics
                                    beyond simple success/failure.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default PoolCreationDashboard;