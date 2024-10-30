import React from 'react';

const Subscription = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-white bg-[#0B0D1B]">
      <div className="max-w-2xl mb-8 text-center">
        <h1 className="mb-4 text-3xl font-semibold text-[#3B82F6]">Subscription Plans</h1>
        <p className="text-lg text-gray-400">
          Choose a subscription plan that best suits your needs. Our Free Tier provides all the essentials you need to get started,
          including unlimited endpoints for API access. Upgrade as your needs grow, with flexible and affordable options.
        </p>
      </div>

      <div className="w-full max-w-md p-6 bg-[#1F2937] border border-gray-700 rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-[#5C66EB]">Free Tier</h2>
        <p className="mb-4 text-gray-400">
          Our Free Tier is designed to give you access to unlimited endpoints, perfect for small projects or testing purposes.
          With no time limits, you can get started without any commitments.
        </p>
        <ul className="mb-4 space-y-2 text-gray-400">
          <li>✅ Unlimited Endpoints</li>
          <li>✅ Basic API Access</li>
          <li>✅ No Expiry</li>
        </ul>
        <button className="w-full px-4 py-2 mt-4 font-semibold text-white bg-gradient-to-r from-[#5C66EB] to-[#6C63FF] rounded-md hover:from-[#6C63FF] hover:to-[#7B63FF] shadow-lg">
          Get Started with Free Tier
        </button>
      </div>
    </div>
  );
};

export default Subscription;
