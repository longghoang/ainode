const mongoose = require('mongoose');

const plateSchema = new mongoose.Schema({
    plate_text: { 
        type: String, 
        required: true, 
        unique: true 
    },
    timestamp_in: { 
        type: Date, 
        default: Date.now 
    },
    timestamp_out: { 
        type: Date 
    },
    paid: { 
        type: Boolean, 
        default: false 
    }
});


module.exports = mongoose.model('Plate', plateSchema);
