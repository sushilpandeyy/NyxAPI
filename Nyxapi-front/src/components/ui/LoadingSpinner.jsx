import React from 'react';

const LoadingSpinner = ({ size = 'medium', className = '', children }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6', 
    large: 'w-8 h-8',
    xlarge: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`spinner ${sizeClasses[size]} text-primary-500 ${className}`} />
      {children && (
        <div className="mt-4 text-dark-300 text-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;