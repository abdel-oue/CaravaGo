import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const Notification = ({
  message,
  type = 'error',
  isVisible = false,
  onClose,
  autoHide = true,
  duration = 3000
}) => {
  useEffect(() => {
    if (isVisible && autoHide && onClose) {
      console.log(`🔔 Notification will auto-hide in ${duration}ms`);
      const timer = setTimeout(() => {
        console.log('🔔 Notification auto-hidden');
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-white" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-white" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-white" />;
      case 'info':
        return <Info className="h-5 w-5 text-white" />;
      default:
        return <AlertCircle className="h-5 w-5 text-white" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600';
      case 'info':
        return 'bg-blue-500 border-blue-600';
      default:
        return 'bg-red-500 border-red-600';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 left-0 w-full flex justify-center z-[9999]"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300
          }}
        >
          <div className={`
            flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl
            border backdrop-blur-md max-w-sm w-full mx-4
            ${getBgColor()}
          `}>
            {getIcon()}

            <div className="flex-1">
              <p className="text-xs font-medium text-white">
                {message}
              </p>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="flex-shrink-0 ml-1 p-0.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
