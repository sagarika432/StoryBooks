const mongoose = require('mongoose');
const Mapping = require('../models/Mapping')
const sessionstorage  = require('sessionstorage')
module.exports = {
    ensureAuthenticated: function(req,res,next){
        if( sessionstorage.getItem('username') || req.isAuthenticated() ){
            return next();
        }
        
        res.redirect('/');
    },
    ensureGuest: function(req,res,next){

        if(req.isAuthenticated()){
            res.redirect('/dashboard')
        } else {
            return next();
        }
    }
}