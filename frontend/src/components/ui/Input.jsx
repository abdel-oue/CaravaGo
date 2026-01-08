import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({
  label,
  className = '',
  containerClassName = '',
  labelClassName = '',
  required = false,
  ...props
}, ref) => {
  const baseInputClasses = `
    appearance-none relative block w-full px-5 py-3
    border-2 border-gray-200 placeholder-gray-400
    text-sm rounded-xl
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
    transition-all duration-300 ease-in-out
    hover:border-main/30 hover:shadow-sm
    disabled:opacity-50 disabled:cursor-not-allowed
    bg-white/80 backdrop-blur-sm
  `;

  const labelClasses = `block text-xs font-medium text-black mb-1 ${labelClassName}`;

  return (
    <motion.div
      className={`relative ${containerClassName}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label htmlFor={props.id} className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        ref={ref}
        className={`${baseInputClasses} ${className}`}
        {...props}
      />
    </motion.div>
  );
});

Input.displayName = 'Input';

export default Input;
