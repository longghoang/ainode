// models/TicketRegistration.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketRegistrationSchema = new Schema({
    cardType: { type: String, required: true },
    fullName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    registrationDate: { type: Date, required: true },
    homeDelivery: { type: Boolean, required: true },
    receiveLocation: { type: String, required: true },
    photo: { type: String, required: true },
    uid: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('TicketRegistration', TicketRegistrationSchema);