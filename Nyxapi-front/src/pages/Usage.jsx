import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'; 
import 'react-circular-progressbar/dist/styles.css'; 
import nyx from '../assets/nyxLogo.webp'; 

const Usage = () => {
  const [usageData, setUsageData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  const maxProjects = 10; 
  const maxEndpoints = 50; 

  useEffect(() => {
    const dummyUserData = {
      user_id: 123,
      name: 'John Doe',
      projects: 5,       
      endpoints: 20,     
    };

    setUserId(dummyUserData.user_id);
    setUserName(dummyUserData.name);
    
    setUsageData({
      projects: dummyUserData.projects,
      endpoints: dummyUserData.endpoints,
    });

    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-white">Loading usage data...</div>;
  }

  const projectPercentage = (usageData.projects / maxProjects) * 100;
  const endpointPercentage = (usageData.endpoints / maxEndpoints) * 100;

  return (
    <div className="usage-page container mx-auto py-8" style={{ backgroundColor: '#101826', height: '100vh' }}>
      <h1 className="text-2xl font-bold mb-4 text-white">Usage Overview</h1>

      <div className="usage-info bg-gray-800 p-4 rounded-lg shadow-lg mb-6 text-white max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-4">Hello, {userName}</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <CircularProgressbar
              value={projectPercentage}
              text={`${usageData.projects}/${maxProjects}`}
              styles={buildStyles({
                pathColor: '#3182CE',
                textColor: '#E2E8F0',
                trailColor: '#4A5568',
                backgroundColor: '#101826',
              })}
            />
            <p className="text-sm font-semibold mt-2">Projects</p>
          </div>

          <div className="flex flex-col items-center">
            <CircularProgressbar
              value={endpointPercentage}
              text={`${usageData.endpoints}/${maxEndpoints}`}
              styles={buildStyles({
                pathColor: '#48BB78',
                textColor: '#E2E8F0',
                trailColor: '#4A5568',
                backgroundColor: '#101826',
              })}
            />
            <p className="text-sm font-semibold mt-2">Endpoints</p>
          </div>

          

        </div>
      </div>
      <div className="flex items-center justify-center">
  <button className="px-4 py-2 text-sm text-white font-semibold bg-pink-600 rounded hover:bg-pink-700">
    Upgrade 🚀
  </button>
</div>
    </div>
  );
};

export default Usage;
