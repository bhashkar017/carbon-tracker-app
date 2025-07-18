import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
               const res = await axios.get('https://carbon-tracker-api-bhashkar.onrender.com/api/dashboard/leaderboard');
                setLeaderboard(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Could not fetch leaderboard", err);
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return <div className="text-center">Loading Leaderboard...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Eco-Heroes</h3>
            {leaderboard.length > 0 ? (
                <ol className="space-y-3">
                    {leaderboard.map((user, index) => (
                        <li key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                            <div className="flex items-center">
                                <span className="font-bold text-lg text-gray-600 w-8">{index + 1}.</span>
                                <span className="text-gray-800">{user.username}</span>
                            </div>
                            <span className="font-bold text-green-600">{user.totalFootprint} kg</span>
                        </li>
                    ))}
                </ol>
            ) : (
                <p className="text-gray-500">No one is on the leaderboard yet. Be the first!</p>
            )}
        </div>
    );
};

export default Leaderboard;