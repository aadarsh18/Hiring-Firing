const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    jobId: String,
    postedBy: String,
    picURL: String,
    postedById: String,
    comment: String,
    isDeleted: { type: Boolean, default: false }
},
    { timestamps: true }
);

mongoose.model('comments', commentSchema);