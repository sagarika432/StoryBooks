const express = require('express');
const router = express.Router();
const passport = require('passport');
const sessionStorage = require('sessionstorage');

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        res.redirect('/dashboard');
    });


router.get('/verify',(req,res) => {
    if(req.user){
        console.log(req.user);

    } else{
        console.log('Not Auth');
    }
});

router.get('/logout',(req,res) => {
    sessionStorage.removeItem('username');
    req.logout();
    res.redirect('/');
    
});

module.exports = router;