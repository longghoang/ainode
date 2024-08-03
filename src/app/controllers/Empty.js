const faceSchema = require('../models/Face.model');

class Empty {
    async empty (req, res) {
        try {
            
            const totalPosts = await faceSchema.countDocuments({ scannedSuccessfully: true });
            console.log(totalPosts)
      
            let post;
          if (totalPosts === 0) {
            post = 'Chưa có xe nào được gửi';
          }
      
            res.render('empty', {
              totalPosts: totalPosts,
              post: post
            })
        } catch (error) {
            return res.send('Unavailable help!');
        }
    }
}
module.exports = new Empty();