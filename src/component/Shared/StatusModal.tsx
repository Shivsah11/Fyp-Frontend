import React from 'react';
import { useDarkMode } from '../../context/DarkModeContext';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  buttonText?: string;
}

const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'success',
  buttonText = 'Continue'
}) => {
  const { isDarkMode } = useDarkMode();

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          icon: (
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
          bg: isDarkMode ? 'bg-red-500/10' : 'bg-red-50',
          button: 'bg-red-600 hover:bg-red-700 shadow-red-500/25',
          border: isDarkMode ? 'border-red-500/20' : 'border-red-100',
          gradient: 'from-red-500 to-rose-600'
        };
      case 'info':
        return {
          icon: (
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          bg: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50',
          button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25',
          border: isDarkMode ? 'border-blue-500/20' : 'border-blue-100',
          gradient: 'from-blue-500 to-indigo-600'
        };
      default: // success
        return {
          icon: (
            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ),
          bg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50',
          button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25',
          border: isDarkMode ? 'border-emerald-500/20' : 'border-emerald-100',
          gradient: 'from-emerald-500 to-teal-600'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative w-full max-w-sm rounded-[3rem] border p-1 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ${
        isDarkMode ? 'bg-gray-900 border-gray-700/50' : 'bg-white border-gray-100'
      }`}>
        <div className={`rounded-[2.9rem] p-8 ${isDarkMode ? 'bg-[#0f172a]/95' : 'bg-white'}`}>
          <div className="flex flex-col items-center text-center">
            {/* Animated Icon Container */}
            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6 border-2 transform rotate-12 transition-transform hover:rotate-0 duration-500 ${styles.bg} ${styles.border}`}>
              <div className="transform -rotate-12 transition-transform duration-500">
                {styles.icon}
              </div>
            </div>

            <h3 className={`text-3xl font-black tracking-tight mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h3>
            
            <p className={`text-sm font-medium leading-relaxed mb-8 px-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {message}
            </p>

            <button
              onClick={onClose}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-white transition-all duration-300 shadow-xl transform hover:-translate-y-1 active:scale-95 bg-gradient-to-r ${styles.gradient}`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
