const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db_connection');

const Student = sequelize.define('students', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Student
