const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema  = require('../models/User')
const MappingSchema = new Schema ({
    
    tigerAuthUser: {
        type: String,
        required: true
    },
    storybooksUser: {
        type: [UserSchema],
        required: true
    }
})

mongoose.model('Mapping', MappingSchema);