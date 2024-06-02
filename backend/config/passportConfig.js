const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const TeacherModel = require('../models/TeacherModel');

passport.use(new LocalStrategy({
  usernameField: 'teacherCode',
  passwordField: 'password'
}, async (teacherCode, password, done) => {
  try {
    const user = await TeacherModel.findOne({ where: { teacherCode } });
    if (!user) {
      console.log(`No user found with teacherCode: ${teacherCode}`);
      return done(null, false, { message: 'Incorrect teacherCode.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Password mismatch for user: ${teacherCode}`);
      return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, user);
  } catch (err) {
    console.error(`Error during authentication: ${err.message}`);
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  console.log(`Serializing user: ${user.teacher_id}`);
  done(null, user.teacher_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await TeacherModel.findByPk(id);
    if (user) {
      console.log(`Deserialized user: ${user.teacherCode}`); // Debug statement
      done(null, user);
    } else {
      done(new Error('User not found'));
    }
  } catch (err) {
    done(err);
  }
});

module.exports = passport;