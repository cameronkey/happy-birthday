import React from 'react';
import { Gift, Download, ArrowLeft } from 'lucide-react';

type TicketProps = {
  downloadGift: () => void;
  stage: string;
  onReturn: () => void;
};

const Ticket: React.FC<TicketProps> = ({ downloadGift, stage, onReturn }) => {
  return (
    <div className="flex items-center justify-center min-h-screen relative">
      <button 
        onClick={onReturn}
        className="absolute top-8 left-8 bg-white/20 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-white/30 transform transition-all duration-300 flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Card
      </button>

      <div className="text-center mb-8 absolute top-20 animate-fade-in">
        <h2 className="text-white text-3xl font-bold">Your Golden Ticket!</h2>
        <p className="text-white/80 mt-2">
          This grants you one unforgettable birthday experience.
        </p>
      </div>

      <div className="relative w-[22rem] h-[44rem] bg-gradient-to-br from-yellow-300 to-amber-500 rounded-2xl shadow-2xl overflow-hidden p-8 flex flex-col items-center justify-between animate-[ticket-appear_1.5s_ease-out]">
        {/* Top part with cutout */}
        <div className="absolute top-1/2 -left-8 w-16 h-16 bg-pink-400 rounded-full transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 -right-8 w-16 h-16 bg-pink-400 rounded-full transform -translate-y-1/2"></div>
        
        <div className="text-center z-10">
          <h3 className="text-amber-800 text-4xl font-extrabold tracking-widest">BIRTHDAY PASS</h3>
          <p className="text-amber-600 font-semibold">ADMIT ONE</p>
        </div>

        <div className="border-4 border-dashed border-amber-600/50 w-full my-8 z-10"></div>

        <div className="text-center z-10">
          <Gift className="w-24 h-24 text-amber-800 mx-auto animate-pulse" />
          <p className="mt-4 text-lg text-amber-900 font-bold">This ticket is your key to a special surprise. Click below to unwrap it!</p>
        </div>

        <div className="border-4 border-dashed border-amber-600/50 w-full my-8 z-10"></div>

        <div className="text-center z-10">
          <p className="text-amber-800 font-semibold">VALID FOR:</p>
          <p className="text-amber-700">One incredible celebration</p>
          <p className="text-amber-800 font-semibold mt-4">DATE:</p>
          <p className="text-amber-700">Today & Forever</p>
        </div>

        <button 
          onClick={downloadGift}
          className="mt-8 bg-gradient-to-br from-pink-500 to-orange-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 transform transition-all duration-300 flex items-center gap-2"
        >
          <Download className="w-6 h-6" />
          Claim Your Surprise
        </button>
      </div>
    </div>
  );
};

export default Ticket; 