const Student = require('../models/students');
const { sendErrorResponse, sendSuccessResponse } = require('../utils/response');

const addNewStudent = async (req, res) => {
    try{
        const { name } = req.body;
        const student = await Student.create({
            name:name
        })
        sendSuccessResponse(res, student, "Student add successfully", 201);
    }catch(err){
        return sendErrorResponse(res, err, "Failed to add new students", 500);
    }
}

const getAllStudent = async(req, res) => {
    try{
        const students = await Student.findAll();
        if(students.length == 0){
            return sendErrorResponse(res, [], 'Stduent not found', 404);    
        }
        sendSuccessResponse(res, students, "Student fetch successfully", 201);
    }catch(err){
        return sendErrorResponse(res, err, 'Failed to fetch students', 500);
    }
}

module.exports = {
    addNewStudent,
    getAllStudent
}