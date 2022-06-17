const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

/* Ruta add recorrido */
router.get('/add', isLoggedIn, (req, res) => {
    res.render('tours/add');
});
/* Agregar recorrido*/
router.post('/add', isLoggedIn, async(req, res) => {
    const { type_tour, average_tour, link} = req.body;
    const newTour = {
        type_tour,
        average_tour,
        link,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO tours set ?', [newTour]);
    req.flash('success','Se guardó correctamente');
    res.redirect('/tours');
});
/* Ver recorridos */
router.get('/', isLoggedIn, async (req, res) => {
    const tours = await pool.query('SELECT * FROM tours WHERE user_id = ?', [req.user.id]);
    res.render('tours/list', {tours});
    console.log(req.user.id);
});
/* Borrar recorrido */
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM tours WHERE id = ?', [id]);
    req.flash('success','Se eliminó correctamente')
    res.redirect('/tours');
});
/* Editar recorrido - Seleccionar tabla tour*/
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const tours = await pool.query('SELECT * FROM tours WHERE id = ?', [id]);
    console.log(tours);
    res.render('tours/edit', {tour: tours[0]});
});
/* Editar recorrido - Actualizar datos*/
router.post('/edit/:id', isLoggedIn,  async (req, res) => {
    const { id } = req.params;
    const { type_tour, average_tour, link} = req.body;
    const newTour = {
        type_tour,
        average_tour,
        link
    };
    await pool.query('UPDATE tours set ? WHERE id = ?', [newTour, id]);
    req.flash('success','Se actualizó correctamente')
    res.redirect('/tours');
});

module.exports = router;