const mongoose = require('mongoose');
const { stringify } = require('querystring');

const detailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    }
});

const Detail = mongoose.model('Detail', detailSchema);

module.exports = Detail;