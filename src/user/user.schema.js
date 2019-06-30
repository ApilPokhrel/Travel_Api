
'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
    username: {type:String, trim: true},
    email: {type:String, unique: true, trim: true},
    password: {type:String, trim:true},
    phone:{type: String, trim: true},
    is_verified: Boolean,
    gender: String,
    tokens:[{
        access:{type: String},
        token:{type:String}
    }],
    role: {type: String, default: "user"},
    options:[{question: String, answer: String}],
    places:[{type: mongoose.Schema.Types.ObjectId, ref: 'Place'}]
});


userSchema.pre('save', function(next){
 try{
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, function(err, salt){
            if(err){
              return Promise.reject();
            }
           bcrypt.hash(user.password, salt, function(err, hash){
            if(err){
                return Promise.reject();
              } 

              user.password = hash;
              next();
           });
        })
    }
    else{
        next();
    }
 }catch(err){}
});



userSchema.methods.generateAuthToken = async function(){
    try{
        var user = this;
        const access = 'auth';
        const token = await jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET);
        user.tokens.push({access, token});
        await user.save();
        
        return token;

    }catch(err){}
};



userSchema.statics.findByToken = async function(token){
    
var User = this;
   
 let decoded;
 try{
    decoded = await jwt.verify(token, process.env.JWT_SECRET);
 }catch(err){
     return Promise.reject("Token not decoded");
 }

 return  User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
});
};


userSchema.statics.findByCredentials = async function(address, password){
  var User = this;
  let query = {phone: address};
  if(address.indexOf("@") > 1) query = {email: address};
  const user = await User.findOne(query);
     if(!user){
        return Promise.reject({message:"user not found", status: 404});
     }

    const res = await bcrypt.compare(password, user.password)
        if(res){
           return user;
        }else{
            return Promise.reject({message: "Password didnot matched", status: 404});
        }
};


userSchema.methods.removeToken = function(token){
   var user = this;
   return user.update({
    $pull:{
        tokens:{
            token: token
        }
    }
});
};


module.exports = mongoose.model('User', userSchema);