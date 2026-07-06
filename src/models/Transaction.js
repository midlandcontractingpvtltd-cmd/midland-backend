module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    // Fields are defined in the main index for brevity; this file is a placeholder.
    // Sequelize will still work.
  });
  return Transaction;
};
