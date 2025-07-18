import React, { useState } from 'react';
import axios from 'axios';

const ActivityForm = ({ onActivityAdded, setShowForm }) => {
  const [activityType, setActivityType] = useState('transport');
  const [data, setData] = useState({});
  const [error, setError] = useState('');

  const handleTypeChange = (e) => {
    setActivityType(e.target.value);
    setData({}); // Reset data when type changes
  };

  const handleDataChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(data).length === 0 || (data.mode === '' || data.type === '')) {
        setError("Please fill in all details for the activity.");
        return;
    }
    setError('');
    try {
      await axios.post('/api/activities', { activityType, data });
      onActivityAdded();
    } catch (err) {
      setError('Failed to log activity. Please try again.');
      console.error(err);
    }
  };

  const renderFormFields = () => {
    switch (activityType) {
      case 'transport':
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Mode</label>
              <select name="mode" onChange={handleDataChange} className="w-full p-2 border rounded" required defaultValue="">
                <option value="" disabled>Select Mode</option>
                <option value="car">Car</option>
                <option value="bus">Bus</option>
                <option value="train">Train</option>
                <option value="flight">Flight</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Distance (km)</label>
              <input type="number" name="distance" onChange={handleDataChange} className="w-full p-2 border rounded" required min="0" />
            </div>
          </>
        );
      case 'electricity':
        return (
          <div className="mb-4">
            <label className="block text-gray-700">Electricity Usage (kWh)</label>
            <input type="number" name="usage" onChange={handleDataChange} className="w-full p-2 border rounded" required min="0" />
          </div>
        );
      case 'food':
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Meal Type</label>
              <select name="type" onChange={handleDataChange} className="w-full p-2 border rounded" required defaultValue="">
                <option value="" disabled>Select Type</option>
                <option value="red_meat">Red Meat</option>
                <option value="poultry">Poultry</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Number of Servings</label>
              <input type="number" name="servings" defaultValue="1" onChange={handleDataChange} className="w-full p-2 border rounded" required min="1"/>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg relative">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4">Log New Activity</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Activity Type</label>
                    <select value={activityType} onChange={handleTypeChange} className="w-full p-2 border rounded">
                        <option value="transport">Transport</option>
                        <option value="electricity">Electricity</option>
                        <option value="food">Food</option>
                    </select>
                </div>
                {renderFormFields()}
                <div className="flex justify-end space-x-4">
                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Log Activity
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default ActivityForm;