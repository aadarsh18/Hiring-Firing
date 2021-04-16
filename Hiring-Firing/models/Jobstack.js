const mongoose = require('mongoose');
const { Schema } = mongoose;


const jobStackSchema = new Schema({
    googleId: String,
    jobId: String,
    status: { type: String, default: "Not Applied" },
    followUp: { type: String, default: "No" },
    comment: { type: String, default: "" },
    addTime: { type: Date, default: Date.now },
    jobExpiry: {type: Date},
});

mongoose.model('jobstack', jobStackSchema);