const mongoose = require('mongoose');

const HelperSchema = mongoose.Schema({
    name: { type: String },
    sdt: { type: String },
    email: { type: String }
});

module.exports = mongoose.model('Helper', HelperSchema);