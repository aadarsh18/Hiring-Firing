var cron = require('node-cron');
const mongoose = require('mongoose');
const Reminder = mongoose.model('reminder');
const mailKeys = require('../config/mailKeys');
const nodemailer = require('nodemailer');


const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: "jofi.hiringfiring@gmail.com", //your gmail account you used to set the project up in google cloud console"
        clientId: mailKeys.googleClientID,
        clientSecret: mailKeys.googleClientSecret,
        refreshToken: mailKeys.refreshToken,
    }
});


//used https://alexb72.medium.com/how-to-send-emails-using-a-nodemailer-gmail-and-oauth2-fe19d66451f9
//this article for configuration
var Cron = function Cron() {
    function getMailHTML(body) {
        var mail =
            '<div>\
        <p>Hi '+ body.userName + ',<p>\
        <p>Greetings from Jofi !</p>\
        <p>This is to remind you about the action you need to take for the following job:<p>\
        <p><b>Company Name: </b> '+ body.companyName + '</p>\
        <p><b>Role: </b> '+ body.role[0] + '</p>\
        <p><b>Current Status: </b>' + body.status + '</p>\
        <p><b>Reminding Note: </b>' + body.message + '</p>\
        <p><b>Job Link: </b>'+ body.jobLink + '</p>\
        <p>For more info about the job, visit:<a target="_blank" href="https://nowornever.live/hiring-firing/myjobstack">Hiring Firing</a> </p>\
        <p>All the best in your job search :)</p>\
        <p>Jofi</p>\
        <br/><br/>\
        <p><i>Do not reply to this mail</i></P>\
        </div>';
        return mail;
    }
    //Function to send reminder mail to one instance
    async function sendmail(body) {
        var ht = getMailHTML(body);
        const mailOptions = {
            from: 'jofi.hiringfiring@gmail.com', // sender
            to: body.userEmail, // receiver
            subject: 'Reminder for Job from ' + body.companyName, // Subject
            html: ht// html body
        };
        transport.sendMail(mailOptions, async function (err, result) {
            if (err) {
                const upd = await Reminder.findByIdAndUpdate(body._id, { nTries: body.nTries + 1 });
                console.log(err);
            }
            else {
                const upd = await Reminder.findByIdAndUpdate(body._id, { isSent: true });
                transport.close();
            }
        })
    }
    //Cron function that will be called
    async function utilFun() {
        //current relative time in milliseconds
        var d = new Date();
        d = d.getTime();
        // var md = 20 * 60 * 1000;
        // d = d - (d % md);
        //getting access token
        // const myOAuth2Client = new OAuth2(
        //     mailKeys.googleClientID,
        //     mailKeys.googleClientSecret,
        //     "https://developers.google.com/oauthplayground"
        // );
        // myOAuth2Client.setCredentials({
        //     refresh_token: mailKeys.refreshToken
        // });
        // var myAccessToken = null;
        try {
            // myAccessToken = await myOAuth2Client.getAccessToken();

            // creating mail transporter
            // const transport = nodemailer.createTransport({
            //     service: "gmail",
            //     auth: {
            //         type: "OAuth2",
            //         user: "jofi.hiringfiring@gmail.com", //your gmail account you used to set the project up in google cloud console"
            //         clientId: mailKeys.googleClientID,
            //         clientSecret: mailKeys.googleClientSecret,
            //         refreshToken: mailKeys.refreshToken,
            //         accessToken: myAccessToken //access token variable we defined earlier
            //     }
            // });
            var arr = await Reminder.find({ time: { $lte: d }, isSent: false, nTries: { $lte: 3 } });
            for (let i = 0; i < arr.length; i++) {
                sendmail(arr[i]);
            }
        }
        catch (error) {
            console.log(error);
        }
    }


    //Setting the Cron job

    cron.schedule('0 0 * * * *', () => {
        utilFun();
    },
        {
            scheduled: true,
            timezone: "Asia/Kolkata"
        }
    );
}
module.exports.Cron = Cron;