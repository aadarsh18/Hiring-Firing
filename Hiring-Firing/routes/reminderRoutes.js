const mongoose = require('mongoose');

const Reminder = mongoose.model('reminder');
const requireLogin = require('../middlewares/requireLogin');
const requireAuthor = require('../middlewares/requireAuthor');
const requireFields = require('../middlewares/requireFields');
const moment = require('moment');
module.exports = (app) => {


    app.post('/api/add_reminder', requireLogin, async (req, res) => {
        var date = moment(req.body.time);
        if (date.isValid()) {
            date = moment(date).valueOf();
            const newReminder = await new Reminder({
                userName: req.user.name,
                googleId: req.user.id,
                userEmail: req.user.email,
                companyName: req.body.companyName,
                jobLink: req.body.jobLink,
                role: req.body.role,
                message: req.body.message,
                time: date,
                status: req.body.status,
                isSent: 0,
                nTries: 0
            }).save();
            res.send(true);
        }
        else {
            res.send("invalid date");
        }
    });
}