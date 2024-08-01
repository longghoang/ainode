

const faceSchema = require('../models/Face.model');
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = require('canvas');
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

class Scan {
    captureface (req, res) {
        res.render('captureface', {isScan: true})
    }

    /// scan
    async scan (req, res, next) {
       
        try {
            const { descriptors, licensePlate } = req.body;

          
            if (!descriptors || descriptors.length === 0) {
                return res.status(400).json({ error: 'No face data provided.' });
            }
            const newFace = new faceSchema({ descriptors, licensePlate, scannedSuccessfully: true });
            await newFace.save();
            res.status(200).json({ message: 'Face data saved successfully!' });
        } catch (error) {
           next(error)
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
    
            // Trả về kết quả
            res.status(200).json({ results });
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new Scan();