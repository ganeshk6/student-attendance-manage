const express = require('express');
const path = require('path');
const sequelize = require('./utils/db_connection');
const studentRouter = require('./routes/studentRoutes');
const attendanceRouter = require('./routes/attendanceRoutes');
require('./models');
const app = express()
const PORT = 3000

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, '.', 'views', 'index.html'));
})
app.use('/students', studentRouter);
app.use('/attendance', attendanceRouter);

sequelize.sync({force: false})
.then(()=>{
    console.log("Database synchronized");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err)=>{
    console.log(err)
})