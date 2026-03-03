const CoworkingSpace = require('../models/CoworkingSpace');

// @desc    Get all coworking spaces
// @route   GET /api/v1/coworkingspaces
// @access  Public
exports.getCoworkingSpaces = async (req, res, next) => {
    try {
        let query;
        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);
        
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
        let queryList = {};

        if(req.query.name){
            queryList.name = {$regex:req.query.name,$options:'i'};
        }
        else if(req.body.name){
            queryList.name = {$regex:req.body.name,$options:'i'};
        }
        if(req.query.address){
            queryList.address = {$regex:req.query.address,$options:'i'};
        }
        else if(req.body.address){
            queryList.address = {$regex:req.body.address,$options:'i'};
        }
        if(req.query.tel){
            queryList.tel = {$regex:req.query.tel,$options:'i'};
        }
        else if(req.body.tel){
            queryList.tel = {$regex:req.body.tel,$options:'i'};
        }
        if(req.query.OpenTime){
            queryList.OpenTime = {$lte:req.query.OpenTime};
        }
        else if(req.body.OpenTime){
            queryList.OpenTime = {$lte:req.body.OpenTime};
        }
        if(req.query.CloseTime){
            queryList.CloseTime = {$gte:req.query.CloseTime};
        }
        else if(req.body.OpenTime){
            queryList.CloseTime= {$gte:req.body.CloseTime};
        }

        let queryListFinal = {...JSON.parse(queryStr),...queryList};
        // ดึงข้อมูล CoworkingSpace พร้อมกับการจอง (bookings) ที่เชื่อมโยงกัน
        query = CoworkingSpace.find(queryListFinal).populate('bookings');

        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await CoworkingSpace.countDocuments();

        query = query.skip(startIndex).limit(limit);
        const coworkingspaces = await query;

        const pagination = {};
        if (endIndex < total) { pagination.next = { page: page + 1, limit }; }
        if (startIndex > 0) { pagination.prev = { page: page - 1, limit }; }

        res.status(200).json({ success: true, count: coworkingspaces.length, pagination, data: coworkingspaces });
    } catch (err) {
        res.status(400).json({ success: false, message:err.message});
    }
};

// @desc    Get single coworking space
// @route   GET /api/v1/coworkingspaces/:id
// @access  Public
exports.getCoworkingSpace = async (req, res, next) => {
    try {
        const coworkingspace = await CoworkingSpace.findById(req.params.id).populate('bookings');
        if (!coworkingspace) {
            return res.status(404).json({ success: false, message: 'Coworking space not found' });
        }
        res.status(200).json({ success: true, data: coworkingspace });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Create new coworking space
// @route   POST /api/v1/coworkingspaces
// @access  Private
exports.createCoworkingSpace = async (req, res, next) => {
    try {
        const coworkingspace = await CoworkingSpace.create(req.body);
        res.status(201).json({ success: true, data: coworkingspace });
    } catch (err) {
        res.status(400).json({ success: false, message:err.message});
    }
};

// @desc    Update coworking space
// @route   PUT /api/v1/coworkingspaces/:id
// @access  Private
exports.updateCoworkingSpace = async (req, res, next) => {
    try {
        const coworkingspace = await CoworkingSpace.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!coworkingspace) {
            return res.status(404).json({ success: false, message: 'Coworking space not found' });
        }
        res.status(200).json({ success: true, data: coworkingspace });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};
// @route   DELETE /api/v1/coworkingspaces/:id
// @access  Private
exports.deleteCoworkingSpace = async (req, res, next) => {
    try {
        const coworkingspace = await CoworkingSpace.findById(req.params.id);
        if (!coworkingspace) {
            return res.status(404).json({ success: false, message: 'Coworking space not found' });
        }

        await coworkingspace.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

