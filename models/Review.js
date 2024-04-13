const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    eventId: { type: String, required: true },
    rating: { type: Number, required: true },
    overallRating: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    flagged: { type: Boolean, default: false },
    response: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);


