const { Sequelize } = require('sequelize');


// kết nối docker
// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'mysql'
// });

// kết nối localhost
const sequelize = new Sequelize('tvu', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});


// Hàm kiểm tra kết nối
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Gọi hàm kiểm tra kết nối
testConnection();

module.exports = sequelize;
