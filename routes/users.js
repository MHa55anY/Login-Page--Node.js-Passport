const express = require('express');
const router = express.Router();
const passport = require('passport');

//User Model
const User = require('../models/user')

//Admin Login Page
router.get('/login', (req, res) => res.render('login'));

//Supervisor Login Page
router.get('/login2', (req, res) => res.render('login2'));

//Technician Login Page
router.get('/login3', (req, res) => res.render('login3'));


//Register Page
router.get('/register', (req,res) => res.render('register'));

//Register Handle
router.post('/register', (req,res)=>{
    const { name, email, password, password2, privilege } = req.body
    let errors = [];

    //Check required fields
    if(!name || !email || !password || !password2 || !privilege){
        errors.push({ msg:'Please enter all fields' });
    }

    //Check passwords match
    if(password !== password2) {
        errors.push({msg: 'Passwords do not match'});
    }

    //check password length
    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
        else{
           
            //Validation passed
            User.findOne({email: email })
                .then(user => {
                    if(user) {
                        //User exists
                        errors.push({msg: 'Email is already registered'});
                        res.render('register', {
                            errors,
                            name,
                            email,
                            password,
                            password2
                        });
                    
                    }
                    else{
                        const newUser = new User({
                            name,
                            email,
                            password,
                            privilege
                        });
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg','You are registered! Please log in')
                                if(privilege=="Admin")
                                {res.redirect('/users/login');
                                }
                                if(privilege== "Supervisor"){
                                    res.redirect('/users/login2');
                                }
                                else{
                                    res.redirect('/users/login3')
                                }
                            })
                            .catch(err => console.log(err))
                    }
                })
        }
});

// Admin Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
    })(req, res, next);
});

// Supervisor Login Handle
router.post('/login2', (req, res, next) => {
    passport.authenticate('local', {
    successRedirect: '/dashboard2',
    failureRedirect: '/users/login2',
    failureFlash: true
    })(req, res, next);
});

// Technician Login Handle
router.post('/login3', (req, res, next) => {
    passport.authenticate('local', {
    successRedirect: '/dashboard3',
    failureRedirect: '/users/login3',
    failureFlash: true
    })(req, res, next);
});

//Logout Handle
router.get('/logout', (req,res) =>{
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});

module.exports = router;