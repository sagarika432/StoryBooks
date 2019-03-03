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
const myip = require('../myip')
const https = require('https')
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
router.get('/dashboard/:id',async(req,res)=>{
     console.log(req.params.id);
     console.log(domainName)
     const bodyToSend = {
        id: req.params.id,
        domainName
     };
     
     console.log(bodyToSend);
    await unirest.post(`https://${myip}:3000/login/resource`).header({
        'Content-Type':'application/json',
        'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOnsiZG9tYWluTmFtZSI6IlNCLmNvbSIsImNhbGxiYWNrVXJsIjoiMTcyLjMwLjcuMjI5OjUwMDAvZGFzaGJvYXJkIiwiZmFjZSI6dHJ1ZSwib3RwIjp0cnVlLCJ2b2ljZSI6dHJ1ZSwicGVybWlzc2lvbnMiOnsibmFtZSI6dHJ1ZSwidXNlcm5hbWUiOnRydWUsInBob25lIjp0cnVlLCJkb2IiOnRydWUsImltZyI6ZmFsc2UsImF1ZGlvIjpmYWxzZX19LCJpYXQiOjE1NTE1ODQ4ODZ9.e14EZ9sIOCVuYl38sDijg0bdf7VVPg_nEjacA_Q_jdw'
     }).send(bodyToSend).strictSSL(false).end(async (response) =>{
         console.log(JSON.stringify(response.body))
         console.log('--' + JSON.stringify(response.body.response));
        
         const findUser = await User.findOne({ tigerAuthUsername: response.body.response.username });
         console.log(findUser)
         if(!findUser){
            const arr = response.body.response.name.split(' ');
            const newUser = new User ({
                firstName: arr[0],
                lastName: arr[1],
                tigerAuthUsername: response.body.response.username,
                image: `https://localhost:3000/${response.body.response.username}/face_${response.body.response.username}.png`
            });
             await newUser.save();
         }
         const sessUser = await User.findOne({ tigerAuthUsername: response.body.response.username })
         //res.locals.tigerUser = response.username
         await sessionstorage.setItem('sessUser', sessUser);
        console.log( ' username of tiger' + sessionstorage.getItem('sessUser'))
         //sess = req.session;
         //sess.username = response.username;
         //console.log(sess.username)
        //  req.session.user = response.response.username
        //         res.redirect('/dashboard');
         await unirest.get(`https://${myip}:5000/about`).send().end(response =>{
         console.log('getting');
         res.redirect('/stories/my')
        
     })

     })
    
     
});



//for tiger auth
router.get('/redirect', (req,res) =>{
    const reqbody = {
    url:`https://${myip}:3000/loginUsers/${domainName}/trusted`,
    headers :{
        'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOnsiZG9tYWluTmFtZSI6IlNCLmNvbSIsImNhbGxiYWNrVXJsIjoiMTcyLjMwLjcuMjI5OjUwMDAvZGFzaGJvYXJkIiwiZmFjZSI6dHJ1ZSwib3RwIjp0cnVlLCJ2b2ljZSI6dHJ1ZSwicGVybWlzc2lvbnMiOnsibmFtZSI6dHJ1ZSwidXNlcm5hbWUiOnRydWUsInBob25lIjp0cnVlLCJkb2IiOnRydWUsImltZyI6ZmFsc2UsImF1ZGlvIjpmYWxzZX19LCJpYXQiOjE1NTE1ODQ4ODZ9.e14EZ9sIOCVuYl38sDijg0bdf7VVPg_nEjacA_Q_jdw',
        'Content-Type':'application/json'
    }
};
console.log(reqbody)
// res.redirect('https://172.30.8.120:4200/transition/SB.com/5c7967748d871821b7d4c223/trusted')
    // console.log('sending req to server');
    // request.get(reqbody,(error, response, body) =>{
    //         console.log(body);
    //         const obj = JSON.parse(body);
    //         res.redirect(obj.link);
    // });


    unirest.get(`https://${myip}:3000/loginUsers/${domainName}/trusted`).header({
        'Content-Type':'application/json',
        'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOnsiZG9tYWluTmFtZSI6IlNCLmNvbSIsImNhbGxiYWNrVXJsIjoiMTcyLjMwLjcuMjI5OjUwMDAvZGFzaGJvYXJkIiwiZmFjZSI6dHJ1ZSwib3RwIjp0cnVlLCJ2b2ljZSI6dHJ1ZSwicGVybWlzc2lvbnMiOnsibmFtZSI6dHJ1ZSwidXNlcm5hbWUiOnRydWUsInBob25lIjp0cnVlLCJkb2IiOnRydWUsImltZyI6ZmFsc2UsImF1ZGlvIjpmYWxzZX19LCJpYXQiOjE1NTE1ODQ4ODZ9.e14EZ9sIOCVuYl38sDijg0bdf7VVPg_nEjacA_Q_jdw'
     }).strictSSL(false).end((response)=> {
        console.log('here' + response.body.link);
         const link = response.body.link;
         console.log(' here ./d.f/. ' + link)
         res.redirect(link)

     }) 


});






    router.post('/cookies',(req,res)=> {
        // console.log(req);
        console.log(req.cookies);
        // res.json({okay:'okay'});
    })

module.exports = router; 