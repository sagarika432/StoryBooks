const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const request = require('request');
const Cookies = require('universal-cookie');
const unirest = require('unirest');
const storage = require('node-sessionstorage')
var sessionstorage = require('sessionstorage')
const domainName = require('../domainName')
const Mapping = mongoose.model('Mapping')
const User = mongoose.model('users')
const {ensureAuthenticated , ensureGuest } = require('../helpers/auth');

var sess ;

router.get('/',ensureGuest,(req,res ) =>{
    res.render('index/welcome');
    
});

router.get('/dashboard',ensureAuthenticated, (req,res ) =>{
    sess  = req.session;
    if(sess.username) {
        console.log(sess.username)
    }
    Story.find({user:req.user.id})
    .then (stories => {
        res.render('index/dashboard',{
            stories : stories
        });
    });
    
});
router.get('/about',async(req,res ) =>{

    // const newUser = await User.findOne({ firstName: "Siddharth"});
    // console.log(newUser)
    // const newMapping = Mapping({
    //     tigerAuthUser: 'siddharthp538',
    //     storybooksUser: newUser
    // });
    // await newMapping.save();
    console.log( ' username of tigerrrrrrrrrrrrrrr' + sessionstorage.getItem('username'))
    res.render('index/about');
});


//for tiger auth
router.get('/dashboard/:id',(req,res)=>{
     console.log(req.params.id);
     const bodyToSend =JSON.stringify( {
        id: req.params.id,
        domainName
     });
     console.log(bodyToSend);
    unirest.post('http://192.168.43.124:3000/login/resource').header({
        'Content-Type':'application/json',
        'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOnsiZG9tYWluTmFtZSI6InN0b3J5Ym9va3MuY29tIiwiY2FsbGJhY2tVcmwiOiIxOTIuMTY4LjQzLjgxOjUwMDAvZGFzaGJvYXJkIiwiZmFjZSI6dHJ1ZSwib3RwIjp0cnVlLCJ2b2ljZSI6dHJ1ZSwicGVybWlzc2lvbnMiOnsibmFtZSI6ZmFsc2UsInVzZXJuYW1lIjp0cnVlLCJwaG9uZSI6dHJ1ZSwiZG9iIjp0cnVlLCJpbWciOnRydWUsImF1ZGlvIjpmYWxzZX19LCJpYXQiOjE1NTEzMjIyOTR9.CUNHvx8pRvu_dYbeMYO0IynrQSz9u4wCG0vTbrzSE7w'
     }).send(bodyToSend).end((response) =>{
         
         console.log('--' + JSON.stringify(response.body.response));
         //res.locals.tigerUser = response.username
         sessionstorage.setItem('username', response.body.response.username);
        console.log( ' username of tiger' + sessionstorage.getItem('username'))
         //sess = req.session;
         //sess.username = response.username;
         //console.log(sess.username)
        //  req.session.user = response.response.username
        //         res.redirect('/dashboard');
         unirest.get('http://192.168.43.81:5000/about').send().end(response =>{
         console.log('getting');
         res.redirect('/stories/my')
        
     })

     })
    
     
});



//for tiger auth
router.get('/redirect', (req,res) =>{
    const reqbody = {
    url:`http://192.168.43.124:3000/loginUsers/${domainName}/trusted`,
    headers :{
        'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOnsiZG9tYWluTmFtZSI6InN0b3J5Ym9va3MuY29tIiwiY2FsbGJhY2tVcmwiOiIxOTIuMTY4LjQzLjgxOjUwMDAvZGFzaGJvYXJkIiwiZmFjZSI6dHJ1ZSwib3RwIjp0cnVlLCJ2b2ljZSI6dHJ1ZSwicGVybWlzc2lvbnMiOnsibmFtZSI6ZmFsc2UsInVzZXJuYW1lIjp0cnVlLCJwaG9uZSI6dHJ1ZSwiZG9iIjp0cnVlLCJpbWciOnRydWUsImF1ZGlvIjpmYWxzZX19LCJpYXQiOjE1NTEzMjIyOTR9.CUNHvx8pRvu_dYbeMYO0IynrQSz9u4wCG0vTbrzSE7w',
        'Content-Type':'application/json'
    }
};
    console.log('sending req to server');
    request.get(reqbody,(error, response, body) =>{
            console.log(body);
            const obj = JSON.parse(body);
            res.redirect(obj.link);
    });

});






    router.post('/cookies',(req,res)=> {
        // console.log(req);
        console.log(req.cookies);
        // res.json({okay:'okay'});
    })

module.exports = router; 