var express = require("express") ; 
var post_md = require("../models/post");
var router = express.Router() ; 

router.get("/" , function(req , res){
    var data = post_md.getAllPost(); 

    data.then( posts => {
        var data = {
            posts : posts , 
            error : false 
        }
        res.render("blog/index" , {data : data });
    }).catch( err => {
        res.render("blog/index" , {data : {error : err}});
    })
})

router.get("/post/:id" , function(req , res){
    var id = req.params.id ; 

    var data = post_md.getPostById(id) ; 

    data.then( posts => {
        var post = posts[0];
        var data = {
            post : post , 
            error : false 
        }

        res.render("blog/post" , {data : data}) ;
    }).catch( err => {
        res.render("blog/post" , {data : {error : err}});
    })
})

router.get("/about" ,  function(req , res){
    res.render("blog/about");
})

module.exports = router ; 