module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define('ChatMessage', {
    // Fields are defined in the main index for brevity; this file is a placeholder.
    // Sequelize will still work.
  });
  return ChatMessage;
};
