const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');

// --- Carbon Calculation Engine ---
// Note: These are simplified, average emission factors.
// For a real-world app, these could come from a dedicated API or a more detailed database.
const EMISSION_FACTORS = {
  transport: {
    car: 0.21,   // kg CO2e per km
    bus: 0.08,   // kg CO2e per km
    train: 0.04, // kg CO2e per km
    flight: 0.25 // kg CO2e per km (short-haul)
  },
  electricity: {
    grid: 0.45 // kg CO2e per kWh (average, varies greatly by region)
  },
  food: {
    red_meat: 2.5,  // kg CO2e per serving
    poultry: 0.7,   // kg CO2e per serving
    vegetarian: 0.3, // kg CO2e per serving
    vegan: 0.2      // kg CO2e per serving
  }
};

function calculateCarbonFootprint(activityType, data) {
  let footprint = 0;
  try {
    switch (activityType) {
      case 'transport':
        const { mode, distance } = data;
        footprint = distance * EMISSION_FACTORS.transport[mode];
        break;
      case 'electricity':
        const { usage } = data; // in kWh
        footprint = usage * EMISSION_FACTORS.electricity.grid;
        break;
      case 'food':
        const { type, servings } = data;
        footprint = servings * EMISSION_FACTORS.food[type];
        break;
      default:
        footprint = 0;
    }
  } catch (error) {
    console.error("Calculation Error:", error);
    return 0;
  }
  // Return rounded to 2 decimal places
  return Math.round(footprint * 100) / 100;
}
// --- End of Calculation Engine ---


// @route   POST api/activities
// @desc    Log a new activity
// @access  Private
router.post('/', auth, (req, res) => {
  const { activityType, data } = req.body;

  if (!activityType || !data) {
    return res.status(400).json({ msg: 'Please provide activity type and data' });
  }

  const carbonFootprint = calculateCarbonFootprint(activityType, data);

  const newActivity = new Activity({
    user: req.user.id,
    activityType,
    data,
    carbonFootprint
  });

  newActivity.save()
    .then(activity => res.json(activity))
    .catch(err => res.status(500).json({ msg: 'Server error while saving activity' }));
});

// @route   GET api/activities
// @desc    Get all activities for the logged-in user
// @access  Private
router.get('/', auth, (req, res) => {
  Activity.find({ user: req.user.id })
    .sort({ date: -1 })
    .then(activities => res.json(activities))
    .catch(err => res.status(500).json({ msg: 'Server error' }));
});

module.exports = router;