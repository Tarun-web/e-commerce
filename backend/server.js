//STARTING THE SERVER 

const app = require('./app')
const dotenv = require('dotenv');

//uncaught Exception 
process.on('uncaughtException', function (err) {
    console.log(err.mesage);
    console.log('shuting down the server due to uncaught exceotion error');
    process.exit(1);
});

//import connection databse.js
const connectDatabase = require('./database/database');

dotenv.config({path: './config/config.env'})

//connecting to db
connectDatabase()

const port = process.env.PORT || 5000; 
const server = app.listen(port, ()=>{
    console.log(`Server started on http://localhost:${port}`);
})


//unhandled Promise Rejection Error
process.on("unhandledRejection", (error)=>{
    
    console.log(`Error occured : ${error.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");

    server.close(()=>{
        process.exit(1);
    })
})