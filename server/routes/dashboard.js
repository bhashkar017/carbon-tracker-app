const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');
const User = require('../models/User');

// --- Suggestions Engine ---
const SUGGESTIONS = {
    high_transport: "Your transport footprint is high. Consider carpooling, using public transport, or cycling for shorter trips.",
    high_electricity: "To reduce your electricity footprint, try using energy-efficient appliances, switching to LED bulbs, and unplugging devices when not in use.",
    high_food: "A significant portion of your footprint comes from food. Incorporating more plant-based meals can make a big difference.",
    general_good: "You're doing great! Keep up the good work. Look for new ways to be eco-friendly, like reducing waste or supporting sustainable brands.",
    default: "Log more activities to get personalized suggestions on how to reduce your carbon footprint."
};

function getSuggestions(summary) {
    let tips = new Set();
    if (summary.totalFootprint === 0) {
        tips.add(SUGGESTIONS.default);
        return Array.from(tips);
    }

    const transportPercentage = (summary.byCategory.transport || 0) / summary.totalFootprint;
    const electricityPercentage = (summary.byCategory.electricity || 0) / summary.totalFootprint;
    const foodPercentage = (summary.byCategory.food || 0) / summary.totalFootprint;

    if (transportPercentage > 0.4) tips.add(SUGGESTIONS.high_transport);
    if (electricityPercentage > 0.4) tips.add(SUGGESTIONS.high_electricity);
    if (foodPercentage > 0.4) tips.add(SUGGESTIONS.high_food);

    if (tips.size === 0) {
        tips.add(SUGGESTIONS.general_good);
    }
    
    return Array.from(tips);
}
// --- End of Suggestions Engine ---


// @route   GET api/dashboard
// @desc    Get aggregated dashboard data for the user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id });

    const summary = {
      totalFootprint: 0,
      activityCount: activities.length,
      byCategory: {
        transport: 0,
        electricity: 0,
        food: 0
      },
      trends: {} // Footprint per day for the last 7 days
    };

    const last7Days = {};
    for(let i=0; i<7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7Days[d.toISOString().split('T')[0]] = 0;
    }

    activities.forEach(activity => {
      summary.totalFootprint += activity.carbonFootprint;
      if (summary.byCategory[activity.activityType] !== undefined) {
        summary.byCategory[activity.activityType] += activity.carbonFootprint;
      }
      
      const activityDate = activity.date.toISOString().split('T')[0];
      if(last7Days[activityDate] !== undefined) {
          last7Days[activityDate] += activity.carbonFootprint;
      }
    });
    
    summary.trends = Object.keys(last7Days).map(date => ({ date, footprint: last7Days[date] })).reverse();
    summary.suggestions = getSuggestions(summary);
    
    // Simple Achievements
    summary.achievements = [];
    if(activities.length >= 1) summary.achievements.push({ title: "First Step", description: "Logged your first activity!" });
    if(activities.length >= 10) summary.achievements.push({ title: "Eco-Enthusiast", description: "Logged 10 activities." });
    if(summary.totalFootprint > 0 && summary.totalFootprint < 50) summary.achievements.push({ title: "Low Footprint", description: "Kept your total footprint under 50kg CO2e." });


    res.json(summary);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET api/dashboard/leaderboard
// @desc    Get leaderboard data
// @access  Public (or Private, depending on preference)
router.get('/leaderboard', auth, async (req, res) => {
    try {
        // This is a potentially heavy operation. For a large-scale app, this would be pre-calculated.
        const usersFootprints = await Activity.aggregate([
            {
                $group: {
                    _id: "$user",
                    totalFootprint: { $sum: "$carbonFootprint" }
                }
            },
            {
                $sort: { totalFootprint: 1 } // Ascending order
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $unwind: "$userData"
            },
            {
                $project: {
                    _id: 0,
                    username: "$userData.username",
                    totalFootprint: { $round: ["$totalFootprint", 2] }
                }
            }
        ]);

        res.json(usersFootprints);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;