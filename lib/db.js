//Insert Depedency Mysql
var mysql = require('mysql')

//Create Setup Connection to DB
var connection = mysql.createConnection({
    host:"localhost",
    user: "root",
    password : "",
    database: "db_book"
});

//Status Connection
connection.connect(function(error){
    if(!!error){
        console.log(error);
    } else {
        console.log("Connected")   
    }
});

module.exports = connection;