const Student = require('./students');
const Attendance = require('./attendances');

Student.hasMany(Attendance);
Attendance.belongsTo(Student);

module.exports = {
    Student,
    Attendance
}