const mongoose = require('mongoose');

const Comment = mongoose.model('comments');


module.exports =  async (req, res, next) => {
    
    const comment = await Comment.findOne({
        _id: req.params._id
    }).lean();
    if(!comment || comment.postedById != req.user.id){
        return res.status(403).send({error: "You must have authored the comment to perform the requested action"});
    }
    
    next();
    
};