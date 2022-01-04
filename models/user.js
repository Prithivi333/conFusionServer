var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var plm=require('passport-local-mongoose');

var User = new Schema({
    admin: {
        type: Boolean,
        default: false
    }
});

User.plugin(plm);

module.exports=mongoose.model('User',User);