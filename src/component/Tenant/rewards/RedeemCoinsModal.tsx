import React, { useState } from 'react';
import { useDarkMode } from '../../../context/DarkModeContext';
import { useToast } from '../../../context/ToastContext';

interface RedeemCoinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCoins: number;
  onRedeemSuccess: (newBalance: number) => void;
}

const rewards = [
  { id: 'rent_100', title: 'NPR 100 Rent Credit', coins: 100, icon: '💵' },
  { id: 'rent_500', title: 'NPR 500 Rent Credit', coins: 450, icon: '💰', popular: true },
  { id: 'rent_1000', title: 'NPR 1000 Rent Credit', coins: 850, icon: '💎' },
];

const RedeemCoinsModal: React.FC<RedeemCoinsModalProps> = ({ isOpen, onClose, currentCoins, onRedeemSuccess }) => {
  const { isDarkMode } = useDarkMode();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRedeem = async (rewardId: string, coinAmount: number, title: string) => {
    if (currentCoins < coinAmount) {
      showToast("Insufficient coins for this reward!", "error");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tokens/redeem', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: coinAmount, rewardType: title }),
      });

      const result = await response.json();
      if (response.ok) {
        showToast(`Successfully redeemed! ${title} will be applied to your account.`, 'success');
        onRedeemSuccess(result.newBalance);
        onClose();
      } else {
        showToast(result.message || "Redemption failed", 'error');
      }
    } catch (error) {
      console.error("Redemption error:", error);
      showToast("Network error. Please try again.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className={`relative w-full max-w-lg overflow-hidden rounded-[2.5rem] shadow-2xl transition-all ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
        
        {/* Header with Gold Gradient */}
        <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600 px-8 py-10 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <svg className="w-8 h-8 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.39 2.1-1.39 1.47 0 2.01.59 2.1 1.58h1.19c-.11-1.49-1.11-2.44-2.59-2.74V5h-1.41v1.91c-1.28.28-2.31 1.09-2.31 2.52 0 1.71 1.41 2.56 3.44 3.03 2.04.47 2.48 1.1 2.48 1.93 0 .7-.51 1.46-2.19 1.46-1.54 0-2.21-.7-2.3-1.67H9.03c.1 1.76 1.19 2.56 2.66 2.87V19h1.41v-1.9c1.47-.23 2.62-1.08 2.62-2.6 0-1.9-1.51-2.54-3.64-3.03z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter">Exchange Rewards</h2>
              <p className="text-yellow-100 text-sm font-medium opacity-90 tracking-wide uppercase">Turn your loyalty into savings</p>
            </div>
          </div>
        </div>

        {/* Balance Bar */}
        <div className={`px-8 py-4 flex items-center justify-between border-b ${isDarkMode ? 'bg-gray-800/50 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
          <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>YOUR BALANCE</span>
          <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-1.5 rounded-full border border-yellow-500/20">
            <span className="text-yellow-500 font-black tracking-tight">{currentCoins} Coins</span>
          </div>
        </div>

        {/* Rewards List */}
        <div className="p-8 space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
          {rewards.map((reward) => (
            <div 
              key={reward.id}
              className={`group relative flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 hover:scale-[1.02] ${
                currentCoins >= reward.coins 
                  ? isDarkMode ? 'bg-gray-800/40 border-gray-700 hover:bg-gray-800 hover:border-yellow-500/50' : 'bg-white border-gray-100 hover:border-yellow-400 hover:shadow-xl'
                  : 'opacity-50 grayscale cursor-not-allowed border-dashed'
              }`}
            >
              {reward.popular && (
                <span className="absolute -top-3 left-6 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">MOST POPULAR</span>
              )}
              
              <div className="flex items-center gap-5">
                <div className={`text-4xl p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50 group-hover:bg-yellow-50'}`}>
                  {reward.icon}
                </div>
                <div>
                  <h4 className={`font-black text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{reward.title}</h4>
                  <p className={`text-sm font-bold ${isDarkMode ? 'text-yellow-500/80' : 'text-yellow-600'}`}>{reward.coins} Coins</p>
                </div>
              </div>

              <button 
                disabled={loading || currentCoins < reward.coins}
                onClick={() => handleRedeem(reward.id, reward.coins, reward.title)}
                className={`px-6 py-3 rounded-2xl text-xs font-black transition-all ${
                  currentCoins >= reward.coins 
                    ? 'bg-gray-900 text-white hover:bg-black hover:shadow-lg active:scale-95' 
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {loading ? '...' : 'EXCHANGE'}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`p-8 border-t text-center ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
          <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Rewards will be applied to your next monthly rent automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RedeemCoinsModal;
