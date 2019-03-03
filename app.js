const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const morgan = require('morgan')
const sessionstorage = require('sessionstorage')
const fs = require('fs')

const https = require('https');

let options = {
  key : fs.readFileSync('./server.key'),
  cert : fs.readFileSync('./server.crt')
}

//load Models
require('./models/User');
require('./models/Story');
require('./models/Mapping')

//Passport Config
require('./config/passport')(passport);


//load routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

//load Keys 
const keys  = require('./config/keys');


//handlebars helpers
const {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
} = require('./helpers/hbs');

//Map global promises
mongoose.Promise = global.Promise;


//Mongoose  Connect
mongoose.connect(keys.mongoURI ,{
    //useMongoClient : true
    useNewUrlParser: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));


const app = express();

//morgan middleware
app.use(morgan('dev'))
//body parser middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({credentials:true}));

// Method Override Middelware
app.use(methodOverride('_method'));

//Handlebars middleware
app.engine('handlebars',exphbs({
    helpers:{
        truncate: truncate,
        stripTags : stripTags,
        formatDate: formatDate,
        select : select,
        editIcon : editIcon
    },
    defaultLayout:'main'
}));
app.set('view engine','handlebars');





//cookie parser middleware
app.use(cookieParser());
//session middleware
app.use(session({
    secret : 'secret',
    resave:false,
    saveUninitialized:false,
    key: 'user_sid',
    cookie: {
        expires: 60000
    }

}));



//passport Middleware
app.use(passport.initialize());
app.use(passport.session());

const Mapping = mongoose.model('Mapping');
//Set Global vars
app.use(async (req,res,next) => {
    // console.log(req.user);
    if (sessionstorage.getItem('sessUser')) {
        console.log(' username here : ' + sessionstorage.getItem('sessUser'));
        req.user= sessionstorage.getItem('sessUser');
        console.log ('////////////////////////////');
        console.log('user deta');
        console.log(req.user)

    }
    res.locals.user = req.user || null;
    console.log(' oauth: ' + req.user)
    // if(res.response ) res.locals.tigerUser = res.response.username || null ;
    // console.log('res.locals.users ' +res.locals.user);
    // if(res.response) console.log('res.locals.tigerUser' + res.response.username)
    // if (req.cookies.user_sid && !req.session.user) {
    //     res.clearCookie('user_sid');        
    // }
    next();

});

//Set static folder
app.use(express.static(path.join(__dirname,'public')));


//Use routes
app.use('/',index);
app.use('/auth',auth);
app.use('/stories',stories);

const port = process.env.PORT || 5000;


https.createServer(options, app).listen(5000, ()=>{
    console.log('Server running on 5000....');
  });