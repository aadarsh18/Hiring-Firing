const mongoose = require('mongoose');

const Job = mongoose.model('jobs');
const { v4: uuidv4 } = require('uuid');

const requireLogin = require('../middlewares/requireLogin');
const requireAuthor = require('../middlewares/requireAuthor');
const requireFields = require('../middlewares/requireFields');

const keys = require('../config/keys');

module.exports = (app) => {
    //Landing page
    app.get('/api/jobs_landingpage', requireLogin, async (req, res) => {
        var d = new Date();
        const curdate = d.toISOString();
        const mostLikedJob = await Job.find({ jobExpiry: { $gt: curdate }, isDeleted: false },)
            .sort({ likersCount: -1, postedOn: -1 })
            .limit(1);
        const recentJob = await Job.find({ jobExpiry: { $gt: curdate }, isDeleted: false },)
            .sort({ postedOn: -1 })
            .limit(1);
        const resp = {
            mostLikedJob: mostLikedJob[0],
            recentJob: recentJob[0]
        };
        res.send(resp);
    })
    //get single Job by,to be used in jobstack
    app.get('/api/jobidjob/:jobId', requireLogin, async (req, res) => {
        const job = await Job.findOne({ "jobId": req.params['jobId'] });
        res.send(job);
    });
    //company list to be used to populate in dropdown
    app.get('/api/company_list', requireLogin, async (req, res) => {
        var d = new Date();
        const curdate = d.toISOString();
        var list = await Job.find({ isDeleted: false }, { jobExpiry: { $gt: curdate } }).distinct('companyName');
        res.send(list);
    });
    //Get job by page number
    app.get('/api/page_job', requireLogin, async (req, res) => {
        const page = parseInt(req.query.page);
        const PAGE_SIZE = 10;//change this accordingly
        const skip = (page - 1) * PAGE_SIZE;
        const body_batch = req.query.batch;
        const body_companyName = req.query.companies;
        const body_role = req.query.role;
        const sortBy = req.query.sortBy;

        var d = new Date();
        const curdate = d.toISOString();

        var job = await Job.find({
            "$and": [body_batch ? { "batch": { "$in": body_batch } } : {}, { isDeleted: false }, body_companyName ? { "companyName": { "$in": body_companyName } } : {},
            body_role ? { "role": { "$in": body_role } } : {}]
        });
        const jobcount = job.length;
        var jobc = '' + jobcount

        var page_jobs = await Job.find({
            "$and": [body_batch ? { "batch": { "$in": body_batch } } : {}, { isDeleted: false }, body_companyName ? { "companyName": { "$in": body_companyName } } : {},
            body_role ? { "role": { "$in": body_role } } : {}]
        })
            .sort({ [req.query.sortBy]: req.query.comparator })
            .skip(skip)
            .limit(PAGE_SIZE)
            .populate('previewComment');
        var arr = {
            page: page_jobs,
            count: jobc
        }
        res.send(arr);
    })
    //Add liker
    app.post('/api/add_liker', requireLogin, async (req, res) => {
        const user = req.user.googleId
        const jobId = req.body.jobId;
        try {
            var job = await Job.findOne({ jobId: jobId });
            var isPresent = job.likers.includes(user);
            if (!isPresent) {
                job.likers.push(user);
                job.likersCount += 1;
            }
            await job.save();
            res.send("true");
        }
        catch (err) {
            res.send(err);
        }
    })
    //remove liker
    app.post('/api/remove_liker', requireLogin, async (req, res) => {
        const user = req.user.googleId;
        const jobId = req.body.jobId;
        var job = await Job.findOne({ jobId: jobId });
        var isPresent = job.likers.includes(user);
        if (isPresent) {
            const index = job.likers.indexOf(user);
            job.likers.splice(index, 1);
            job.likersCount -= 1;
        }
        await job.save();
        res.send("true");
    })
    //  Delete Job
    app.delete('/api/delete_job/:jobId', requireLogin, requireAuthor, async (req, res) => {
        const jobId = req.params['jobId'];
        const job = await Job.findOne({ jobId: jobId }, (err) => {
            if (err)
                throw err;
        });
        job.isDeleted = true;
        job.save();
        res.send(true);
    })

    //  Add Job 
    app.post('/api/add_job', requireLogin, requireFields, async (req, res) => {

        try {
            const newId = uuidv4();
            const newJob = await new Job({
                jobId: newId,
                companyName: req.body.companyName,
                jobTitle: req.body.jobTitle,
                jobLink: req.body.jobLink,
                batch: req.body.batch,
                isReferral: req.body.isReferral,
                jobExpiry: req.body.jobExpiry,
                postedBy: req.user.name,
                postedById: req.user.id,
                role: req.body.role,
                salary: req.body.salary
            }).save();
            res.send(true);
        }
        catch (err) {
            res.send(err);
        }
    });

    //update jobs
    app.patch('/api/update/:jobId', requireLogin, requireAuthor, requireFields, async (req, res) => {
        try {
            var d = new Date();
            const curdate = d.toISOString();
            const updatedJob = await Job.updateOne({ jobId: req.params.jobId },
                {
                    $set: {
                        companyName: req.body.companyName,
                        role: req.body.role,
                        jobTitle: req.body.jobTitle,
                        jobLink: req.body.jobLink,
                        batch: req.body.batch,
                        isReferral: req.body.isReferral,
                        jobExpiry: req.body.jobExpiry,
                        lastModified: curdate,
                        salary: req.body.salary
                    },
                });
            res.send("Job updated");

        }
        catch (err) {
            res.send(err);
        }
    });

}