const mongoose = require('mongoose');
const { stringify } = require('uuid');
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String,
    name: String,
    email: String,
    picURL: String
});

mongoose.model('users', userSchema);