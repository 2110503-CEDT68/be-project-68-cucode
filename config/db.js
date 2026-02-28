const mongoose = require('mongoose');

const connectDB = async () => {
    // ใช้คำสั่งนี้เพื่อป้องกัน Warning ใน Console (ตามสไลด์)
    mongoose.set('strictQuery', true);
    
    // เชื่อมต่อ MongoDB โดยใช้ค่าจาก env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;