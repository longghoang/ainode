const faceSchema = require('../models/Face.model');

class Empty {
    async empty (req, res) {
        try {
            
            const occupiedSpots = await faceSchema.find({ scannedSuccessfully: true });
    
            // Đếm số lượng bản ghi đã tìm thấy
            const numberOfOccupiedSpots = occupiedSpots.length;
            console.log(`Số lượng xe đã được quét thành công là: ${numberOfOccupiedSpots}`);
    
            // Chuẩn bị mảng spots để hiển thị trên giao diện
            const spots = Array.from({ length: 100 }, (_, index) => ({
                occupiedClass: index < numberOfOccupiedSpots ? 'occupied' : 'vacant'
            }));
            console.log(spots);

            const totalPosts = await faceSchema.countDocuments({ scannedSuccessfully: true });
            console.log(totalPosts)
      
            let post;
          if (totalPosts === 0) {
            post = 'Chưa có xe nào được gửi';
          }
    
            res.render('empty', { spots, totalPosts: totalPosts , isEmpty: true});
        } catch (error) {
            return res.send('Unavailable help!');
        }
    }
}
module.exports = new Empty();