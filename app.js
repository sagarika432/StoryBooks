const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');


//load User model
require('./models/User');

//Passport Config
require('./config/passport')(passport);


//load routes
const index = require('./routes/index');
const auth = require('./routes/auth');

//load Keys 
const keys  = require('./config/keys');

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

//Handlebars middleware
app.engine('handlebars',exphbs({
    defaultLayout:'main'
}));
app.set('view engine','handlebars');





//cookie parser middleware
app.use(cookieParser());
//session middleware
app.use(session({
    secret : 'secret',
    resave:false,
    saveUninitialized:false

}));



//passport Middleware
app.use(passport.initialize());
app.use(passport.session());


//Set Global vars
app.use((req,res,next) => {
    res.locals.user = req.user || null;
    next();

});

//Use routes
app.use('/',index);
app.use('/auth',auth);

const port = process.env.PORT || 5000;


app.listen(port,()=>{
    console.log(`Server started  on port  ${port}`)
});