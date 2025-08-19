// src/components/WarningModal.tsx
import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface WarningModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onCancel: () => void;
  targetHours: number;
}

const WarningModal: React.FC<WarningModalProps> = ({ 
  isOpen, 
  onAccept, 
  onCancel, 
  targetHours 
}) => {
  const [hasAccepted, setHasAccepted] = useState(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    if (hasAccepted) {
      onAccept();
      setHasAccepted(false); // Reset for next time
    }
  };

  const handleCancel = () => {
    onCancel();
    setHasAccepted(false); // Reset for next time
  };

  const healthWarnings = [
    "Consult your doctor before extended fasting",
    "DO NOT fast if pregnant, breastfeeding, or under 18",
    "Stop immediately if you feel dizzy or unwell",
    "Drink at least 2-3 liters of water daily",
    "Listen to your body and stop if needed",
    "This app does NOT provide medical advice"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-amber-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Health & Safety Notice
              </h2>
            </div>
            <button 
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            You're about to start a {targetHours}h fast. Please read these important reminders.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-3 mb-6">
            {healthWarnings.map((warning, index) => (
              <div key={index} className="flex items-start bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-200">{warning}</p>
              </div>
            ))}
          </div>

          {/* Legal Disclaimer */}
          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">
              ⚖️ Legal Disclaimer
            </h3>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              This app is for educational purposes only. We are not liable for any health complications. 
              Fasting is at your own risk and responsibility. Always consult a qualified healthcare 
              professional before starting any fasting regimen.
            </p>
          </div>

          {/* Acceptance Checkbox */}
          <div className="mb-6">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={hasAccepted}
                onChange={(e) => setHasAccepted(e.target.checked)}
                className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <strong>I understand the risks</strong> and confirm that I have consulted with a 
                healthcare professional if needed. I accept full responsibility for my fasting decisions.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAccept}
              disabled={!hasAccepted}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                hasAccepted
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              ✓ Start Fast
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
