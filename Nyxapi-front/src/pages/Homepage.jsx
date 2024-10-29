import React from 'react';
import Navbar from '../components/navbar';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-100 dark:bg-gray-900 py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              Welcome to NyxAPI
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
              Accelerating frontend development with powerful mock APIs.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="/get-started"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </a>
              <a
                href="/login"
                className="ml-4 px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center">
            Why Choose NyxAPI?
          </h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mock API Generation</h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Create mock APIs quickly with flexible responses to simulate real-world scenarios.
              </p>
            </div>
            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Frontend-Backend Parallelism</h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Develop independently without backend delays, ensuring faster time-to-market.
              </p>
            </div>
            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Realistic Simulations</h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Simulate complex API responses, edge cases, and errors for robust frontend testing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 py-6 text-center text-white">
        <p className="text-sm">© 2024 NyxAPI. All rights reserved.</p>
      </footer>
    </>
  );
};

export default HomePage;
