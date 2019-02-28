const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const request = require('request');
const Cookies = require('universal-cookie');
const unirest = require('unirest');
const storage = require('node-sessionstorage')
var sessionstorage = require('sessionstorage')

const {ensureAuthenticated , ensureGuest } = require('../helpers/auth');

var sess ;
<<<<<<< HEAD


var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }    
};

=======
>>>>>>> 90984bae5d3134533447cf1dc45546a887f48274

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
router.get('/about',(req,res ) =>{
    console.log( ' username of tigerrrrrrrrrrrrrrr' + sessionstorage.getItem('username'))
    res.render('index/about');
});


//for tiger auth
router.get('/dashboard/:id',(req,res)=>{
     console.log(req.params.id);
     const bodyToSend =JSON.stringify( {
        id: req.params.id,
        domainName: 'storybook.com'
     });
     console.log(bodyToSend);
    unirest.post('http://192.168.43.124:3000/login/resource').header({
        'Content-Type':'application/json',
        'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOnsiZG9tYWluTmFtZSI6InN0b3J5Ym9vay5jb20iLCJjYWxsYmFja1VybCI6ImxvY2FsaG9zdDo1MDAwL2Rhc2hib2FyZCIsImZhY2UiOnRydWUsIm90cCI6dHJ1ZSwidm9pY2UiOnRydWUsInBlcm1pc3Npb25zIjp7Im5hbWUiOmZhbHNlLCJ1c2VybmFtZSI6dHJ1ZSwicGhvbmUiOnRydWUsImRvYiI6dHJ1ZSwiaW1nIjpmYWxzZSwiYXVkaW8iOmZhbHNlfX0sImlhdCI6MTU1MTI2NDE5M30.Tu-lHJUs7k7hIj--QvUviNVgboBoYYnqePB-vzFKFBk'
     }).send(bodyToSend).end((response) =>{
<<<<<<< HEAD
         
         console.log('--' + JSON.stringify(response.body.response));
         //res.locals.tigerUser = response.username
         sessionstorage.setItem('username', response.body.response.username);
        console.log( ' username of tiger' + sessionstorage.getItem('username'))
         //sess = req.session;
         //sess.username = response.username;
         //console.log(sess.username)
        //  req.session.user = response.response.username
        //         res.redirect('/dashboard');
=======
         console.log(response);
         sess = req.session;
         sess.username = response.username;
         console.log(sess.username)
        //  res.locals.tigerUser = response.username
        // sessionStorage.setItem(response.username, response);
>>>>>>> 90984bae5d3134533447cf1dc45546a887f48274

     })
     res.send('u');
     
});



//for tiger auth
router.get('/redirect', (req,res) =>{
    const reqbody = {
    url:'http://192.168.43.124:3000/loginUsers/storybook.com/trusted',
    headers :{
        'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOnsiZG9tYWluTmFtZSI6InN0b3J5Ym9vay5jb20iLCJjYWxsYmFja1VybCI6ImxvY2FsaG9zdDo1MDAwL2Rhc2hib2FyZCIsImZhY2UiOnRydWUsIm90cCI6dHJ1ZSwidm9pY2UiOnRydWUsInBlcm1pc3Npb25zIjp7Im5hbWUiOmZhbHNlLCJ1c2VybmFtZSI6dHJ1ZSwicGhvbmUiOnRydWUsImRvYiI6dHJ1ZSwiaW1nIjpmYWxzZSwiYXVkaW8iOmZhbHNlfX0sImlhdCI6MTU1MTI2NDE5M30.Tu-lHJUs7k7hIj--QvUviNVgboBoYYnqePB-vzFKFBk',
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