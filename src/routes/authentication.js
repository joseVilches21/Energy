const express = require('express');
const res = require('express/lib/response');
const router = express.Router();

const pool = require('../database');
const passport = require('passport');
const helpers = require('../lib/helpers');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

/* Registro de usuario:  */

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});
  
router.post('/signup', isNotLoggedIn, passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/signupadmin', isLoggedIn, (req, res) => {
    res.render('auth/signupadmin');
});
  
router.post('/signupadmin', isLoggedIn, passport.authenticate('local', {
    successRedirect: '/admin/users',
    failureRedirect: '/signupadmin',
    failureFlash: true
}));
/*
router.post('/signup', (req, res) => {
    console.log(req.body);
    res.send('recieved');
});*/

/* Loggeo de usuario:  */
router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    }) (req,res,next);
});
/*
router.get('/profile', (req, res) => {
    
    res.send('Profile');
});*/

/* Ver Perfil Usuario: */
router.get('/profile', isLoggedIn, (req, res) => {
    
    res.render('profile');
});

/* Vista Editar Perfil de Usuario */
router.get('/editprofile', isLoggedIn, (req, res) => {
    
    res.render('editprofile');
});

/* Borrar Perfil de Usuario */
router.get('/deleteprofile/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    req.flash('success','Se eliminó correctamente')
    res.redirect('/signin');
});

router.get('/deleteprofileforadmin/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    req.flash('success','Se eliminó correctamente')
    res.redirect('/admin/users');
});

/* Editar Perfil de Usuario */
router.get('/editprofile/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    console.log(users);
    res.render('editprofile', {user: users[0]});
});

router.post('/editprofile/:id',  async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name , email, phone, password } = req.body;
    const newUser = {
        first_name,
        last_name,
        email,
        phone,
        password
    };
    newUser.password = await helpers.encryptPassword(password);
    console.log(newUser.password);
    await pool.query('UPDATE users set ? WHERE id = ?', [newUser, id]);
    req.flash('success','Se actualizó correctamente')
    
    res.redirect('/profile');
});

router.get('/editprofileforadmin/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    console.log(users);
    res.render('editprofileforadmin', {user: users[0]});
});

router.post('/editprofileforadmin/:id',  async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name , email, phone, password } = req.body;
    const newUser = {
        first_name,
        last_name,
        email,
        phone,
        password
    };
    newUser.password = await helpers.encryptPassword(password);
    console.log(newUser.password);
    await pool.query('UPDATE users set ? WHERE id = ?', [newUser, id]);
    req.flash('success','Se actualizó correctamente')
    
    res.redirect('/admin/users');
});


/* Salir */
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.redirect('/signin');
});


/* PANEL DE ADMINISTRACION DE USUARIOS */
/* VISTA TABLA USERS */
router.get('/admin/users',isLoggedIn, async(req, res) => {
    const users = await pool.query('SELECT * FROM users');
    if(req.user.id == 16) {
        res.render('users',{users});
    }
    else{
        res.redirect('/profile');
    }
    console.log(req.user.id);
})

/* VISTA TABLA TOURS POR USERS
router.get('/', isLoggedIn, async (req, res) => {
    const tours = await pool.query('SELECT * FROM tours WHERE user_id = ?', [req.body.user_id]);
    if(req.user.id==16) {
        res.render('tours/list', {tours});
    }
    else{
        res.redirect('/profile');
    }
    console.log(req.user.id);
});

router.get('/admin/users/tours', isLoggedIn, async (req, res) => {
    const { user_id } = req.params;
    const tours = await pool.query('SELECT * FROM tours WHERE user_id = ?', [user_id]);
    console.log(tours);
    res.render('tours/list', {tour: tours[0]});
});  */

/* Vistas adicionales - No importante */
router.get('/contact', isLoggedIn, (req, res) => {
    
    res.render('contact');
});

router.get('/about', (req, res) => {
    
    res.render('about');
});

module.exports = router;