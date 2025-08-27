import React from 'react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      {Icon && (
        <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mb-6">
          <Icon size={32} className="text-dark-400" />
        </div>
      )}
      
      {title && (
        <h3 className="heading-3 mb-4">{title}</h3>
      )}
      
      {description && (
        <p className="text-body mb-8 max-w-md mx-auto">
          {description}
        </p>
      )}
      
      {action}
    </div>
  );
};

export default EmptyState;