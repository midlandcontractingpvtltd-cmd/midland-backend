module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // Fields are defined in the main index for brevity; this file is a placeholder.
    // Sequelize will still work.
  });
  return User;
};
// backend/src/models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // ... existing fields
    expo_push_token: { type: DataTypes.STRING, allowNull: true },
  });
  return User;
};