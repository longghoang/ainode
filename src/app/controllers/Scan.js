
const faceSchema = require('../models/Face.model');
const Revenue = require('../models/Revenue.model');
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = require('canvas');


faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

class Scan {
    async captureface (req, res) {
        try {
            const totalPosts = await faceSchema.countDocuments({ scannedSuccessfully: true });
            console.log(totalPosts)
      
            let post;
          if (totalPosts === 0) {
            post = 'Chưa có xe nào được gửi';
          }
      
            res.render('captureface', {
              totalPosts: totalPosts,
              post: post,
              isScan: true
            })
        } catch(error) {
            next(error)
        }
    }

    /// scan
    async scan(req, res, next) {
        try {
            const { descriptors, licensePlate } = req.body;
    
            if (!descriptors || descriptors.length === 0) {
                return res.status(400).json({ error: 'No face data provided.' });
            }
    
            // Lưu thông tin xe vào faceSchema
            const newFace = new faceSchema({ descriptors, licensePlate, scannedSuccessfully: true });
            await newFace.save();
    
            // Tính doanh thu và lưu vào mô hình Revenue
            const currentDate = new Date().toISOString().slice(0, 10);
            let revenueRecord = await Revenue.findOne({ date: currentDate });
    
            if (!revenueRecord) {
                revenueRecord = new Revenue({ date: currentDate, totalVehicles: 0, totalRevenue: 0 });
            }
    
            // Giả định phí gửi xe là 10,000 VNĐ
            const vehicleFee = 10000; 
    
            // Cập nhật số lượng xe và doanh thu
            
            revenueRecord.totalVehicles += 1;
            revenueRecord.totalRevenue += vehicleFee;

            console.log("venua", revenueRecord)
    
            await revenueRecord.save();
    
            res.status(200).json({ message: 'Face data saved successfully and revenue updated!' });
        } catch (error) {
            console.error("Error processing scan data:", error);
            next(error);
        }
    }
    


    //compare
    async compare (req, res, next) {  
        try {
            const { descriptors, licensePlate } = req.body;
    
            console.log(licensePlate)
    
            if (!descriptors || descriptors.length === 0) {
                return res.status(400).json({ error: 'No face data provided.' });
            }
    
            if (!licensePlate) {
                return res.status(400).json({ error: 'No license plate provided.' });
            }
            
            const allFaces = await faceSchema.find({ scannedSuccessfully: true });
            
            const results = [];
    
            for (let storedFace of allFaces) {
                const storedDescriptors = storedFace.descriptors.map(descriptor => new Float32Array(descriptor));
    
                const labeledDescriptors = new faceapi.LabeledFaceDescriptors(storedFace._id.toString(), storedDescriptors);
    
                const faceMatcher = new faceapi.FaceMatcher([labeledDescriptors]);
    
                let bestMatch = null;
    
                for (let descriptor of descriptors) {
                    const queryDescriptor = new Float32Array(descriptor);
                    const match = faceMatcher.findBestMatch(queryDescriptor);
    
                    if (!bestMatch || match.distance < bestMatch.distance) {
                        bestMatch = match;
                    }
                }
    
                // Lưu kết quả vào mảng results
                results.push({
                    match: bestMatch.label,
                    distance: bestMatch.distance,
                    licensePlate: storedFace.licensePlate
                });
    
                // Nếu khoảng cách nhỏ hơn ngưỡng (ví dụ: 0.4), cập nhật trạng thái scannedSuccessfully
                if (bestMatch.distance < 0.4 && storedFace.licensePlate === licensePlate) {
                    storedFace.scannedSuccessfully = false; 
                    await storedFace.save();
                }
            }

            ///
                
            res.status(200).json({ results });
        } catch (error) {
            next(error);
        }
    }






}

module.exports = new Scan();