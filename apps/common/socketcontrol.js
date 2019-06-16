module.exports = function(io){
    var usernames = [] ;
    io.on("connection" ,  function(socket){
        console.log("Have a user connected");

        socket.on("addUsername" , function(username){
            socket.username = username ; 
            usernames.push(username);
            var data = {
                sender : "SERVER" , 
                message : "You have joined chat room"
            }

            socket.emit("updateMessage" ,  data) ; 

            var data = {
                sender : "SERVER" , 
                message : username +" has joined chat room"
            }

            socket.broadcast.emit("updateMessage" , data) 
        })
    
        socket.on("sendMessage" , function(message) {
            //Notify your self

            var data = {
                sender : "You" , 
                message : message  
            }

            socket.emit("updateMessage" , data) ; 

            var data = {
                sender : socket.username ,
                message : message 
            }

            socket.broadcast.emit("updateMessage" , data) ;
        })
     
        //Listen disconnect Event 

        socket.on("disconnect" , function(){
            usernames.forEach( (username , index) => {
                if(username == socket.username){
                    usernames.splice(index , 1) ;
                }
            });
            console.log(usernames)
            var data = {
                sender : "SERVER" ,
                message : socket.username + " leaves Chat room"
            }

            socket.broadcast.emit("updateMessage" , data);
        })

        var numberUser = {
            sender : "SERVER" , 
            message : usernames.length + " are online" 
        }
        
        socket.broadcast.emit("updateUser" , numberUser);
    })
}