const mongoose = require('mongoose');
const { Schema } = mongoose;

const reminderSchema = new Schema({
    userName: String,
    googleId: String,
    userEmail: String,
    companyName: String,
    jobLink: String,
    role: Array,
    message: String,
    time: Number,
    isSent: { type: Boolean, default: false },
    nTries: { type: Number, default: 0 },
    status: String
});
mongoose.model('reminder', reminderSchema);