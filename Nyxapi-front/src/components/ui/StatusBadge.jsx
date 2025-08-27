import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

const StatusBadge = ({ status, children, className = "" }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          className: 'status-success'
        };
      case 'warning':
        return {
          icon: AlertCircle,
          className: 'status-warning'
        };
      case 'error':
        return {
          icon: XCircle,
          className: 'status-error'
        };
      case 'pending':
        return {
          icon: Clock,
          className: 'bg-dark-600/10 text-dark-400 border border-dark-600/20'
        };
      default:
        return {
          icon: null,
          className: 'bg-dark-800 text-dark-300 border border-dark-700'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.className} ${className}`}>
      {Icon && <Icon size={14} />}
      {children}
    </span>
  );
};

export default StatusBadge;