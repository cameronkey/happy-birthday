import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Play } from 'lucide-react';

interface TutorialProps {
  onComplete: (skip?: boolean) => void;
  isModal?: boolean;
}

const Tutorial: React.FC<TutorialProps> = ({ onComplete, isModal = false }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Your Birthday Surprise! 🎉",
      content: "This is an interactive birthday experience designed just for you. Let's walk through how to enjoy every moment!",
      visual: "🎁",
      action: "Get Started"
    },
    {
      title: "Step 1: Open the Envelope 📮",
      content: "Look for the red wax seal on the envelope. Hover over it (or tap on mobile) to break the seal and open the envelope.",
      visual: "📮",
      action: "Next"
    },
    {
      title: "Step 2: Pull Out the Card 💌",
      content: "Once the envelope opens, you'll see a birthday card peeking out. Click and drag it downward to pull it out completely.",
      visual: "💌",
      action: "Next"
    },
    {
      title: "Step 3: Explore the Card 🎂",
      content: "Click on the birthday card to open it and read your special message. Look for the golden ticket inside!",
      visual: "🎂",
      action: "Next"
    },
    {
      title: "Step 4: Claim Your Surprise 🎫",
      content: "Click the golden ticket to reveal your special birthday surprise. You can download it to keep forever!",
      visual: "🎫",
      action: "Start Experience"
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete(false);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete(true);
  };

  const containerClasses = isModal 
    ? "fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    : "flex items-center justify-center min-h-screen";

  return (
    <div className={containerClasses}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in">
        {isModal && (
          <button
            onClick={() => onComplete(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close tutorial"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce">
            {currentStepData.visual}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {currentStepData.content}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'bg-purple-500 scale-125' 
                  : index < currentStep 
                    ? 'bg-green-400' 
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isFirstStep 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-purple-600 hover:bg-purple-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            Skip Tutorial
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:scale-105 transition-all shadow-lg"
          >
            {currentStepData.action}
            {isLastStep ? (
              <Play className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;