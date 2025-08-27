import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Shield } from 'lucide-react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  confirmButtonText = "Delete",
  type = "danger", // danger, warning
  requiresTyping = false,
  requiredText = "DELETE",
  isLoading = false,
  itemName = ""
}) => {
  const [typedText, setTypedText] = useState('');
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(!requiresTyping);

  const handleTextChange = (e) => {
    const value = e.target.value;
    setTypedText(value);
    setIsConfirmEnabled(!requiresTyping || value.toUpperCase() === requiredText.toUpperCase());
  };

  const handleConfirm = () => {
    if (isConfirmEnabled && !isLoading) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setTypedText('');
      setIsConfirmEnabled(!requiresTyping);
      onClose();
    }
  };

  if (!isOpen) return null;

  const typeColors = {
    danger: {
      bg: 'bg-error-600',
      bgHover: 'hover:bg-error-700',
      text: 'text-error-400',
      border: 'border-error-600/20',
      iconBg: 'bg-error-600/20'
    },
    warning: {
      bg: 'bg-warning-600',
      bgHover: 'hover:bg-warning-700',
      text: 'text-warning-400',
      border: 'border-warning-600/20',
      iconBg: 'bg-warning-600/20'
    }
  };

  const colors = typeColors[type];

  return (
    <div className="modal-overlay">
      <div className="bg-dark-800 border border-dark-600 rounded-xl shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-600">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${colors.iconBg} rounded-lg`}>
              {type === 'danger' ? (
                <Trash2 className={`w-5 h-5 ${colors.text}`} />
              ) : (
                <AlertTriangle className={`w-5 h-5 ${colors.text}`} />
              )}
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          {!isLoading && (
            <button
              onClick={handleClose}
              className="p-1 text-dark-400 hover:text-white hover:bg-dark-700 rounded transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className={`p-4 ${colors.iconBg} border ${colors.border} rounded-lg mb-4`}>
            <div className="flex items-start gap-3">
              <Shield className={`w-5 h-5 ${colors.text} mt-0.5 flex-shrink-0`} />
              <div>
                <p className="text-white font-medium mb-1">Are you sure?</p>
                <p className="text-dark-300 text-sm leading-relaxed">{message}</p>
                {itemName && (
                  <div className="mt-2 p-2 bg-dark-900 rounded border border-dark-600">
                    <p className="text-xs text-dark-400 mb-1">Item to be deleted:</p>
                    <p className="font-mono text-sm text-primary-400">{itemName}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {requiresTyping && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Type <code className="bg-dark-700 px-1 rounded text-primary-400">{requiredText}</code> to confirm:
              </label>
              <input
                type="text"
                value={typedText}
                onChange={handleTextChange}
                placeholder={`Type "${requiredText}" here`}
                className={`form-input ${
                  typedText && !isConfirmEnabled 
                    ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20' 
                    : ''
                }`}
                disabled={isLoading}
                autoComplete="off"
              />
              {typedText && !isConfirmEnabled && (
                <p className="text-error-400 text-xs mt-1">
                  Text doesn't match. Please type "{requiredText}" exactly.
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isConfirmEnabled || isLoading}
              className={`
                flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed
                ${colors.bg} ${!isLoading && isConfirmEnabled ? colors.bgHover : ''} text-white
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  {confirmButtonText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;