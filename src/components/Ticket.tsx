import React, { useState } from 'react';
import { Gift, Download, ArrowLeft } from 'lucide-react';

interface TicketProps {
  downloadGift: () => void;
  stage: number;
  onReturn: () => void;
}

const Ticket: React.FC<TicketProps> = ({ downloadGift, stage, onReturn }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
    
    try {
      await downloadGift();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReturn = () => {
    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    onReturn();
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      <button 
        onClick={handleReturn}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 bg-white/20 text-white font-bold py-2 px-3 sm:px-4 rounded-full shadow-lg hover:bg-white/30 transform transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-white/30 text-sm sm:text-base"
        tabIndex={0}
        aria-label="Return to birthday card"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        Back to Card
      </button>

      <div className="text-center mb-8 absolute top-16 sm:top-20 animate-fade-in px-4">
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">Your Golden Ticket!</h2>
        <p className="text-white/80 mt-2 text-sm sm:text-base">
          This grants you one unforgettable birthday experience.
        </p>
      </div>

      <div className="relative w-80 sm:w-[22rem] md:w-[24rem] h-[36rem] sm:h-[40rem] md:h-[44rem] bg-gradient-to-br from-yellow-300 to-amber-500 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 flex flex-col items-center justify-between animate-[ticket-appear_1.5s_ease-out] mx-4">
        {/* Top part with cutout */}
        <div className="absolute top-1/2 -left-6 sm:-left-8 w-12 sm:w-16 h-12 sm:h-16 bg-pink-400 rounded-full transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 -right-6 sm:-right-8 w-12 sm:w-16 h-12 sm:h-16 bg-pink-400 rounded-full transform -translate-y-1/2"></div>
        
        <div className="text-center z-10">
          <h3 className="text-amber-800 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-widest">BIRTHDAY PASS</h3>
          <p className="text-amber-600 font-semibold text-sm sm:text-base">ADMIT ONE</p>
        </div>

        <div className="border-4 border-dashed border-amber-600/50 w-full my-8 z-10"></div>

        <div className="text-center z-10">
          <Gift className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 text-amber-800 mx-auto animate-pulse" />
          <p className="mt-4 text-base sm:text-lg text-amber-900 font-bold">This ticket is your key to a special surprise. Click below to unwrap it!</p>
        </div>

        <div className="border-4 border-dashed border-amber-600/50 w-full my-8 z-10"></div>

        <div className="text-center z-10">
          <p className="text-amber-800 font-semibold text-sm sm:text-base">VALID FOR:</p>
          <p className="text-amber-700 text-sm sm:text-base">One incredible celebration</p>
          <p className="text-amber-800 font-semibold mt-4 text-sm sm:text-base">DATE:</p>
          <p className="text-amber-700 text-sm sm:text-base">Today & Forever</p>
        </div>

        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="mt-8 bg-gradient-to-br from-pink-500 to-orange-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:scale-105 transform transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          tabIndex={0}
          aria-label="Download birthday surprise"
        >
          {isDownloading ? (
            <>
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Preparing...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 sm:w-6 sm:h-6" />
              Claim Your Surprise
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Ticket;