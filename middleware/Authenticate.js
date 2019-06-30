
const User = require("../src/user/user.schema");


exports.AuthorizeApi = async (req, res, next)=>{
    try{
     
    const token = req.headers["token"];
     
    const user = await User.findByToken(token);
    if(!user){
        res.status(403).send("unauthrized");
    } else {

     req.user = user;
     req.token = token;
     next();

    }
    }catch(err){
        res.status(403).send(err);
    }
 }
 

 exports.AuthorizeUi = async (req, res, next)=>{
    try{
     
    const token = req.cookies['token'];
     
    const user = await User.findByToken(token);
    if(!user){
      res.redirect('/login');
    } else{
      
     req.user = user;
     req.token = token;
 
    next();
    }
    }catch(err){
      res.redirect('/login');
    }
 }
 
 
 exports.logoutUi = async (req, res, next)=>{
   try{
   await req.user.removeToken(req.token);
    res.clearCookie('x-auth');
    res.redirect('/login');
   }catch(err){
     console.log(err);
   }
 
 };


 
 exports.logoutApi = async (req, res, next)=>{
    try{
    await req.user.removeToken(req.token);
    }catch(err){
      console.log(err);
    }
  
  };