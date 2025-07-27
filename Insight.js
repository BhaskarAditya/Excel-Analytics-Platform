const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    recordId: {type: mongoose.Schema.Types.ObjectId, ref: 'ExcelRecord'},
    insights: String,
    raw: Number
}, {timestamps: true});

module.exports = mongoose.model('Insight', insightSchema);