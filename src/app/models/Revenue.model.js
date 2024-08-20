const mongoose = require('mongoose');

const Revenue = mongoose.Schema({
    date: { type: String, required: true, unique: true },
    totalVehicles: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 }
});

module.exports = mongoose.model('Revenue', Revenue);