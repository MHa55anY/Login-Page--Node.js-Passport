const express = require('express');
const { ensureAuthenticated } = require('../config/auth');
const router = express.Router();

//Welcome page
router.get('/', (req, res) => res.render('welcome'));

//Admin Dashboard page
router.get('/dashboard', ensureAuthenticated, (req, res) => 
res.render('dashboard', {
    name: req.user.names
}));

//Supervisor Dashboard page
router.get('/dashboard2',ensureAuthenticated, (req, res) => 
res.render('dashboard2', {
    name: req.user.name
}));

//Technician Dashboard page
router.get('/dashboard3', ensureAuthenticated, (req, res) => 
res.render('dashboard3', {
    name: req.user.name
}));

module.exports = router;
