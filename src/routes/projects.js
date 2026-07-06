const express = require('express');
const { Project } = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
  const projects = await Project.findAll();
  res.json(projects);
});

router.post('/', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  await project.update(req.body);
  res.json(project);
});

module.exports = router;
