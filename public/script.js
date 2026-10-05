const searchAttendance = document.getElementById('searchAttendance');
const fetchAttendanceReport = document.getElementById('fetchAttendanceReport');

searchAttendance.addEventListener('click', () => {

    const date = document.getElementById('attendance_date').value;

    if (!date) {
        alert('Please select a date');
        return;
    }

    axios.post('http://localhost:3000/attendance/check', {
        attendance_date: date
    })
    .then((res) => {

        const data = res.data.data;
        if (data.length === 0) {
            axios.get('http://localhost:3000/students/get')
                .then((studentRes) => {
                    const students = studentRes.data.data;
                    displayStudentsForAttendance(students);

                })
                .catch((err) => {
                    console.log('Student API Error:', err);
                });

        }
        else {

            displayMarkedAttendance(data);

        }

    })
    .catch((err) => {
        console.log('Check Attendance API Error:', err);
    });

});

const displayStudentsForAttendance = (students) => {

    const container = document.getElementById('attendanceContainer');

    let html = `
        <div class="bg-white rounded-lg shadow p-6">

            <h2 class="text-xl font-semibold text-gray-800 mb-5">
                Mark Attendance
            </h2>

            <table class="w-full border-collapse">

                <thead>
                    <tr class="bg-gray-100">
                        <th class="border p-3 text-left">Name</th>
                        <th class="border p-3 text-center">Attendance</th>
                    </tr>
                </thead>

                <tbody>
    `;

    students.forEach(student => {

        html += `
            <tr>

                <td class="border p-3">
                    ${student.name}
                </td>

                <td class="border p-3 text-center">

                    <label class="mr-5">
                        <input
                            type="radio"
                            name="attendance_${student.id}"
                            value="present"
                            data-student-id="${student.id}"
                        >
                        Present
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="attendance_${student.id}"
                            value="absent"
                            data-student-id="${student.id}"
                        >
                        Absent
                    </label>

                </td>
            </tr>
        `;
    });

    html += `
                </tbody>

            </table>

            <button
                id="markAttendance"
                onclick="markAttendance()"
                class="mt-5 bg-blue-600 hover:bg-blue-700
                       text-white font-medium px-5 py-2.5 rounded-lg"
            >
                Mark Attendance
            </button>

        </div>
    `;

    container.innerHTML = html;
};

const displayMarkedAttendance = (attendances) => {

    const container = document.getElementById('attendanceContainer');

    let html = `
        <div class="bg-white rounded-lg shadow p-6">

            <h2 class="text-xl font-semibold text-gray-800 mb-5">
                Attendance
            </h2>

            <table class="w-full border-collapse">

                <thead>
                    <tr class="bg-gray-100">
                        <th class="border p-3 text-left">Name</th>
                        <th class="border p-3 text-center">Status</th>
                    </tr>
                </thead>

                <tbody>
    `;

    attendances.forEach(attendance => {

        html += `
            <tr>

                <td class="border p-3">
                    ${attendance.student.name}
                </td>

                <td class="border p-3 text-center">
                    ${attendance.status}
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>

            </table>

        </div>
    `;

    container.innerHTML = html;
};

const markAttendance = () => {

    const attendance_date = document.getElementById('attendance_date').value;

    const attendance = [];

    const radioButtons = document.querySelectorAll(
        'input[type="radio"][data-student-id]:checked'
    );

    radioButtons.forEach((radio) => {

        attendance.push({
            studentId: Number(radio.dataset.studentId),
            status: radio.value
        });

    });

    const totalStudents = document.querySelectorAll(
        'input[type="radio"][data-student-id]'
    );

    const studentIds = new Set();

    totalStudents.forEach((radio) => {
        studentIds.add(radio.dataset.studentId);
    });

    if (attendance.length !== studentIds.size) {
        alert('Please mark attendance for all students');
        return;
    }

    const requestData = {
        attendance_date: attendance_date,
        attendance: attendance
    };

    axios.post('http://localhost:3000/attendance/mark',
        requestData
    )
    .then((res) => {

        alert('Attendance marked successfully');
        document.getElementById('attendance_date').value = '';
        document.getElementById('attendanceContainer').innerHTML = '';

    })
    .catch((err) => {

        console.log('Mark Attendance Error:', err);

        alert('Failed to mark attendance');

    });
};

fetchAttendanceReport.addEventListener('click', () => {

    axios.get('http://localhost:3000/attendance/report')
        .then((res) => {
            const attendanceReport = res.data.data;
            displayAttendanceReport(attendanceReport);

        })
        .catch((err) => {
            console.log('Failed to fetch attendance report:', err);
            alert('Failed to fetch attendance report');
        });
});

const displayAttendanceReport = (attendanceReport) => {

    const container = document.getElementById('attendanceContainer');

    let html = `
        <div class="bg-white rounded-lg shadow p-6">

            <div class="flex items-center justify-between mb-5">

                <h2 class="text-xl font-semibold text-gray-800">
                    Attendance Report
                </h2>
                <span class="text-sm text-gray-500">
                    Total Students: ${attendanceReport.length}
                </span>

            </div>

            <div class="overflow-x-auto">
                <table class="w-full border-collapse">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border p-3 text-left">
                                Student Name
                            </th>
                            <th class="border p-3 text-center">
                                Attendance
                            </th>
                            <th class="border p-3 text-center">
                                Percentage
                            </th>
                        </tr>
                    </thead>

                    <tbody>
    `;

    attendanceReport.forEach(student => {

        html += `
            <tr class="hover:bg-gray-50">
                <td class="border p-3 font-medium">
                    ${student.name}
                </td>
                <td class="border p-3 text-center">
                    ${student.attendance}
                </td>
                <td class="border p-3 text-center font-semibold">
                    ${student.percentage}
                </td>
            </tr>
        `;

    });

    html += `
                    </tbody>
                </table>
            </div>

        </div>
    `;

    container.innerHTML = html;
};