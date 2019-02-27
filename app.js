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


//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
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
    saveUninitialized:false

}));



//passport Middleware
app.use(passport.initialize());
app.use(passport.session());


//Set Global vars
app.use((req,res,next) => {
    // console.log(req.user);
    res.locals.user = req.user || null;
    // if(res.response ) res.locals.tigerUser = res.response.username || null ;
    // console.log('res.locals.users ' +res.locals.user);
    // if(res.response) console.log('res.locals.tigerUser' + res.response.username)
    next();

});

//Set static folder
app.use(express.static(path.join(__dirname,'public')));


//Use routes
app.use('/',index);
app.use('/auth',auth);
app.use('/stories',stories);

const port = process.env.PORT || 5000;


app.listen(port,()=>{
    console.log(`Server started  on port  ${port}`)
});