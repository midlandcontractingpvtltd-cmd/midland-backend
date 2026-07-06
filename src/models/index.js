const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  }
});
const pg = require('pg'); // add this at the top
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: pg,      // <-- add this line
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  }
});const { Sequelize, DataTypes } = require('sequelize');

// Use DATABASE_URL if defined (production), else SQLite (development)
let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    logging: false,
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false,
  });
}

const User = require('./User')(sequelize, DataTypes);
const Attendance = require('./Attendance')(sequelize, DataTypes);
const LocationTracking = require('./LocationTracking')(sequelize, DataTypes);
const Project = require('./Project')(sequelize, DataTypes);
const BOQItem = require('./BOQItem')(sequelize, DataTypes);
const SalaryConfig = require('./SalaryConfig')(sequelize, DataTypes);
const SalaryCalculation = require('./SalaryCalculation')(sequelize, DataTypes);
const Transaction = require('./Transaction')(sequelize, DataTypes);
const Site = require('./Site')(sequelize, DataTypes);
const ChatMessage = require('./ChatMessage')(sequelize, DataTypes);

User.hasMany(Attendance, { foreignKey: 'user_id' });
Attendance.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(LocationTracking, { foreignKey: 'user_id' });
LocationTracking.belongsTo(User, { foreignKey: 'user_id' });
Project.hasMany(BOQItem, { foreignKey: 'project_id' });
BOQItem.belongsTo(Project, { foreignKey: 'project_id' });
Project.hasMany(Transaction, { foreignKey: 'project_id' });
Transaction.belongsTo(Project, { foreignKey: 'project_id' });
Project.hasMany(Site, { foreignKey: 'project_id' });
Site.belongsTo(Project, { foreignKey: 'project_id' });
Site.hasMany(User, { foreignKey: 'site_id' });
User.belongsTo(Site, { foreignKey: 'site_id' });
User.hasMany(ChatMessage, { foreignKey: 'sender_id' });
ChatMessage.belongsTo(User, { foreignKey: 'sender_id' });
User.hasMany(ChatMessage, { foreignKey: 'receiver_id' });
ChatMessage.belongsTo(User, { foreignKey: 'receiver_id' });

module.exports = { sequelize, User, Attendance, LocationTracking, Project, BOQItem, SalaryConfig, SalaryCalculation, Transaction, Site, ChatMessage };
