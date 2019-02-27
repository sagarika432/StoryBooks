const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MappingSchema = new Schema ({
    googleID:{
        type : String,
        required :true
    },
    email:{
        type:String,
        required: true
    },
    tigerAuthUser: {
        type: String,
        required: true
    }
})

mongoose.model('Mapping', MappingSchema);