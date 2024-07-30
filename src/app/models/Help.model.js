const mongoose = require('mongoose');

const HelpSchema = mongoose.Schema({
    question: { type: String },
    answer: { type: String }
});

module.exports = mongoose.model('Help', HelpSchema);