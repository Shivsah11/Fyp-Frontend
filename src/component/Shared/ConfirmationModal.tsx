import React from 'react';
import { useDarkMode } from '../../context/DarkModeContext';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info'
}) => {
  const { isDarkMode } = useDarkMode();

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: (
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          bg: isDarkMode ? 'bg-red-500/10' : 'bg-red-50',
          button: 'bg-red-600 hover:bg-red-700 shadow-red-500/25',
          border: isDarkMode ? 'border-red-500/20' : 'border-red-100'
        };
      case 'warning':
        return {
          icon: (
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          bg: isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-50',
          button: 'bg-yellow-600 hover:bg-yellow-700 shadow-yellow-500/25',
          border: isDarkMode ? 'border-yellow-500/20' : 'border-yellow-100'
        };
      case 'success':
        return {
          icon: (
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ),
          bg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50',
          button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25',
          border: isDarkMode ? 'border-emerald-500/20' : 'border-emerald-100'
        };
      default:
        return {
          icon: (
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          bg: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50',
          button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25',
          border: isDarkMode ? 'border-blue-500/20' : 'border-blue-100'
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
      <div className={`relative w-full max-w-md rounded-[2.5rem] border p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ${
        isDarkMode ? 'bg-[#0f172a]/95 border-gray-700/50' : 'bg-white border-gray-100'
      }`}>
        <div className="flex flex-col items-center text-center">
          {/* Icon Circle */}
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 border ${styles.bg} ${styles.border}`}>
            {styles.icon}
          </div>

          <h3 className={`text-2xl font-black tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
          
          <p className={`text-sm font-medium leading-relaxed mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {message}
          </p>

          <div className="flex w-full gap-4">
            <button
              onClick={onClose}
              className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all duration-300 border ${
                isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' 
                : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-4 rounded-2xl font-bold text-sm text-white transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 active:scale-95 ${styles.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
