import React from 'react';
import { Link } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950/20 via-transparent to-dark-950"></div>
      
      <div className="relative max-w-md mx-auto text-center p-8">
        {/* Lottie Animation */}
        <div className="mb-8">
          <Player
            autoplay
            loop
            src="https://lottie.host/3878ce59-6474-4be4-b0f8-beab21b630ff/aZnl9zDZxo.json"
            style={{ height: '250px', width: '250px' }}
            className="mx-auto"
          />
        </div>

        {/* Error Content */}
        <div className="card text-center">
          <h1 className="heading-1 text-6xl mb-4 text-primary-400">404</h1>
          <h2 className="heading-3 mb-4">Page Not Found</h2>
          <p className="text-body mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary flex items-center gap-2">
              <Home size={18} />
              Back to Home
            </Link>
            
            <button 
              onClick={() => window.history.back()} 
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-dark-700">
            <p className="text-muted">
              Need help? <Link to="/" className="text-primary-400 hover:text-primary-300">Contact support</Link> or 
              visit our <Link to="/" className="text-primary-400 hover:text-primary-300">documentation</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
