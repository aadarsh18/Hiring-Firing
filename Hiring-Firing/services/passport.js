const passport = require('passport');
const GoogleStartegy = require('passport-google-oauth20').Strategy; //this is a Class ?
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        });
});
passport.use(
    new GoogleStartegy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: keys.baseURL + '/auth/google/callback',
        proxy: true
    },
        async (acessToken, refreshToken, profile, done) => {
            const existingUser = await User.findOne({ googleId: profile.id });
            if (existingUser) {
                //The user already exits;
                return done(null, existingUser);
            }
            //Create new user
            const user = await new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                picURL: profile.photos[0].value
            }).save();
            done(null, user);
        }
    )
);