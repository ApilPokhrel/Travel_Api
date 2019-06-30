
const mongoose = require('mongoose');
const http = require('http');
const path = require('path');


const app = require('./app');

const PORT = process.env.PORT || 3000;


 const httpServer = http.createServer(app);
 
 require('dotenv').config({path: 'variables.env'});

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err)=>{
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});


//  process.on('unhandledRejection', (err) => {

//     // console.log(err);
//     // process.exit(1);
// });


httpServer.listen(PORT, (err)=>{
    if(err){
        console.log(err);
    } else{
        console.log("--------------------------Server Started On "+PORT+"-----------------");
    }
});
