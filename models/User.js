const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const UserSchema  = new Schema({
    
    firstName: {
        type:String
    },
    lastName : {
        type:String
    },
    image: {
        type:String
    },
    tigerAuthUsername:{
        type:String,
        required: true
    }
///
/*
    storybook_username
    username: 'siddharthp538',
    img: ''.
    audio: ''

*/
//

});

//Create collection and add schema
mongoose.model('users',UserSchema);
module.exports = UserSchema;