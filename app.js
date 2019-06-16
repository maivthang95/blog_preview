var express = require("express") ; 
var config = require("config") ; 
var bodyParser = require("body-parser") ; 
var session = require("express-session");
var socketio = require("socket.io");

var app = express() ; 

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: config.get("key_secret"),
  resave: false ,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended : true })) ; 

app.use(require(__dirname + "/apps/controllers")); 
var hostname = config.get("server.host") ; 
var port = config.get("server.port") ; 

//SET views
app.set("views",  __dirname + "/apps/views") ; 
app.set("view engine" , "ejs");

//SET static folder
app.use("/static" , express.static(__dirname + "/public")) ; 


var server = app.listen(port , hostname , function(){
    console.log("Server is running on port " , port , ", hostname: " , hostname ) ;
})

var io = require("socket.io")(server) ;

var socketcontrol = require("./apps/common/socketcontrol")(io) ;