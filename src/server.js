require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const locationRoutes = require('./routes/location');
const projectRoutes = require('./routes/projects');
const boqRoutes = require('./routes/boq');
const salaryRoutes = require('./routes/salary');
const financeRoutes = require('./routes/finance');
const chatRoutes = require('./routes/chat');
const { protect } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/attendance', protect, attendanceRoutes);
app.use('/api/location', protect, locationRoutes);
app.use('/api/projects', protect, projectRoutes);
app.use('/api/boq', protect, boqRoutes);
app.use('/api/salary', protect, salaryRoutes);
app.use('/api/finance', protect, financeRoutes);
app.use('/api/chat', protect, chatRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Midland Construction API', version: '1.0' });
});

io.on('connection', (socket) => {
  console.log('🟢 Chat client connected');
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    socket.join('global');
  });
  socket.on('send_message', async (data) => {
    try {
      const { ChatMessage } = require('./models');
      const newMsg = await ChatMessage.create({
        sender_id: data.sender_id,
        receiver_id: data.receiver_id || null,
        message: data.message,
        group_id: data.group_id || 'global',
        timestamp: new Date()
      });
      const fullMsg = await ChatMessage.findByPk(newMsg.id, { include: ['sender'] });
      io.to('global').emit('new_message', fullMsg);
      if (data.receiver_id) {
        io.to(`user_${data.receiver_id}`).emit('new_message', fullMsg);
      }
    } catch (e) { console.error(e); }
  });
});

const PORT = process.env.PORT || 5000;
// 🟢 ഇതാണ് പ്രധാന മാറ്റം – 0.0.0.0 ചേർത്തിരിക്കുന്നു
server.listen(PORT, '0.0.0.0', async () => {
  await sequelize.sync({ alter: true });
  console.log(`✅ Server running on port ${PORT} (accessible from network)`);
});
