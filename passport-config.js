const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt')
const userModel = require('./src/userModel');


// Passport configuration function for local authentication strategy
module.exports = function(passport) {
    // Local strategy for authenticating users
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Find user by email
            userModel.findOne({ email: email }).then(user => {
                if (!user) {
                    return done(null, false, { message: 'That email is not registered' });
                }
                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
            }).catch(err => {
                console.error('Error finding user:', err);
                return done(err);
            });
        })
    );

    // Serialize user to session
    passport.serializeUser(function(user, done) {
        console.log('Serializing User', user);
        done(null, user.id);
    });

    // Deserialize user from session
    passport.deserializeUser(async function(id, done) {
        console.log('Deserializing User', id);
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error('Error deserializing user:', error);
            done(error, null);
        }
    });
};
