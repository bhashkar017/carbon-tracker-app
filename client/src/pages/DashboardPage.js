/* ================================================================
  File: client/src/pages/DashboardPage.js
  Description: Main dashboard page that fetches and displays all data.
  *** UPDATED with more robust error handling to prevent white screen crash ***
  ================================================================
*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActivityForm from '../components/ActivityForm';
import TrendsChart from '../components/TrendsChart';
import Leaderboard from '../components/Leaderboard';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('https://carbon-tracker-api-bhashkar.onrender.com/api/dashboard');
      setDashboardData(res.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError('Could not load dashboard data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onActivityAdded = () => {
    setShowForm(false);
    fetchData(); // Refresh data after adding a new activity
  };

  // Render loading state
  if (loading) {
    return <div className="text-center mt-10">Loading Dashboard...</div>;
  }

  // Render error state
  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }
  
  // This check is crucial. If data is still null after loading and no error was caught, 
  // it prevents the app from crashing.
  if (!dashboardData) {
    return <div className="text-center mt-10">No dashboard data available. Log an activity to get started!</div>;
  }

  // Render the dashboard if data is available
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button onClick={() => setShowForm(true)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">
          + Log Activity
        </button>
      </div>
      
      {showForm && <ActivityForm onActivityAdded={onActivityAdded} setShowForm={setShowForm} />}

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">Total Footprint</h3>
          <p className="text-4xl font-bold text-green-600">{dashboardData.totalFootprint.toFixed(2)}</p>
          <span className="text-sm text-gray-500">kg CO₂e</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">Activities Logged</h3>
          <p className="text-4xl font-bold text-blue-600">{dashboardData.activityCount}</p>
          <span className="text-sm text-gray-500">total</span>
        </div>
         <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">Achievements Unlocked</h3>
          <p className="text-4xl font-bold text-yellow-500">{dashboardData.achievements.length}</p>
          <span className="text-sm text-gray-500">badges</span>
        </div>
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Weekly Trend</h3>
          <TrendsChart data={dashboardData.trends} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
           <h3 className="text-xl font-semibold text-gray-800 mb-4">Footprint by Category</h3>
           {Object.keys(dashboardData.byCategory).length > 0 ? (
             <ul className="space-y-3">
               {Object.entries(dashboardData.byCategory).map(([key, value]) => (
                 <li key={key} className="flex justify-between items-center">
                   <span className="capitalize text-gray-700">{key}</span>
                   <span className="font-bold text-gray-800">{value.toFixed(2)} kg</span>
                 </li>
               ))}
             </ul>
           ) : <p>No data yet.</p>}
        </div>
      </div>
      
      {/* Suggestions & Leaderboard */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Improvement Tips</h3>
              <ul className="space-y-3 list-disc list-inside text-gray-700">
                  {dashboardData.suggestions.map((tip, index) => <li key={index}>{tip}</li>)}
              </ul>
          </div>
          <Leaderboard />
       </div>
    </div>
  );
};

export default DashboardPage;
