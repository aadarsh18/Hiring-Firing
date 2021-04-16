const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/User');
require('./models/Comments');
require('./models/Jobs');
require('./models/Jobstack');
require('./models/Reminder');
require('./services/passport');
require('dotenv').config();
var Cron = require('./cron/cronJob');

mongoose.connect(keys.mongoURI);


const app = express();

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

app.use(express.json());
Cron.Cron();
require('./routes/jobRoutes')(app);
require('./routes/jobstackRoutes')(app);
require('./routes/reminderRoutes')(app);
require('./routes/commentRoutes')(app);

if (process.env.NODE_ENV === 'production') {
    //Serve Production assets, main.js and main.css
    app.use(express.static('client/build'));

    //serve index.html file
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}
const Port = process.env.Port || 5000;

app.listen(Port);
