const LocalStrategy = require('passport-local').Strategy;

// Load User model
const User = require('../models/user');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email,
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'Email or password Incorrect' });
        }
        if (password == user.password) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Email or password Incorrect' });
          }
                
        });

    })
    
)

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

};

