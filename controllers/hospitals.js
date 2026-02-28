const Hospital = require('../models/Hospital');

// @desc    Get all hospitals
// @route   GET /api/v1/hospitals
// @access  Public
exports.getHospitals = async (req, res, next) => {
    try {
        let query;

        // Copy req.query (ก๊อปปี้พารามิเตอร์ที่ส่งมาทาง URL)
        const reqQuery = { ...req.query };

        // Fields to exclude (ฟิลด์ที่จะไม่เอาไปค้นหาตรงๆ ใน DB)
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // ลบฟิลด์ที่อยู่ใน removeFields ออกจาก reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // สร้าง String สำหรับ Query
        let queryStr = JSON.stringify(reqQuery);

        // ใส่ $ นำหน้า operators เช่น gt, gte, lt, lte, in (แปลงเป็นคำสั่ง MongoDB)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // สร้างคำสั่งค้นหา
        // .populate('appointments') ใช้เพื่อดึงข้อมูลการจองที่ผูกกับรพ. นี้มาแสดงด้วย (Relationship)
        query = Hospital.find(JSON.parse(queryStr)).populate('appointments');

        // Select Fields (เลือกแสดงเฉพาะบางฟิลด์)
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort (การเรียงลำดับ)
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt'); // เรียงจากใหม่ไปเก่า
        }

        // Pagination (การแบ่งหน้า)
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25; // โชว์ 25 รายการต่อหน้า
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Hospital.countDocuments(); // นับจำนวนรพ. ทั้งหมด

        query = query.skip(startIndex).limit(limit);

        // ทำการประมวลผลคำสั่ง Query สุดท้าย
        const hospitals = await query;

        // จัดการผลลัพธ์ Pagination สำหรับส่งกลับไปบอก Client
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({ 
            success: true, 
            count: hospitals.length, 
            pagination, 
            data: hospitals 
        });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Get single hospital
// @route   GET /api/v1/hospitals/:id
// @access  Public
exports.getHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.findById(req.params.id);

        if (!hospital) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: hospital });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Create new hospital
// @route   POST /api/v1/hospitals
// @access  Private
exports.createHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.create(req.body);
        res.status(201).json({
            success: true,
            data: hospital
        });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Update hospital
// @route   PUT /api/v1/hospitals/:id
// @access  Private
exports.updateHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!hospital) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: hospital });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Delete hospital
// @route   DELETE /api/v1/hospitals/:id
// @access  Private
// @desc    Delete hospital
// @route   DELETE /api/v1/hospitals/:id
// @access  Private
// @desc    Delete hospital
// @route   DELETE /api/v1/hospitals/:id
// @access  Private
exports.deleteHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.findById(req.params.id);

        if (!hospital) {
            return res.status(404).json({ success: false, message: 'Hospital not found' });
        }

        await hospital.deleteOne(); // สั่งลบ

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.log("Delete Error:", err.message); // พิมพ์ Error ลง Terminal
        // ส่ง Error กลับไปที่ Newman ด้วย จะได้รู้ว่าพังเพราะอะไร
        res.status(400).json({ success: false, message: err.message }); 
    }
};