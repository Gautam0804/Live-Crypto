import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Define the shape of the chart data
interface ChartData {
  time: string;
  price: number;
}

const DogecoinChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/dogecoin/market_chart',
        {
          params: {
            vs_currency: 'usd',
            days: '0.25', // 6 hours = 0.25 days
            interval: 'minute',
          },
        }
      );

      const formattedData: ChartData[] = response.data.prices.map(
        (entry: [number, number]) => ({
          time: new Date(entry[0]).toLocaleTimeString(),
          price: parseFloat(entry[1].toFixed(4)),
        })
      );

      setData(formattedData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch Dogecoin data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 sec
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading Dogecoin chart...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full h-[300px] p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
        📉 Dogecoin (DOGE) Price Trend (Last 6 Hours)
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#F7931A"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DogecoinChart;
