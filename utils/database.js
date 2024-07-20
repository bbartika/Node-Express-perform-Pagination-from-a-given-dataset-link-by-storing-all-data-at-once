const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('pagination_example', 'root', 'uitIT$1822', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

module.exports = sequelize;
