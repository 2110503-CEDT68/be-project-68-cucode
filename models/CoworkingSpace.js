const mongoose = require('mongoose');

const CoworkingSpaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    tel: {
        type: String,
        required: [true, 'Please add a telephone number']
    },
    open_close_time: {
        type: String,
        required: [true, 'Please add open-close time (e.g., 08:00-18:00)']
    }
}, {
    // เพิ่มบรรทัดนี้ เพื่อให้ Mongoose แสดงฟิลด์ Virtual ตอนแปลงเป็น JSON หรือ Object
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Cascade delete bookings when a coworking space is deleted
// Middleware ตัวนี้จะทำงานตอนที่เราสั่ง coworkingspace.deleteOne() ใน Controller
CoworkingSpaceSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    console.log(`Bookings being removed from coworking space ${this._id}`);
    await this.model('Booking').deleteMany({ coworkingspace: this._id });
    next();
});

// Reverse populate with virtuals
// สร้างฟิลด์จำลอง (Virtual) ชื่อ bookings เพื่อดึงข้อมูลการจองที่เชื่อมกับสถานที่นี้
CoworkingSpaceSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'coworkingspace',
    justOne: false
});

module.exports = mongoose.model('CoworkingSpace', CoworkingSpaceSchema);