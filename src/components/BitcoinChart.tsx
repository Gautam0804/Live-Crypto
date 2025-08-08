import { useEffect, useState } from 'react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import axios from 'axios';
import { Bitcoin, Clock, TrendingUp } from 'lucide-react';

interface PriceData {
  time: string;
  price: number;
}

const BitcoinChart = () => {
  const [data, setData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=0.25'
      );
      const prices = res.data.prices.map(([timestamp, price]: [number, number]) => {
        const time = new Date(timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        return {
          time,
          price: Number(price.toFixed(2)),
        };
      });
      setData(prices);
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError('Failed to load chart data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
    const interval = setInterval(fetchChartData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 border-solid"></div>
        <span className="ml-4 text-gray-600 font-medium">Loading Bitcoin trend chart...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 font-medium">{error}</div>;
  }

  const latestPrice = data[data.length - 1]?.price ?? 0;

  return (
    <div className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-2xl mt-6 transition-all duration-300 ease-in-out hover:shadow-blue-100 border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center space-x-3">
          <TrendingUp className="text-blue-600 dark:text-blue-400 w-5 h-5" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            Bitcoin Price Trend
          </h2>
        </div>
        <span className="text-xs sm:text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
          Last 6 Hours
        </span>
      </div>

      {/* Price Tag */}
      <div className="flex items-center justify-start mb-4">
        <Bitcoin className="w-5 h-5 text-yellow-500 mr-2" />
        <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
          Current Price: <span className="font-bold">${latestPrice.toFixed(2)}</span>
        </span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0071bd" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0071bd" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis
            dataKey="time"
            tick={{ fill: '#888', fontSize: 12 }}
            minTickGap={20}
          />
          <YAxis
            tick={{ fill: '#888', fontSize: 12 }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #eee',
              borderRadius: 10,
              fontSize: '14px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}
            formatter={(value: number) => `$${value.toFixed(2)}`}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#0071bd"
            strokeWidth={2}
            fill="url(#colorPrice)"
            fillOpacity={1}
            dot={false}
            isAnimationActive
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Footer */}
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
        <Clock className="w-4 h-4" />
        <span>Last updated at {lastUpdated}</span>
      </div>
    </div>
  );
};

export default BitcoinChart;
