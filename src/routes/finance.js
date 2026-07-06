const express = require('express');
const { Transaction, Project } = require('../models');
const router = express.Router();

router.get('/transactions', async (req, res) => {
  const transactions = await Transaction.findAll({ include: Project });
  res.json(transactions);
});

router.post('/transactions', async (req, res) => {
  const transaction = await Transaction.create(req.body);
  res.status(201).json(transaction);
});

router.get('/summary', async (req, res) => {
  const income = await Transaction.sum('amount', { where: { type: 'income' } });
  const expense = await Transaction.sum('amount', { where: { type: 'expense' } });
  res.json({ total_income: income || 0, total_expense: expense || 0, profit: (income||0) - (expense||0) });
});

module.exports = router;
