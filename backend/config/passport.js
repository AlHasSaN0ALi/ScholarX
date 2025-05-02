const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/users/google/callback`,
    scope: ['profile', 'email']
},
async function(accessToken, refreshToken, profile, done) {
    try {
        // Check if user already exists
        let user = await User.findOne({ 
            $or: [
                { email: profile.emails[0].value },
                { googleId: profile.id }
            ]
        });

        if (user) {
            // If user exists but doesn't have googleId, update it
            if (!user.googleId) {
                user.googleId = profile.id;
                await user.save();
            }
            return done(null, user);
        }

        // Generate a secure random password
        const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        // If user doesn't exist, create new user
        user = await User.create({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            password: hashedPassword,
            googleId: profile.id,
            isVerified: true // Google accounts are pre-verified
        });

        return done(null, user);
    } catch (error) {
        console.error('Google Strategy Error:', error);
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}); 