'use strict';

const multer = require('multer');
const uuid = require('uuid');
const path = require('path');

const multeroption = {
  storage: multer.diskStorage({
      destination: function(req, file, cb){
          console.log(path.join(__dirname+"/../public/uploads"))
         cb(null, path.join(__dirname+"/../public/uploads"));
      },
      filename: function(req, file, cb){
          cb(null, uuid.v4()+'.'+file.mimetype.split('/')[1]);
      }
  }),

  fileFilter(req, file, next){
    const isPhoto = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');

    if(isPhoto || isVideo){ 
        next(null, true);
       }
       else{
           next({message:'type of file is not supported'}, false);
       }
  }
};


exports.upload = multer(multeroption).array('file', 12);
