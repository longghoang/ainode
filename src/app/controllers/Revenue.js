const moment = require('moment');
const faceSchema = require('../models/Face.model');
const Revenue = require('../models/Revenue.model');
const plateSchema = require('../models/Plates.model');


class storedController {
    async revenue(req, res, next) {
        try {
            const startDate = new Date('2024-07-30');
            const endDate = new Date();
    
            // Query for records with capturedAt between startDate and endDate
            const blogs = await faceSchema.find({
                scannedSuccessfully: false,
                capturedAt: { $gte: startDate, $lte: endDate }
            }, 'price capturedAt created_at');
    
            console.log(blogs)
    
            // Group blogs by date
            const groupedBlogs = {};
            blogs.forEach(blog => {
                const capturedDate = moment(blog.capturedAt).format('YYYY-MM-DD');
                if (!groupedBlogs[capturedDate]) {
                    groupedBlogs[capturedDate] = {
                        date: moment(blog.capturedAt).format('DD/MM/YYYY'),
                        total: 0,
                        price: 0,
                        blogs: []
                    };
                }
                groupedBlogs[capturedDate].blogs.push({
                    price: blog.price,
                    capturedAt: blog.capturedAt,
                    scannedSuccessfully: blog.scannedSuccessfully
                });
                groupedBlogs[capturedDate].total++;
                groupedBlogs[capturedDate].price += blog.price;
            });
    
            // Convert grouped blogs to an array for easier handling in EJS
            const groupedBlogsArray = Object.keys(groupedBlogs).map(date => groupedBlogs[date]);
    
            if (groupedBlogsArray.length === 0) {
                return res.status(400).json({ message: "Không tìm thấy" });
            }
    
            const currentDate = moment().format('DD/MM/YYYY');
    
            res.render('revenue', {
                faceSchema: groupedBlogsArray,
                currentDate: currentDate,
                isRevenue: true
            });
        } catch (error) {
            next(error);
        }
    }

    ///select-date 
    async selectDate  (req, res, next) {
        res.render('select-date');
    }

    //
    async reportRevenues (req, res, next) {
        try {
            const { date } = req.query; // Lấy ngày từ tham số truy vấn
    
            if (!date) {
                return res.status(400).json({ error: 'Date is required.' });
            }
    
            // Tìm doanh thu cho ngày đã chọn
            const revenueRecord = await Revenue.findOne({ date: date });
    
            console.log(revenueRecord);
    
            if (!revenueRecord) {
                return res.status(404).json({ error: 'No revenue data found for the selected date.' });
            }
    
            // Gửi thông tin doanh thu và số lượng xe đến tệp EJS
            res.render('report-revenue', {
                date: date,
                totalRevenue: revenueRecord.totalRevenue,
                totalVehicles: revenueRecord.totalVehicles
            });
        } catch (error) {
            next(error);
        }
    }

        //payment
        async payment(req, res, next) {
            try {
             
                const vehicle = await plateSchema.findOne({ paid: false }).sort({ timestamp_in: -1 }).lean();
        
                if (vehicle) {
                    if (vehicle.timestamp_out) {
                        const timeIn = new Date(vehicle.timestamp_in).getTime();
                        const timeOut = new Date(vehicle.timestamp_out).getTime();
                        const durationInSeconds = (timeOut - timeIn) / 1000; 
                        vehicle.duration = durationInSeconds; 
                        vehicle.cost = durationInSeconds * 5000; 
                    } else {
                        vehicle.duration = "Chưa rời khỏi";
                        vehicle.cost = "Chưa rời khỏi"; 
                    }
        
                    // Thêm ngày tháng cho xe
                    const date = new Date(vehicle.timestamp_in);
                    vehicle.date = date.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
                }
        
                res.render('payment', { vehicles: vehicle ? [vehicle] : [], isPayment: true });
            } catch (err) {
                next(err);
            }
        }

        //
                //payment
                async payments(req, res, next) {
                    try {
                        await plateSchema.updateMany({ paid: false }, { $set: { paid: true } });
                        res.json({ success: true });
                    } catch (err) {
                        res.status(500).json({ success: false, message: err.message });
                    }
                }
        
        
        
        


}

module.exports = new storedController();
