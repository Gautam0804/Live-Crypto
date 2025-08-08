import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CryptoCard from './components/CryptoCard';
import BitcoinChart from './components/BitcoinChart';

interface CryptoInfo {
  usd: number;
  usd_24h_change: number;
  marketCap: number;
  volume: number;
  high24h: number;
  low24h: number;
  circulatingSupply: number;
}

interface CryptoData {
  [key: string]: CryptoInfo;
}

const App: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData>({});
  const [loading, setLoading] = useState(true);

  const fetchCrypto = async () => {
    try {
      const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          ids: 'bitcoin,ethereum,dogecoin',
        },
      });

      const formatted: CryptoData = {};
      res.data.forEach((coin: any) => {
        formatted[coin.id] = {
          usd: coin.current_price,
          usd_24h_change: coin.price_change_percentage_24h,
          marketCap: coin.market_cap,
          volume: coin.total_volume,
          high24h: coin.high_24h,
          low24h: coin.low_24h,
          circulatingSupply: coin.circulating_supply,
        };
      });

      setCryptoData(formatted);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching crypto data:', err);
    }
  };

  useEffect(() => {
    fetchCrypto();
    const interval = setInterval(fetchCrypto, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-950 dark:to-gray-900 p-6 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12 py-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-md tracking-tight animate-pulse flex items-center justify-center gap-4 leading-[1.2]">
  🪙 <span>Live Crypto Price Dashboard</span>
</h1>


        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300 text-xl animate-pulse">
            Loading prices...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(cryptoData).map(([name, data]) => (
              <CryptoCard
                key={name}
                name={name}
                price={data.usd}
                change={data.usd_24h_change}
                marketCap={data.marketCap}
                volume={data.volume}
                high24h={data.high24h}
                low24h={data.low24h}
                circulatingSupply={data.circulatingSupply}
              />
            ))}
          </div>
        )}

        {/* Trend Charts */}
        <div className="mt-16 space-y-12">
          <div>
            <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800 dark:text-white">
              📈 Bitcoin Price Trend (Last 6 Hours)
            </h2>
            <BitcoinChart />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm border-t border-gray-300 dark:border-gray-700 pt-6">
        Developed by <span className="font-semibold text-gray-700 dark:text-white">GAUTAM YADAV</span>
      </footer>
    </div>
  );
};

export default App;
