const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const faceSchema = new Schema({
    descriptors: {
        type: [[Number]],
        required: true
    },
    licensePlate: {
        type: String,
        required: true
    },

    scannedSuccessfully: {
        type: Boolean,
        default: false
    },
    
    capturedAt: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        default: 10000
    }

});

const Face = mongoose.model('Face', faceSchema);

module.exports = Face;