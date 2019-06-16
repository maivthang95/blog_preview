var mysql = require("mysql") ; 
var config = require("config") ;

var connection = mysql.createConnection({
    database : config.get("mysql.database") ,
    host : config.get("mysql.host") , 
    user : config.get("mysql.user") , 
    password : config.get("mysql.password") 
})

connection.connect() ; 

function getConnection(){
    if(!connection){
        connection.connect();
    }
    return connection;
}

module.exports = {
    getConnection : getConnection
}