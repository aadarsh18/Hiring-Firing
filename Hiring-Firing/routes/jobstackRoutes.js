const mongoose = require('mongoose');

const Jobstack = mongoose.model('jobstack');
const Job = mongoose.model('jobs');

const requireLogin = require('../middlewares/requireLogin');
const requireAuthor = require('../middlewares/requireAuthor');
const requireFields = require('../middlewares/requireFields');


module.exports = (app) => {
    //add a job in jobstack of a user
    app.post('/api/addto_jobstack/:jobId', requireLogin, async (req, res) => {
        const jb = await Jobstack.find({ "jobId": req.params['jobId'], "googleId": req.user.googleId });
        if (jb.length === 0) {
            const newJob = await new Jobstack({
                googleId: req.user.googleId,
                jobId: req.params['jobId'],
                jobExpiry: req.body.jobExpiry,
            }).save();
            res.send(true);
        }
        else
            res.send(false);
    })
    //to get list of jobId to check in jobboard
    app.get("/api/jobstack_userjobs", requireLogin, async (req, res) => {
        const jobs = await Jobstack.find({ "googleId": req.user.googleId }).distinct("jobId");
        res.send(jobs);
    })
    //to get all jobs in jobstack of a user to show on jobstack page
    app.get("/api/jobstack", requireLogin, async (req, res) => {
        const jobs = await Jobstack.find({ "googleId": req.user.googleId
        }).sort({ 
            [req.query.sortBy]: req.query.comparator 
            });

        var jobid = [];
        for( var i in jobs){
            jobid.push(jobs[i].jobId);
        }
        const curr_jobs = await Job.find({ "jobId": {"$in": jobid}});
        var finalList = [];

        for (var i in jobs) {
            var obj = {jobId: jobs[i].jobId, status: jobs[i].status, comment: jobs[i].comment, followUp: jobs[i].followUp, addTime: jobs[i].addTime};

            for (var j in curr_jobs) {
                if (jobs[i].jobId == curr_jobs[j].jobId) {
                    obj.batch = curr_jobs[j].batch;
                    obj.role = curr_jobs[j].role;
                    obj.jobTitle = curr_jobs[j].jobTitle;
                    obj.jobExpiry = curr_jobs[j].jobExpiry;
                    obj.jobLink = curr_jobs[j].jobLink;
                    obj.isReferral = curr_jobs[j].isReferral;
                    obj.companyName = curr_jobs[j].companyName;
                    obj.salary = curr_jobs[j].salary;
                    obj.isDeleted = curr_jobs[j].isDeleted;
                    finalList.push(obj);
                }
            }
        }
        res.send(finalList);
    })

    //edit job in my jobStack
    app.patch("/api/update_jobstack/:jobId", requireLogin, async (req, res) => {
        try {
            const updatedJob = await Jobstack.updateOne({ "jobId": req.params['jobId'], "googleId": req.user.googleId },
                {
                    $set: {
                        status: req.body.status,
                        followUp: req.body.followUp,
                        comment: req.body.comment
                    },
                });
            res.send("Job updated");

        }
        catch (err) {
            res.send(err);
        }
    });
    app.delete("/api/delete_jobstack/:jobId", requireLogin, async (req, res) => {
        try {
            await Jobstack.deleteOne({ "jobId": req.params['jobId'], "googleId": req.user.googleId });
            res.send("Job deleted");

        }
        catch (err) {
            res.send(err);
        }
    });
}