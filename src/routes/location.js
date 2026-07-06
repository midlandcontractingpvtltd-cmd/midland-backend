const express = require('express');
const { LocationTracking } = require('../models');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { latitude, longitude, accuracy } = req.body;
    await LocationTracking.create({ user_id: req.user.id, latitude, longitude, accuracy });
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/timeline/:userId', async (req, res) => {
  const { userId } = req.params;
  const locations = await LocationTracking.findAll({
    where: { user_id: userId },
    order: [['timestamp','ASC']]
  });
  res.json(locations);
});

module.exports = router;
