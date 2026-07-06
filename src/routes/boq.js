const express = require('express');
const { BOQItem } = require('../models');
const router = express.Router();

router.get('/project/:projectId', async (req, res) => {
  const items = await BOQItem.findAll({ where: { project_id: req.params.projectId } });
  res.json(items);
});

router.post('/', async (req, res) => {
  try {
    const item = await BOQItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const item = await BOQItem.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  await item.update(req.body);
  if (item.completed_quantity >= item.quantity) item.status = 'completed';
  else if (item.completed_quantity > 0) item.status = 'in_progress';
  else item.status = 'pending';
  await item.save();
  res.json(item);
});

module.exports = router;
