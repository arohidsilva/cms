const sequelize = require('../config/database');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
})();