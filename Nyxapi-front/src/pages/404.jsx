import React from 'react';
import { Link } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player'; // Import Lottie Player

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* Lottie Animation */}
      <Player
        autoplay
        loop
        src="https://lottie.host/3878ce59-6474-4be4-b0f8-beab21b630ff/aZnl9zDZxo.json"
        style={{ height: '300px', width: '300px' }}
      ></Player>

      {/* 404 Text */}
      <h1 className="mt-4 text-3xl font-bold">Page Not Found</h1>
      <p className="mt-2 text-gray-400">Oops! The page you are looking for does not exist.</p>

      {/* Back to Home Button */}
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-pink-600 text-white font-semibold rounded hover:bg-pink-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
