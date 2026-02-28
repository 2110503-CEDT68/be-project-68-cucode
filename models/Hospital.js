const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
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
    district: {
        type: String,
        required: [true, 'Please add a district']
    },
    province: {
        type: String,
        required: [true, 'Please add a province']
    },
    postalcode: {
        type: String,
        required: [true, 'Please add a postalcode'],
        maxlength: [5, 'Postal Code can not be more than 5 digits']
    },
    tel: {
        type: String
    },
    region: {
        type: String,
        required: [true, 'Please add a region']
    }
}, {
    // เพิ่มบรรทัดนี้ เพื่อให้ Mongoose แสดงฟิลด์ Virtual ตอนแปลงเป็น JSON หรือ Object
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Cascade delete appointments when a hospital is deleted
// Middleware ตัวนี้จะทำงานตอนที่เราสั่ง hospital.deleteOne() ใน Controller
HospitalSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    console.log(`Appointments being removed from hospital ${this._id}`);
    await this.model('Appointment').deleteMany({ hospital: this._id });
});

// Reverse populate with virtuals
// สร้างฟิลด์จำลอง (Virtual) ชื่อ appointments เพื่อดึงข้อมูลคิวจองที่เชื่อมกับโรงพยาบาลนี้
HospitalSchema.virtual('appointments', {
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'hospital',
    justOne: false
});

module.exports = mongoose.model('Hospital', HospitalSchema);