const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const TeacherModel = require('../models/TeacherModel');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await TeacherModel.findOne({ where: { email } });
    if (!user) {
      console.log(`No user found with email: ${email}`);
      return done(null, false, { message: 'Incorrect email.' });
    }

      const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Password mismatch for user: ${email}`);
      return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, user);
  } catch (err) {
    console.error(`Error during authentication: ${err.message}`);
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await TeacherModel.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;

