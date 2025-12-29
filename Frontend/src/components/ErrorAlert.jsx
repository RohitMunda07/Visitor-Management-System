import React from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function ErrorAlert({ 
  message = 'Something went wrong!', 
  onClose,
  overlay = true,
  autoClose = false,
  duration = 5000 
}) {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div className={`fixed inset-0 z-50 flex justify-center items-center ${overlay ? 'bg-black/50' : 'bg-transparent'}`}>
      <div className='bg-white rounded-lg shadow-2xl max-w-md w-1/2 mx-4 overflow-hidden'>
        {/* Error Header */}
        <div className='bg-red-500 p-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <AlertCircle className='text-white' size={24} />
            <h3 className='text-white font-semibold text-lg'>Error</h3>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className='text-white hover:bg-red-600 rounded p-1 transition-colors'
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Error Message */}
        <div className='p-6'>
          <p className='text-gray-700 text-sm leading-relaxed'>
            {message}
          </p>
        </div>

        {/* Action Button */}
        {onClose && (
          <div className='px-6 pb-6'>
            <button
              onClick={onClose}
              className='w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors font-medium'
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}