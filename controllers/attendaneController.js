const Attendance = require('../models/attendances');
const Student = require('../models/students');
const { sendErrorResponse, sendSuccessResponse } = require('../utils/response');

const chechAttendance = async(req, res)=>{
    try{
        const { attendance_date } = req.body
        const attendances = await Attendance.findAll({
            where: {
                attendance_date: attendance_date
            },
            include: [
                {
                    model: Student,
                    attributes: ['id', 'name']
                }
            ]
        });

        if (attendances.length === 0) {
            return sendSuccessResponse(res,[],'Attendance not marked for this date',200);
        }
        sendSuccessResponse(res,attendances,'Attendance already marked for this date',200);
    }catch(err){
        return sendErrorResponse(res, err, 'Failed to check attendance', 500);
    }
}

const attendanceMark = async(req, res) => {
    try{
        const { attendance_date, attendance } = req.body;
        const records = attendance.map(item => ({
            attendance_date: attendance_date,
            studentId: item.studentId,
            status: item.status
        }));
        await Attendance.bulkCreate(records);
        sendSuccessResponse(res, [], 'Attendance marked successfully', 200);
    }catch(err){
        return sendErrorResponse(res, err, 'Failed to mark attendance', 500);
    }
}

const attendanceReport = async(req, res)=>{
    try{
        const attendances = await Attendance.findAll({
            include:[
                {
                    model: Student,
                    attributes: ['id', 'name']
                }
            ]
        });
        if(attendances.length == 0){
            return sendErrorResponse(res, [], 'Attendance not marked yet', 404);    
        }
        const report = {};
        attendances.forEach(attendance => {
            const studentId = attendance.studentId;

            if (!report[studentId]) {
                report[studentId] = {
                    studentId: studentId,
                    name: attendance.student.name,
                    present: 0,
                    total: 0
                };
            }

            report[studentId].total++;

            if (attendance.status === 'present') {
                report[studentId].present++;
            }
        });

        const attendanceReport = Object.values(report).map(student => {

            const percentage =(student.present / student.total) * 100;

            return {
                studentId: student.studentId,
                name: student.name,
                attendance: `${student.present}/${student.total}`,
                percentage: `${percentage.toFixed(2)}%`
            };

        });
        sendSuccessResponse(res, attendanceReport, 'Attendance report fetched successfully', 200);

    }catch(err){
        return sendErrorResponse(res, err.message, 'Failed to fetch attendance report', 500);
    }
}

module.exports = {
    chechAttendance,
    attendanceMark,
    attendanceReport
}