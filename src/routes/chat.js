const express = require('express');
const { ChatMessage } = require('../models');
const router = express.Router();

router.get('/messages', async (req, res) => {
  const messages = await ChatMessage.findAll({
    order: [['timestamp', 'DESC']],
    limit: 50,
    include: ['sender'],
  });
  res.json(messages.reverse());
});

module.exports = router;
