const express = require('express');
const { SalaryConfig, SalaryCalculation, User, Attendance } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/config', async (req, res) => {
  const configs = await SalaryConfig.findAll();
  res.json(configs);
});

router.post('/config', async (req, res) => {
  const config = await SalaryConfig.create(req.body);
  res.status(201).json(config);
});

router.post('/calculate', async (req, res) => {
  const { month, year } = req.body;
  const workers = await User.findAll({ where: { role: 'worker' } });
  const results = [];
  for (const worker of workers) {
    const start = new Date(year, month-1, 1);
    const end = new Date(year, month, 0);
    const days = await Attendance.findAll({
      where: {
        user_id: worker.id,
        date: { [Op.between]: [start, end] },
        check_out_time: { [Op.ne]: null }
      }
    });
    const present = days.length;
    const config = await SalaryConfig.findOne({ where: { role: 'worker' } });
    const gross = present * config.daily_rate;
    const calc = await SalaryCalculation.create({
      user_id: worker.id,
      month, year,
      present_days: present,
      gross_salary: gross,
      net_salary: gross,
      status: 'draft'
    });
    results.push(calc);
  }
  res.json(results);
});

module.exports = router;
