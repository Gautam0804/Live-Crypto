import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

type Props = {
  name: string;
  price: number;
  change: number;
  marketCap?: number;
  volume?: number;
  high24h?: number;
  low24h?: number;
  circulatingSupply?: number;
};

const CryptoCard: React.FC<Props> = ({
  name,
  price,
  change,
  marketCap,
  volume,
  high24h,
  low24h,
  circulatingSupply,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const isPositive = change >= 0;

  return (
    <div className="min-w-[250px] max-w-xs bg-gradient-to-br from-white/70 to-gray-100 dark:from-gray-800 dark:to-gray-900 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-wide mb-3">
        {name.toUpperCase()}
      </h2>

      <p className="text-3xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
        ${price.toLocaleString()}
      </p>

      <p
        className={`flex items-center justify-center gap-2 text-lg font-medium ${
          isPositive ? 'text-green-600' : 'text-red-500'
        }`}
      >
        {isPositive ? (
          <ArrowUpRight className="w-5 h-5 animate-bounce" />
        ) : (
          <ArrowDownRight className="w-5 h-5 animate-bounce" />
        )}
        {change.toFixed(2)}%
      </p>

      <button
        onClick={() => setShowDetails((prev) => !prev)}
        className="mt-5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md transition-all duration-200"
      >
        {showDetails ? 'Hide Details' : 'View Details'}
      </button>

      {showDetails && (
        <div className="mt-4 text-sm text-left text-gray-700 dark:text-gray-300 space-y-1">
          {marketCap !== undefined && (
            <p>💰 <strong>Market Cap:</strong> ${marketCap.toLocaleString()}</p>
          )}
          {volume !== undefined && (
            <p>📈 <strong>Volume:</strong> ${volume.toLocaleString()}</p>
          )}
          {high24h !== undefined && (
            <p>⬆️ <strong>24h High:</strong> ${high24h.toLocaleString()}</p>
          )}
          {low24h !== undefined && (
            <p>⬇️ <strong>24h Low:</strong> ${low24h.toLocaleString()}</p>
          )}
          {circulatingSupply !== undefined && (
            <p>🔄 <strong>Circulating Supply:</strong> {circulatingSupply.toLocaleString()}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CryptoCard;
