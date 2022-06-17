const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log(req.body);
    console.log(username, password);

    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      const user = rows[0];
      console.log(user);
      const validPassword = await helpers.matchPassword(password, user.password);
      console.log(user.password);
      console.log("VALID PASSWORD = " + validPassword );
      if (validPassword) {
       done(null, user, req.flash('success', 'Bienvenido ' + user.username));
      } else {
       done(null, false, req.flash('message', 'Contraseña incorrecta'));
      }
    } else {
      return done(null, false, req.flash('message', 'El usuario no existe.'));
    }
}));

passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const { first_name } = req.body;
    const { last_name } = req.body;
    const { email } = req.body;
    const { phone } = req.body;

    const newUser = {
        username,
        first_name,
        last_name,
        email,
        phone,
        password
    };

    newUser.password = await helpers.encryptPassword(password);
    console.log(newUser.password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    
    newUser.id = result.insertId;
    return done(null, newUser);

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
    const rows = await pool.query('SELECT * FROM users Where id = ?', [id]);
    done(null, rows[0]);
});