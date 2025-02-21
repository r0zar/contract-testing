'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell, ScatterChart, Scatter, ZAxis, ReferenceLine
} from 'recharts';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

// Add proper TypeScript types for the chart data
type MatrixDataType = {
  id: string;
  name: string;
  midpoint: string;
  factor: string;
  profit: number;
  impact: number;
  score: number;
};

type AmpInfluenceDataType = {
  ampCoeff: number;
  ampName: string;
  profit: number;
  impact: number;
  score: number;
};

// Fix click handler type for BarChart
type BarChartClickPayload = {
  activePayload?: Array<{
    payload: MatrixDataType;
  }>;
};

// Add type for metric
type Metric = {
  name: string;
  dataKey: 'profit' | 'impact' | 'score';  // Limit to known keys
  description: string;
  colorFn: (value: number) => string;
};

// Add these constant definitions near your other constants:
const PARAMETER_EXPLANATIONS = {
  midpoint: {
    title: "Target Price",
    description: "The target price ratio between STX and stSTX. For example, if stSTX should be worth 1.05 STX, set this to 105M.",
    values: {
      "Standard": "100M - Equal value (1:1 ratio)",
      "Premium": "105M - stSTX premium (1.05:1 ratio)"
    }
  },
  midpointFactor: {
    title: "Price Stability",
    description: "Controls how strongly the pool maintains the target price. Higher values allow more price movement around the target.",
    values: {
      "Tight": "50M - Keeps price close to target",
      "Flexible": "100M - Allows more price discovery"
    }
  },
  midpointReversed: {
    title: "Premium Token",
    description: "Determines which token gets the price premium. For STX-stSTX, this should be false to give stSTX the premium.",
    values: {
      "True": "STX gets the premium",
      "False": "stSTX gets the premium"
    }
  },
  midpointRelationship: {
    title: "Midpoint Relationship",
    description: "These three parameters work together to create an asymmetric curve that can favor one token over another. The combination determines how the pool responds to price changes and which token is favored in the curve.",
    details: [
      "Midpoint sets the target price point",
      "Midpoint Factor controls response rate",
      "Midpoint Reversed determines direction"
    ]
  }
};

const PoolConfigurationDashboard = () => {
  // Abbreviated data - actual data would be the full JSON
  const data = {
    "timestamp": "2025-02-21T17-17-15-356Z",
    "testParameters": {
      "initialPoolBalance": 1000000000000,
      "stxPriceUSD": 1,
      "ststxPriceUSD": 1.1,
      "arbAttemptSizes": [
        {
          "name": "Small",
          "value": 1000000000
        },
        {
          "name": "Medium",
          "value": 10000000000
        },
        {
          "name": "Large",
          "value": 50000000000
        }
      ],
      "midpointRanges": [
        {
          "name": "Standard",
          "value": 110000000
        }
      ],
      "midpointFactorRanges": [
        {
          "name": "Standard",
          "value": 100000000
        }
      ],
      "ampRanges": [
        {
          "name": "Very Low",
          "value": 1
        },
        {
          "name": "Low",
          "value": 10
        },
        {
          "name": "Medium",
          "value": 50
        },
        {
          "name": "Standard",
          "value": 100
        },
        {
          "name": "High",
          "value": 500
        },
        {
          "name": "Very High",
          "value": 1000
        }
      ]
    },
    "statistics": {
      "totalTests": 12,
      "successfulTests": 12,
      "averageScore": -16.97239872181816,
      "medianScore": 2.06536056985789,
      "bestScore": -42.90552970365259,
      "worstScore": 2.06536056985789,
      "averagePriceImpact": 1.0100377406705876,
      "averageMaxProfit": 1.190476166142857
    },
    "top10Configurations": [
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 1,
        "reversed": true,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": -0.0022735360523809594,
            "priceImpact": 0.09979997509999006,
            "success": true
          },
          {
            "size": "Medium",
            "profitPercent": -0.02193997409198815,
            "priceImpact": 0.9975004459915776,
            "success": true
          },
          {
            "size": "Large",
            "profitPercent": -0.08928178041083765,
            "priceImpact": 4.962825012549462,
            "success": true
          }
        ],
        "averageProfitPercent": -0.03783176351840225,
        "maxProfitPercent": 0,
        "averagePriceImpact": 2.0200418112136767,
        "successRate": 100,
        "score": -42.90552970365259
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 10,
        "reversed": true,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": -0.002278634228571437,
            "priceImpact": 0.09979999550000507,
            "success": true
          },
          {
            "size": "Medium",
            "profitPercent": -0.022546090830179243,
            "priceImpact": 0.9975029378267756,
            "success": true
          },
          {
            "size": "Large",
            "profitPercent": -0.1067053203487022,
            "priceImpact": 4.962926819232717,
            "success": true
          }
        ],
        "averageProfitPercent": -0.043843348469150965,
        "maxProfitPercent": 0,
        "averagePriceImpact": 2.020076584186499,
        "successRate": 100,
        "score": -35.620854021192685
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 50,
        "reversed": true,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": -0.002279522909523816,
            "priceImpact": 0.09979999909999204,
            "success": true
          },
          {
            "size": "Medium",
            "profitPercent": -0.022651733557965927,
            "priceImpact": 0.9975033721430098,
            "success": true
          },
          {
            "size": "Large",
            "profitPercent": -0.10974296915839117,
            "priceImpact": 4.962944569201875,
            "success": true
          }
        ],
        "averageProfitPercent": -0.044891408541960304,
        "maxProfitPercent": 0,
        "averagePriceImpact": 2.020082646814959,
        "successRate": 100,
        "score": -34.551006873118595
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 100,
        "reversed": true,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": -0.002279643804761907,
            "priceImpact": 0.09979999959999208,
            "success": true
          },
          {
            "size": "Medium",
            "profitPercent": -0.022666115526851563,
            "priceImpact": 0.9975034312155547,
            "success": true
          },
          {
            "size": "Large",
            "profitPercent": -0.11015654154070177,
            "priceImpact": 4.962946985855039,
            "success": true
          }
        ],
        "averageProfitPercent": -0.04503410029077174,
        "maxProfitPercent": 0,
        "averagePriceImpact": 2.020083472223529,
        "successRate": 100,
        "score": -34.40920867028966
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 500,
        "reversed": true,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": -0.0022797423047619045,
            "priceImpact": 0.09979999989999655,
            "success": true
          },
          {
            "size": "Medium",
            "profitPercent": -0.02267782792731256,
            "priceImpact": 0.9975034793710915,
            "success": true
          },
          {
            "size": "Large",
            "profitPercent": -0.11049334890040712,
            "priceImpact": 4.962948953932864,
            "success": true
          }
        ],
        "averageProfitPercent": -0.045150306377493864,
        "maxProfitPercent": 0,
        "averagePriceImpact": 2.0200841444013173,
        "successRate": 100,
        "score": -34.29439389348637
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 1000,
        "reversed": true,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": -0.002279754752380952,
            "priceImpact": 0.09980000000000544,
            "success": true
          },
          {
            "size": "Medium",
            "profitPercent": -0.022679305179495002,
            "priceImpact": 0.9975034854917141,
            "success": true
          },
          {
            "size": "Large",
            "profitPercent": -0.11053582870938052,
            "priceImpact": 4.962949202129485,
            "success": true
          }
        ],
        "averageProfitPercent": -0.045164962880418824,
        "maxProfitPercent": 0,
        "averagePriceImpact": 2.020084229207068,
        "successRate": 100,
        "score": -34.27995491922533
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 1,
        "reversed": false,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": 0.047618996519047614,
            "priceImpact": 0,
            "success": true
          },
          {
            "size": "Medium",
            "profitPercent": 0.4761904253338095,
            "priceImpact": 0,
            "success": true
          },
          {
            "size": "Large",
            "profitPercent": 2.380952332285714,
            "priceImpact": 0,
            "success": true
          }
        ],
        "averageProfitPercent": 0.9682539180461903,
        "maxProfitPercent": 2.380952332285714,
        "averagePriceImpact": 0,
        "successRate": 100,
        "score": 2.06536056985789
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 10,
        "reversed": false,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": 0.047618996519047614,
            "priceImpact": 0,
            "success": true
          },
          {
            "size": "Medium",
            "profitPercent": 0.4761904253338095,
            "priceImpact": 0,
            "success": true
          },
          {
            "size": "Large",
            "profitPercent": 2.380952332285714,
            "priceImpact": 0,
            "success": true
          }
        ],
        "averageProfitPercent": 0.9682539180461903,
        "maxProfitPercent": 2.380952332285714,
        "averagePriceImpact": 0,
        "successRate": 100,
        "score": 2.06536056985789
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 50,
        "reversed": false,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": 0.047618996519047614,
            "priceImpact": 0,
            "success": true
          },
          {
            "size": "Medium",
            "profitPercent": 0.4761904253338095,
            "priceImpact": 0,
            "success": true
          },
          {
            "size": "Large",
            "profitPercent": 2.380952332285714,
            "priceImpact": 0,
            "success": true
          }
        ],
        "averageProfitPercent": 0.9682539180461903,
        "maxProfitPercent": 2.380952332285714,
        "averagePriceImpact": 0,
        "successRate": 100,
        "score": 2.06536056985789
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 100,
        "reversed": false,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": 0.047618996519047614,
            "priceImpact": 0,
            "success": true
          },
          {
            "size": "Medium",
            "profitPercent": 0.4761904253338095,
            "priceImpact": 0,
            "success": true
          },
          {
            "size": "Large",
            "profitPercent": 2.380952332285714,
            "priceImpact": 0,
            "success": true
          }
        ],
        "averageProfitPercent": 0.9682539180461903,
        "maxProfitPercent": 2.380952332285714,
        "averagePriceImpact": 0,
        "successRate": 100,
        "score": 2.06536056985789
      }
    ],
    "allResults": [
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 1,
        "reversed": true,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": -0.0022735360523809594,
            "priceImpact": 0.09979997509999006,
            "success": true,
            "formattedProfit": "-0.0023%",
            "formattedPriceImpact": "0.0998%"
          },
          {
            "size": "Medium",
            "profitPercent": -0.02193997409198815,
            "priceImpact": 0.9975004459915776,
            "success": true,
            "formattedProfit": "-0.0219%",
            "formattedPriceImpact": "0.9975%"
          },
          {
            "size": "Large",
            "profitPercent": -0.08928178041083765,
            "priceImpact": 4.962825012549462,
            "success": true,
            "formattedProfit": "-0.0893%",
            "formattedPriceImpact": "4.9628%"
          }
        ],
        "averageProfitPercent": -0.03783176351840225,
        "maxProfitPercent": 0,
        "averagePriceImpact": 2.0200418112136767,
        "successRate": 100,
        "score": -42.90552970365259
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 10,
        "reversed": true,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": -0.002278634228571437,
            "priceImpact": 0.09979999550000507,
            "success": true,
            "formattedProfit": "-0.0023%",
            "formattedPriceImpact": "0.0998%"
          },
          {
            "size": "Medium",
            "profitPercent": -0.022546090830179243,
            "priceImpact": 0.9975029378267756,
            "success": true,
            "formattedProfit": "-0.0225%",
            "formattedPriceImpact": "0.9975%"
          },
          {
            "size": "Large",
            "profitPercent": -0.1067053203487022,
            "priceImpact": 4.962926819232717,
            "success": true,
            "formattedProfit": "-0.1067%",
            "formattedPriceImpact": "4.9629%"
          }
        ],
        "averageProfitPercent": -0.043843348469150965,
        "maxProfitPercent": 0,
        "averagePriceImpact": 2.020076584186499,
        "successRate": 100,
        "score": -35.620854021192685
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 50,
        "reversed": true,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": -0.002279522909523816,
            "priceImpact": 0.09979999909999204,
            "success": true,
            "formattedProfit": "-0.0023%",
            "formattedPriceImpact": "0.0998%"
          },
          {
            "size": "Medium",
            "profitPercent": -0.022651733557965927,
            "priceImpact": 0.9975033721430098,
            "success": true,
            "formattedProfit": "-0.0227%",
            "formattedPriceImpact": "0.9975%"
          },
          {
            "size": "Large",
            "profitPercent": -0.10974296915839117,
            "priceImpact": 4.962944569201875,
            "success": true,
            "formattedProfit": "-0.1097%",
            "formattedPriceImpact": "4.9629%"
          }
        ],
        "averageProfitPercent": -0.044891408541960304,
        "maxProfitPercent": 0,
        "averagePriceImpact": 2.020082646814959,
        "successRate": 100,
        "score": -34.551006873118595
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 100,
        "reversed": true,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": -0.002279643804761907,
            "priceImpact": 0.09979999959999208,
            "success": true,
            "formattedProfit": "-0.0023%",
            "formattedPriceImpact": "0.0998%"
          },
          {
            "size": "Medium",
            "profitPercent": -0.022666115526851563,
            "priceImpact": 0.9975034312155547,
            "success": true,
            "formattedProfit": "-0.0227%",
            "formattedPriceImpact": "0.9975%"
          },
          {
            "size": "Large",
            "profitPercent": -0.11015654154070177,
            "priceImpact": 4.962946985855039,
            "success": true,
            "formattedProfit": "-0.1102%",
            "formattedPriceImpact": "4.9629%"
          }
        ],
        "averageProfitPercent": -0.04503410029077174,
        "maxProfitPercent": 0,
        "averagePriceImpact": 2.020083472223529,
        "successRate": 100,
        "score": -34.40920867028966
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 500,
        "reversed": true,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": -0.0022797423047619045,
            "priceImpact": 0.09979999989999655,
            "success": true,
            "formattedProfit": "-0.0023%",
            "formattedPriceImpact": "0.0998%"
          },
          {
            "size": "Medium",
            "profitPercent": -0.02267782792731256,
            "priceImpact": 0.9975034793710915,
            "success": true,
            "formattedProfit": "-0.0227%",
            "formattedPriceImpact": "0.9975%"
          },
          {
            "size": "Large",
            "profitPercent": -0.11049334890040712,
            "priceImpact": 4.962948953932864,
            "success": true,
            "formattedProfit": "-0.1105%",
            "formattedPriceImpact": "4.9629%"
          }
        ],
        "averageProfitPercent": -0.045150306377493864,
        "maxProfitPercent": 0,
        "averagePriceImpact": 2.0200841444013173,
        "successRate": 100,
        "score": -34.29439389348637
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 1000,
        "reversed": true,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": -0.002279754752380952,
            "priceImpact": 0.09980000000000544,
            "success": true,
            "formattedProfit": "-0.0023%",
            "formattedPriceImpact": "0.0998%"
          },
          {
            "size": "Medium",
            "profitPercent": -0.022679305179495002,
            "priceImpact": 0.9975034854917141,
            "success": true,
            "formattedProfit": "-0.0227%",
            "formattedPriceImpact": "0.9975%"
          },
          {
            "size": "Large",
            "profitPercent": -0.11053582870938052,
            "priceImpact": 4.962949202129485,
            "success": true,
            "formattedProfit": "-0.1105%",
            "formattedPriceImpact": "4.9629%"
          }
        ],
        "averageProfitPercent": -0.045164962880418824,
        "maxProfitPercent": 0,
        "averagePriceImpact": 2.020084229207068,
        "successRate": 100,
        "score": -34.27995491922533
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 1,
        "reversed": false,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": 0.047618996519047614,
            "priceImpact": 0,
            "success": true,
            "formattedProfit": "0.0476%",
            "formattedPriceImpact": "0.0000%"
          },
          {
            "size": "Medium",
            "profitPercent": 0.4761904253338095,
            "priceImpact": 0,
            "success": true,
            "formattedProfit": "0.4762%",
            "formattedPriceImpact": "0.0000%"
          },
          {
            "size": "Large",
            "profitPercent": 2.380952332285714,
            "priceImpact": 0,
            "success": true,
            "formattedProfit": "2.3810%",
            "formattedPriceImpact": "0.0000%"
          }
        ],
        "averageProfitPercent": 0.9682539180461903,
        "maxProfitPercent": 2.380952332285714,
        "averagePriceImpact": 0,
        "successRate": 100,
        "score": 2.06536056985789
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 10,
        "reversed": false,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": 0.047618996519047614,
            "priceImpact": 0,
            "success": true,
            "formattedProfit": "0.0476%",
            "formattedPriceImpact": "0.0000%"
          },
          {
            "size": "Medium",
            "profitPercent": 0.4761904253338095,
            "priceImpact": 0,
            "success": true,
            "formattedProfit": "0.4762%",
            "formattedPriceImpact": "0.0000%"
          },
          {
            "size": "Large",
            "profitPercent": 2.380952332285714,
            "priceImpact": 0,
            "success": true,
            "formattedProfit": "2.3810%",
            "formattedPriceImpact": "0.0000%"
          }
        ],
        "averageProfitPercent": 0.9682539180461903,
        "maxProfitPercent": 2.380952332285714,
        "averagePriceImpact": 0,
        "successRate": 100,
        "score": 2.06536056985789
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 50,
        "reversed": false,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": 0.047618996519047614,
            "priceImpact": 0,
            "success": true,
            "formattedProfit": "0.0476%",
            "formattedPriceImpact": "0.0000%"
          },
          {
            "size": "Medium",
            "profitPercent": 0.4761904253338095,
            "priceImpact": 0,
            "success": true,
            "formattedProfit": "0.4762%",
            "formattedPriceImpact": "0.0000%"
          },
          {
            "size": "Large",
            "profitPercent": 2.380952332285714,
            "priceImpact": 0,
            "success": true,
            "formattedProfit": "2.3810%",
            "formattedPriceImpact": "0.0000%"
          }
        ],
        "averageProfitPercent": 0.9682539180461903,
        "maxProfitPercent": 2.380952332285714,
        "averagePriceImpact": 0,
        "successRate": 100,
        "score": 2.06536056985789
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 100,
        "reversed": false,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": 0.047618996519047614,
            "priceImpact": 0,
            "success": true,
            "formattedProfit": "0.0476%",
            "formattedPriceImpact": "0.0000%"
          },
          {
            "size": "Medium",
            "profitPercent": 0.4761904253338095,
            "priceImpact": 0,
            "success": true,
            "formattedProfit": "0.4762%",
            "formattedPriceImpact": "0.0000%"
          },
          {
            "size": "Large",
            "profitPercent": 2.380952332285714,
            "priceImpact": 0,
            "success": true,
            "formattedProfit": "2.3810%",
            "formattedPriceImpact": "0.0000%"
          }
        ],
        "averageProfitPercent": 0.9682539180461903,
        "maxProfitPercent": 2.380952332285714,
        "averagePriceImpact": 0,
        "successRate": 100,
        "score": 2.06536056985789
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 500,
        "reversed": false,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": 0.047618996519047614,
            "priceImpact": 0,
            "success": true,
            "formattedProfit": "0.0476%",
            "formattedPriceImpact": "0.0000%"
          },
          {
            "size": "Medium",
            "profitPercent": 0.4761904253338095,
            "priceImpact": 0,
            "success": true,
            "formattedProfit": "0.4762%",
            "formattedPriceImpact": "0.0000%"
          },
          {
            "size": "Large",
            "profitPercent": 2.380952332285714,
            "priceImpact": 0,
            "success": true,
            "formattedProfit": "2.3810%",
            "formattedPriceImpact": "0.0000%"
          }
        ],
        "averageProfitPercent": 0.9682539180461903,
        "maxProfitPercent": 2.380952332285714,
        "averagePriceImpact": 0,
        "successRate": 100,
        "score": 2.06536056985789
      },
      {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 1000,
        "reversed": false,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": 0.047618996519047614,
            "priceImpact": 0,
            "success": true,
            "formattedProfit": "0.0476%",
            "formattedPriceImpact": "0.0000%"
          },
          {
            "size": "Medium",
            "profitPercent": 0.4761904253338095,
            "priceImpact": 0,
            "success": true,
            "formattedProfit": "0.4762%",
            "formattedPriceImpact": "0.0000%"
          },
          {
            "size": "Large",
            "profitPercent": 2.380952332285714,
            "priceImpact": 0,
            "success": true,
            "formattedProfit": "2.3810%",
            "formattedPriceImpact": "0.0000%"
          }
        ],
        "averageProfitPercent": 0.9682539180461903,
        "maxProfitPercent": 2.380952332285714,
        "averagePriceImpact": 0,
        "successRate": 100,
        "score": 2.06536056985789
      }
    ],
    "summary": {
      "bestConfiguration": {
        "midpoint": 110000000,
        "midpointFactor": 100000000,
        "ampCoeff": 1,
        "reversed": true,
        "arbAttempts": [
          {
            "size": "Small",
            "profitPercent": -0.0022735360523809594,
            "priceImpact": 0.09979997509999006,
            "success": true
          },
          {
            "size": "Medium",
            "profitPercent": -0.02193997409198815,
            "priceImpact": 0.9975004459915776,
            "success": true
          },
          {
            "size": "Large",
            "profitPercent": -0.08928178041083765,
            "priceImpact": 4.962825012549462,
            "success": true
          }
        ],
        "averageProfitPercent": -0.03783176351840225,
        "maxProfitPercent": 0,
        "averagePriceImpact": 2.0200418112136767,
        "successRate": 100,
        "score": -42.90552970365259,
        "description": "Midpoint: 110000000, Factor: 100000000, Amp: 1, Reversed: true"
      },
      "recommendations": [
        {
          "category": "Most Stable",
          "config": {
            "midpoint": 110000000,
            "midpointFactor": 100000000,
            "ampCoeff": 1000,
            "reversed": false,
            "arbAttempts": [
              {
                "size": "Small",
                "profitPercent": 0.047618996519047614,
                "priceImpact": 0,
                "success": true
              },
              {
                "size": "Medium",
                "profitPercent": 0.4761904253338095,
                "priceImpact": 0,
                "success": true
              },
              {
                "size": "Large",
                "profitPercent": 2.380952332285714,
                "priceImpact": 0,
                "success": true
              }
            ],
            "averageProfitPercent": 0.9682539180461903,
            "maxProfitPercent": 2.380952332285714,
            "averagePriceImpact": 0,
            "successRate": 100,
            "score": 2.06536056985789
          },
          "reason": "Lowest price impact across all tests"
        },
        {
          "category": "Most Profitable for Pool",
          "config": {
            "midpoint": 110000000,
            "midpointFactor": 100000000,
            "ampCoeff": 1000,
            "reversed": false,
            "arbAttempts": [
              {
                "size": "Small",
                "profitPercent": 0.047618996519047614,
                "priceImpact": 0,
                "success": true
              },
              {
                "size": "Medium",
                "profitPercent": 0.4761904253338095,
                "priceImpact": 0,
                "success": true
              },
              {
                "size": "Large",
                "profitPercent": 2.380952332285714,
                "priceImpact": 0,
                "success": true
              }
            ],
            "averageProfitPercent": 0.9682539180461903,
            "maxProfitPercent": 2.380952332285714,
            "averagePriceImpact": 0,
            "successRate": 100,
            "score": 2.06536056985789
          },
          "reason": "Highest profit for the pool from arbitrage activities"
        },
        {
          "category": "Most Reliable",
          "config": {
            "midpoint": 110000000,
            "midpointFactor": 100000000,
            "ampCoeff": 1000,
            "reversed": false,
            "arbAttempts": [
              {
                "size": "Small",
                "profitPercent": 0.047618996519047614,
                "priceImpact": 0,
                "success": true
              },
              {
                "size": "Medium",
                "profitPercent": 0.4761904253338095,
                "priceImpact": 0,
                "success": true
              },
              {
                "size": "Large",
                "profitPercent": 2.380952332285714,
                "priceImpact": 0,
                "success": true
              }
            ],
            "averageProfitPercent": 0.9682539180461903,
            "maxProfitPercent": 2.380952332285714,
            "averagePriceImpact": 0,
            "successRate": 100,
            "score": 2.06536056985789
          },
          "reason": "Highest success rate across all test cases"
        }
      ]
    }
  }

  // Process data for visualization
  const ampCoeffMap = {
    1: "Very Low",
    10: "Low",
    50: "Medium",
    100: "Standard",
    500: "High",
    1000: "Very High"
  };

  const midpointMap = {
    50000000: "Low",
    100000000: "Standard"
  };

  const midpointFactorMap = {
    50000000: "Low",
    100000000: "Standard"
  };

  // Filter out failed tests for visualizations
  const successfulTests = data.allResults.filter(r => r.successRate === 100);

  // Configuration combinations matrix
  const matrixData = [
    { id: "Low-Low", name: "Low-Low", midpoint: "Low", factor: "Low", profit: -0.022, impact: 0.998, score: -86.03 },
    { id: "Low-Standard", name: "Low-Standard", midpoint: "Low", factor: "Standard", profit: 0.476, impact: 0, score: 4.20 },
    { id: "Standard-Low", name: "Standard-Low", midpoint: "Standard", factor: "Low", profit: 0.476, impact: 0, score: 4.20 },
    { id: "Standard-Standard", name: "Standard-Standard", midpoint: "Standard", factor: "Standard", profit: -0.022, impact: 0.998, score: -86.03 }
  ];

  // Amplification impact data
  const ampInfluenceData = [
    { ampCoeff: 1, ampName: "Very Low", profit: -0.022, impact: 0.998, score: -86.03 },
    { ampCoeff: 10, ampName: "Low", profit: -0.023, impact: 0.998, score: -83.98 },
    { ampCoeff: 50, ampName: "Medium", profit: -0.023, impact: 0.998, score: -83.63 },
    { ampCoeff: 100, ampName: "Standard", profit: -0.023, impact: 0.998, score: -83.59 },
    { ampCoeff: 500, ampName: "High", profit: -0.023, impact: 0.998, score: -83.55 },
    { ampCoeff: 1000, ampName: "Very High", profit: -0.023, impact: 0.998, score: -83.54 }
  ];

  // Recommendations data
  const recommendationsData = [
    {
      category: "Most Stable",
      midpoint: "Standard",
      midpointFactor: "Low",
      ampCoeff: 1000,
      ampName: "Very High",
      reversed: "No",
      profitPercent: 0.476,
      priceImpact: 0,
      score: 4.20,
      reason: "Lowest price impact across all tests"
    },
    {
      category: "Most Profitable for Pool",
      midpoint: "Standard",
      midpointFactor: "Low",
      ampCoeff: 1000,
      ampName: "Very High",
      reversed: "No",
      profitPercent: 0.476,
      priceImpact: 0,
      score: 4.20,
      reason: "Highest profit for the pool from arbitrage activities"
    },
    {
      category: "Most Reliable",
      midpoint: "Standard",
      midpointFactor: "Low",
      ampCoeff: 1000,
      ampName: "Very High",
      reversed: "No",
      profitPercent: 0.476,
      priceImpact: 0,
      score: 4.20,
      reason: "Highest success rate across all test cases"
    }
  ];

  // Success rate data for each configuration pattern
  const successRateData = [
    { config: "Low-Low", successRate: 100 },
    { config: "Low-Standard", successRate: 50 },
    { config: "Standard-Low", successRate: 50 },
    { config: "Standard-Standard", successRate: 100 }
  ];

  // Fix score color function type
  const getScoreColor = (score: number): string => {
    if (score < -80) return "#22c55e"; // Good (green)
    if (score < 0) return "#3b82f6";   // Medium (blue)
    if (score < 10) return "#eab308";  // Warning (yellow)
    return "#ef4444";                  // Bad (red)
  };

  const getProfitColor = (profit: number): string => {
    if (profit > 0.4) return "#22c55e"; // Good (green)
    if (profit > 0) return "#3b82f6";   // Medium (blue)
    if (profit > -0.05) return "#eab308"; // Warning (yellow)
    return "#ef4444";                   // Bad (red)
  };

  // Available metrics for selection with proper typing
  const metrics: Metric[] = [
    { name: 'Pool Profit %', dataKey: 'profit', description: 'Higher is better for the pool', colorFn: getProfitColor },
    { name: 'Price Impact %', dataKey: 'impact', description: 'Lower is better for stability', colorFn: (v: number) => v < 1 ? "#22c55e" : "#ef4444" },
    { name: 'Score', dataKey: 'score', description: 'Lower scores indicate better configurations', colorFn: getScoreColor }
  ];

  // State for active metric selection
  const [activeMetric, setActiveMetric] = useState(metrics[0]);

  // State for selected config in matrix view
  const [selectedConfig, setSelectedConfig] = useState<MatrixDataType | null>(null);

  // Fix the click handler
  const handleBarClick = (data: BarChartClickPayload) => {
    setSelectedConfig(data.activePayload?.[0]?.payload || null);
  };

  // Advanced visualizations: 3D scatter
  const scatterData = matrixData.map(item => ({
    ...item,
    z: Math.abs(item.score) // Size based on score magnitude
  }));

  // Heatmap Data (simplified)
  const getHeatmapData = () => {
    const heatData = [];
    const midpoints = ["Low", "Standard"];
    const factors = ["Low", "Standard"];

    for (let i = 0; i < midpoints.length; i++) {
      for (let j = 0; j < factors.length; j++) {
        const confKey = `${midpoints[i]}-${factors[j]}`;
        const matchingConfig = matrixData.find(item => item.id === confKey);

        if (matchingConfig) {
          heatData.push({
            x: j,
            y: i,
            midpoint: midpoints[i],
            factor: factors[j],
            value: matchingConfig[activeMetric.dataKey as keyof typeof matchingConfig],
            name: confKey
          });
        }
      }
    }
    return heatData;
  };

  return (
    <div className="min-h-screen bg-background max-w-screen-2xl mx-auto">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-xl font-semibold">StableSwap Pool Configuration</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">Export Data</Button>
            <Button size="sm">Save Configuration</Button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="container py-6">
        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.statistics.totalTests}</div>
              <p className="text-xs text-muted-foreground">
                {data.statistics.successfulTests} successful
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.statistics.averageScore.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Median: {data.statistics.medianScore.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.statistics.bestScore.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Worst: {data.statistics.worstScore.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {((data.statistics.successfulTests / data.statistics.totalTests) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {data.statistics.successfulTests} of {data.statistics.totalTests} tests
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="config-matrix" className="space-y-4">
          <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full">
            <TabsTrigger value="config-matrix">Configuration Matrix</TabsTrigger>
            <TabsTrigger value="amp-impact">Amplification Impact</TabsTrigger>
            <TabsTrigger value="advanced-viz">Advanced Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="config-matrix">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Performance Matrix</CardTitle>
                <CardDescription>
                  Analyze how different midpoint and factor combinations perform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Metric Selection */}
                  <div className="flex flex-wrap gap-2">
                    {metrics.map(metric => (
                      <Button
                        key={metric.dataKey}
                        variant={activeMetric.dataKey === metric.dataKey ? "default" : "outline"}
                        onClick={() => setActiveMetric(metric)}
                        size="sm"
                      >
                        {metric.name}
                      </Button>
                    ))}
                  </div>

                  {/* Charts Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Performance Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Performance by Configuration</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={matrixData}
                              margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
                              onClick={handleBarClick}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <RechartsTooltip />
                              <Legend />
                              <Bar
                                dataKey={activeMetric.dataKey}
                                name={activeMetric.name}
                              >
                                {matrixData.map((entry) => (
                                  <Cell
                                    key={`cell-${entry.id}`}
                                    fill={activeMetric.colorFn(entry[activeMetric.dataKey as keyof typeof entry] as number)}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Configuration Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Configuration Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px]">
                          <table className="w-full">
                            <thead>
                              <tr className="text-left text-xs uppercase">
                                <th className="p-2">Config</th>
                                <th className="p-2">Profit %</th>
                                <th className="p-2">Impact %</th>
                                <th className="p-2">Score</th>
                              </tr>
                            </thead>
                            <tbody>
                              {matrixData.map((config) => (
                                <tr
                                  key={config.id}
                                  className={`border-t cursor-pointer hover:bg-muted/50 ${selectedConfig?.id === config.id ? 'bg-muted' : ''
                                    }`}
                                  onClick={() => setSelectedConfig(config)}
                                >
                                  <td className="p-2">{config.name}</td>
                                  <td className="p-2">{config.profit.toFixed(4)}</td>
                                  <td className="p-2">{config.impact.toFixed(4)}</td>
                                  <td className="p-2">{config.score.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Selected Configuration Details */}
                  {selectedConfig && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Selected Configuration: {selectedConfig.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <HoverCard>
                              <HoverCardTrigger className="flex items-center gap-1">
                                <strong>Midpoint:</strong> {selectedConfig.midpoint}
                                <InfoIcon className="h-4 w-4 text-muted-foreground" />
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="font-semibold">{PARAMETER_EXPLANATIONS.midpoint.title}</h4>
                                  <p className="text-sm">{PARAMETER_EXPLANATIONS.midpoint.description}</p>
                                  <div className="pt-2">
                                    <h5 className="font-semibold text-sm">Values:</h5>
                                    {Object.entries(PARAMETER_EXPLANATIONS.midpoint.values).map(([key, value]) => (
                                      <p key={key} className="text-sm">
                                        <strong>{key}:</strong> {value}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </div>

                          <div className="flex items-center gap-2">
                            <HoverCard>
                              <HoverCardTrigger className="flex items-center gap-1">
                                <strong>Factor:</strong> {selectedConfig.factor}
                                <InfoIcon className="h-4 w-4 text-muted-foreground" />
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="font-semibold">{PARAMETER_EXPLANATIONS.midpointFactor.title}</h4>
                                  <p className="text-sm">{PARAMETER_EXPLANATIONS.midpointFactor.description}</p>
                                  <div className="pt-2">
                                    <h5 className="font-semibold text-sm">Values:</h5>
                                    {Object.entries(PARAMETER_EXPLANATIONS.midpointFactor.values).map(([key, value]) => (
                                      <p key={key} className="text-sm">
                                        <strong>{key}:</strong> {value}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </div>

                          {/* Add a Quick Reference Card */}
                          <Card className="mt-4">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">Parameter Quick Reference</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <TooltipProvider>
                                <div className="space-y-2 text-sm">
                                  <Tooltip>
                                    <TooltipTrigger className="flex items-center gap-1 underline decoration-dotted">
                                      What do these values mean?
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <p>Hover over any parameter to see detailed explanations and implications</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <p className="text-muted-foreground">
                                    Lower values generally favor stability, while higher values allow more flexibility
                                  </p>
                                </div>
                              </TooltipProvider>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Rest of your existing content */}
                        <div className="space-y-2">
                          <p><strong>Pool Profit:</strong> {selectedConfig.profit.toFixed(4)}%</p>
                          <p><strong>Price Impact:</strong> {selectedConfig.impact.toFixed(4)}%</p>
                          <p><strong>Score:</strong> {selectedConfig.score.toFixed(2)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Amplification Impact Tab */}
          <TabsContent value="amp-impact">
            <Card>
              <CardHeader>
                <CardTitle>Amplification Coefficient Impact</CardTitle>
                <CardDescription>
                  Analyze how different amplification values affect pool performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Amp Coefficient Line Chart */}
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={ampInfluenceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="ampName" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="profit" name="Profit %" stroke="#22c55e" />
                        <Line type="monotone" dataKey="impact" name="Price Impact %" stroke="#ef4444" />
                        <Line type="monotone" dataKey="score" name="Score" stroke="#3b82f6" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Amp Coefficient Details Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Detailed Metrics by Amplification</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px]">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-xs uppercase">
                              <th className="p-2">Amp Level</th>
                              <th className="p-2">Profit %</th>
                              <th className="p-2">Impact %</th>
                              <th className="p-2">Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ampInfluenceData.map((data) => (
                              <tr key={data.ampName} className="border-t">
                                <td className="p-2">{data.ampName}</td>
                                <td className="p-2">{data.profit.toFixed(4)}</td>
                                <td className="p-2">{data.impact.toFixed(4)}</td>
                                <td className="p-2">{data.score.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Analysis Tab */}
          <TabsContent value="advanced-viz">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analysis</CardTitle>
                <CardDescription>
                  Multi-dimensional analysis of pool configuration performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* 3D Scatter Plot */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">3D Performance Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart
                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                          >
                            <CartesianGrid />
                            <XAxis dataKey="profit" name="Profit %" />
                            <YAxis dataKey="impact" name="Impact %" />
                            <ZAxis dataKey="z" range={[50, 400]} name="Score" />
                            <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Legend />
                            <Scatter name="Configurations" data={scatterData} fill="#8884d8" />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Success Rate Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Configuration Success Rates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={successRateData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="config" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Bar dataKey="successRate" name="Success Rate %" fill="#22c55e">
                              <ReferenceLine y={75} stroke="red" strokeDasharray="3 3" />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Recommendations</CardTitle>
                <CardDescription>
                  Optimal configurations based on different priorities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {recommendationsData.map((rec, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{rec.category}</CardTitle>
                        <CardDescription>{rec.reason}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p><strong>Midpoint:</strong> {rec.midpoint}</p>
                            <p><strong>Factor:</strong> {rec.midpointFactor}</p>
                            <p><strong>Amplification:</strong> {rec.ampName}</p>
                            <p><strong>Reversed:</strong> {rec.reversed}</p>
                          </div>
                          <div className="space-y-2">
                            <p><strong>Profit:</strong> {rec.profitPercent.toFixed(4)}%</p>
                            <p><strong>Price Impact:</strong> {rec.priceImpact.toFixed(4)}%</p>
                            <p><strong>Score:</strong> {rec.score.toFixed(2)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Statistics</CardTitle>
                <CardDescription>
                  Comprehensive statistical analysis of test results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Test Results Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Total Tests:</strong> {data.statistics.totalTests}</p>
                        <p><strong>Successful Tests:</strong> {data.statistics.successfulTests}</p>
                        <p><strong>Success Rate:</strong> {((data.statistics.successfulTests / data.statistics.totalTests) * 100).toFixed(1)}%</p>
                        <p><strong>Average Score:</strong> {data.statistics.averageScore.toFixed(2)}</p>
                        <p><strong>Median Score:</strong> {data.statistics.medianScore.toFixed(2)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Best Score:</strong> {data.statistics.bestScore.toFixed(2)}</p>
                        <p><strong>Worst Score:</strong> {data.statistics.worstScore.toFixed(2)}</p>
                        <p><strong>Average Price Impact:</strong> {data.statistics.averagePriceImpact.toFixed(4)}%</p>
                        <p><strong>Average Max Profit:</strong> {data.statistics.averageMaxProfit.toFixed(4)}%</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PoolConfigurationDashboard;