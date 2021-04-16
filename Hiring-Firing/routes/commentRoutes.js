const mongoose = require('mongoose');

const Comment = mongoose.model('comments');
const Job = mongoose.model('jobs');

const requireLogin = require('../middlewares/requireLogin');
const requireCommentAuth = require("../middlewares/requireCommentAuth");

module.exports = (app) => {

    //getComments
    app.get('/api/get_comments/:jobId', requireLogin, async (req, res) => {
        try {
            let endValue = null;
            let startValue = req.query.startCommentPage;
            if (startValue == 0) {
                let allComments = await Comment.find({
                    jobId: req.params['jobId'],
                    isDeleted: false
                })
                    .limit(4)
                    .sort({ _id: -1 });
                if (allComments.length === 4) {
                    endValue = allComments[allComments.length - 2]._id;
                    allComments.pop();
                }
                allComments.push(endValue);
                res.send(allComments);
            }
            else {
                let allComments = await Comment.find({
                    _id: { $lt: startValue },
                    jobId: req.params['jobId'],
                    isDeleted: false
                })
                    .limit(4)
                    .sort({ _id: -1 });
                if (allComments.length === 4) {
                    endValue = allComments[allComments.length - 2]._id;
                    allComments.pop();
                }
                allComments.push(endValue);
                res.send(allComments);
            }
        }
        catch (err) {
            res.send(err);
        }
    })

    //addComment
    app.post('/api/add_comment/', requireLogin, async (req, res) => {
        try {
            req.body.comment.trim();
            if (!req.body.comment) {
                res.status(400).send("Kindly don't send an empty comment");
            }
            else {
                newComment = await new Comment({
                    jobId: req.body.jobId,
                    postedBy: req.user.name,
                    picURL: req.user.picURL,
                    postedById: req.user.id,
                    comment: req.body.comment
                }).save();
                //increment the commentCount here.
                await Job.updateOne({ jobId: req.body.jobId },
                    {
                        $inc: { commentCount: 1 },
                        $set: { previewComment: newComment._id }
                    }).exec();
                res.send(newComment);
            }
        }
        catch (err) {
            res.send(err);
        }
    });

    //deleteComment
    app.delete('/api/delete_comment/:_id', requireLogin, requireCommentAuth, async (req, res) => {
        try {
            const _id = req.params._id;
            //comment deletion
            const comment = await Comment.findOne({ _id: _id }, (err) => {
                if (err)
                    throw err;
            });
            comment.isDeleted = true;
            await comment.save();
            //find new preview comment
            const previewComment = await Comment.findOne({
                jobId: comment.jobId,
                isDeleted: false
            })
                .sort({ _id: -1 });

            //update preview comment in jobCard along with comment count
            //If directly null value is sent for null preview comment then $inc is also not working with it
            await Job.updateOne({ jobId: comment.jobId },
                {
                    $inc: { commentCount: -1 },
                    $set: { previewComment: previewComment ? previewComment._id : null }
                })
                .exec();
            res.send('Deleted the comment');
        }
        catch (err) {
            res.send(err);
        }
    });

    //updateComment
    app.patch('/api/update_comment/:_id', requireLogin, requireCommentAuth, async (req, res) => {
        try {
            req.body.comment.trim();
            if (!req.body.comment) {
                res.status(400).send("Kindly don't send an empty comment");
            }
            else {
                const updatedComment = await Comment.updateOne({ _id: req.params._id },
                    {
                        $set: {
                            comment: req.body.comment
                        },
                    })
                    .exec();
                res.send('comment updated');
            }
        }
        catch (err) {
            res.send(err);
        }
    });
}