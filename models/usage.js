const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
require('mongoose-currency').loadType(mongoose);


var usageSchemaful = new Schema({
    name: {
        type: String,
        required: true,
    },
    educational: {
        type: Number,
        required: true,
        min :[0, "Can't be negative value, got {VALUE}"],
        max : 1440
    },
    shopping: {
        type: Number,
        required: true,
        min :[0, "Can't be negative, got {VALUE}"],
        max : 1440
    },
    browsing: {
        type: Number,
        required: true,
        min : [0, "Can't be negative, got {VALUE}"],
        max:1440
    },
    socialMedia: {
        type: Number,
        required: true,
        min :[0, "Can't be negative, got {VALUE}"],
        max : 1440
    },
    date: {
        type: Date,
        default: Date.now,
        max: [Date.now, "Can't use future dates"]
    }
    
}, {
    timestamps: true
});



var usage = mongoose.model('Usage', usageSchemaful); 
module.exports = usage;