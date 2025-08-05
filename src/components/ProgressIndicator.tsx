import React from 'react';

interface ProgressIndicatorProps {
  progress: number;
  stage: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress, stage }) => {
  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'envelope-drop':
      case 'envelope-hover':
        return 'Opening envelope...';
      case 'card-3d':
        return 'Exploring card...';
      case 'ticket-view':
        return 'Claiming surprise...';
      default:
        return 'Loading...';
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white">
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium min-w-0">
            {getStageLabel(stage)}
          </div>
          <div className="w-24 h-2 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs opacity-80 min-w-0">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;