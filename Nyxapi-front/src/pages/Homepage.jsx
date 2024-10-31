import React from 'react';
import Navbar from '../components/navbar';
import "../app.css"

const HomePage = () => {
  return (
    <>
      
      <Navbar />
      <div className="bg-gray-100 dark:bg-gray-900 sm:py-24 lg:py-1 hh  flex justify-center items-center bb ">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="mt-10 text-center text-white ">
            <h3 className='text-lg text-gray-900'>Introducing</h3>
            <h1 className="text-4xl font-extrabold text-gray-900  sm:text-5xl lg:text-6xl tt">
              NyxAPI
            </h1>
            <p className="mt-4 text-1lg text-gray-900 ">
              Accelerating frontend development with powerful mock APIs.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="/get-started"
                className="px-6 py-2 border border-transparent text-base font-medium rounded-3xl text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:text-lg md:px-9">
                Get Started
              </a> 
            </div>
          </div>
        </div>
      </div> 

      <div className="py-16 bg-white dark:bg-gray-900 gh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center bb1 ">
            Why Choose NyxAPI?
          </h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
              <div className=' w-full items-center '>
                <div className='ttt1 hovv'></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">Mock API Generation</h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">
                Create mock APIs quickly with flexible responses to simulate real-world scenarios.
              </p>
            </div>
            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
              <div className='  w-full items-center '>
                <div className='ttt2 hovv'></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">Mock API Generation</h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">
                Create mock APIs quickly with flexible responses to simulate real-world scenarios.
              </p>
            </div>
            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
              <div className='w-full items-center '>
                <div className='ttt3 hovv'></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">Mock API Generation</h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">
                Create mock APIs quickly with flexible responses to simulate real-world scenarios.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 dark:bg-gray-900 py-6 text-center text-white">
        <p className="text-sm">©️ 2024 NyxAPI. All rights reserved.</p>
      </footer>
    </>
  );
};

export default HomePage;