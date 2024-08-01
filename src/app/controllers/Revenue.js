const moment = require('moment');
const faceSchema = require('../models/Face.model') 

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
                currentDate: currentDate
            });
        } catch (error) {
            next(error);
        }
    }
    
}

module.exports = new storedController()