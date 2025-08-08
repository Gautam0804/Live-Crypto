import { useEffect, useState } from 'react';

import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const EthereumChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const res = await axios.get(
        'https://api.coingecko.com/api/v3/coins/ethereum/market_chart',
        {
          params: {
            vs_currency: 'usd',
            days: 0.25,
            interval: 'minutely',
          },
        }
      );
      const prices = res.data.prices.map(([timestamp, price]: [number, number]) => ({
        time: new Date(timestamp).toLocaleTimeString(),
        price: price.toFixed(2),
      }));
      setData(prices);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch Ethereum data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading Ethereum chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full h-[300px]">
      <h2 className="text-lg font-bold mb-2">📈 Ethereum (ETH) Price Trend</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#627EEA" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EthereumChart;
