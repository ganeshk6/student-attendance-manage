const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db_connection');

const Attendance = sequelize.define('attendances', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull:false
    },
    attendance_date:{
        type:DataTypes.DATEONLY,
        allowNull:false,
    },
    status:{
        type:DataTypes.ENUM('present', 'absent'),
        allowNull:false
    }
})

module.exports = Attendance
