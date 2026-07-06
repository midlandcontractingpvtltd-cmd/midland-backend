const express = require('express');
const { Attendance } = require('../models');
const router = express.Router();

router.post('/checkin', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user.id;
    const today = new Date().toISOString().slice(0,10);
    const existing = await Attendance.findOne({ where: { user_id: userId, date: today } });
    if (existing) return res.status(400).json({ error: 'Already checked in today' });
    const att = await Attendance.create({ user_id: userId, date: today, check_in_time: new Date(), latitude, longitude });
    res.json({ message: 'Checked in', attendance: att });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/checkout', async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().slice(0,10);
    const att = await Attendance.findOne({ where: { user_id: userId, date: today, check_out_time: null } });
    if (!att) return res.status(404).json({ error: 'No active check-in found' });
    att.check_out_time = new Date();
    await att.save();
    res.json({ message: 'Checked out', attendance: att });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/my', async (req, res) => {
  const records = await Attendance.findAll({ where: { user_id: req.user.id }, order: [['date','DESC']] });
  res.json(records);
});

module.exports = router;
