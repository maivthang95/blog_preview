var express = require("express") ; 
var helper = require("../helpers/helper");
var user_md = require("../models/user");
var post_md = require("../models/post");
var router = express.Router() ; 

router.get("/" , function(req , res){
    if(req.session.user){
        var data = post_md.getAllPost();

        data.then( posts  => {
            var data = {
                    posts : posts , 
                    error : false 
                }
            res.render("dashboard" , {data : data}) ;
        }).catch( err => {
            res.render("dashboard" , {data : {error : err}});
        })
    }
    else{
        res.redirect("/admin/signin");
    }
})

router.get("/signup" , function(req , res){
    res.render("signup" , {data : {}});
})

router.post("/signup" , function(req , res){
    var params = req.body  ;
    if(params.email.trim().length == 0 ){
        res.render("signup" , {data : {error : "Please enter an email"}}) ;
    }
    else if( params.passwd != params.repasswd || params.passwd.trim().length == 0 ){
        res.render("signup" , {data : {error : "Password or repassword is not match"}});
    }
    else{
        var password = helper.hash_password(params.passwd); 
        var now = new Date() ; 
        var user = {
            email : params.email ,
            password : password  ,
            first_name : params.firstname ,
            last_name : params.lastname , 
            created_date : now , 
            updated_date : now 
        }
        var data = user_md.addUser(user) ;

        data.then( result => {
            res.redirect("/admin/signin") ; 
        }).catch(err => {
            res.render("signup" , {data : {error :err}});
        })
    }
})

router.get("/users" , function(req , res){
    if(req.session.user){
        var data = user_md.getAllUser(); 
        data.then( users => {
            var data = {
                users : users , 
                error : false  
            }
            res.render("admin/users" , {data : data}) 
        }).catch(err => {
            res.render("admin/users" , {data : {error : "Could not find User"}}) 
        })
    }else{
        res.redirect("/admin/signin")
    }
})


router.get("/signin" ,function(req , res){
    res.render("admin/signin" , {data  : {} });
})


router.post("/signin" , function(req, res){
    var params = req.body ; 

    if(params.email.trim().length == 0 ){
        res.render("admin/signin" , {data : {error : "Eamil is required"}});
    }
    else if(params.password.trim().length == 0 ){
        res.render("admin/signin" , {data : {error : "Password is required"}});
    }
    else{
        var data = user_md.getUserByEmail(params.email);
        
        data.then( users => {
            var user = users[0];
            
            var status = helper.compare_password( params.password , user.password);
            if(status == true ){
                req.session.user = user ; 
                res.redirect("/admin") ; 
            }
            else{
                res.render("admin/signin" , {data : {error : "Password is wrong"}});
            }
        }).catch( err => {
            res.render("admin/signin" , {data : {error : "Email does not exist"}});
        })
    }

})

router.get("/post/add" , function (req , res){
    if(req.session.user){
    res.render("admin/post/add" , {data : {}});
    }
    else{
        res.redirect("/admin/signin");
    }
})

router.post("/post/add" ,  function(req , res){
   
        var param = req.body ; 
        if(param.title.trim().length == 0 ){
            res.render("admin/post/add" , {data : {error : "Please enter a title"}});
        }else{
            var now = new Date();
            var post = {
                title : param.title , 
                content :param.content , 
                author : param.author , 
                created_date : now , 
                updated_date :now
            }
            var data = post_md.addPost( post ); 
            data.then( post => {
                res.redirect("/admin") ; 
            }).catch( err => {
                res.render("admin/post/add" , {data : {error : err }});
            })
        }
    
}) 

router.get("/post/edit/:id" , function(req , res){
    if(req.session.user){
        var id = req.params.id;
        var data = post_md.getPostById(id);
        if(data){
            data.then( posts => {
                var post = posts[0];
                var data = {
                    post : post , 
                    error : false 
                }
        
                res.render("admin/post/edit" , {data : data}) 
            }).catch( err => {
                data = {
                    error : "Could not find Post"
                }
                res.render("admin/post/edit" , {data : data});
            })
        }
        else{
            res.render("admin/post/edit" , {data : {error : "Could not find Post"}});
        }
    }else{
        res.redirect("/admin/signin");
    }
})


router.put("/post/edit" , function(req , res){
    var param = req.body ; 

    var data = post_md.updatePost(param) ;
    if(!data){
        res.json({status_code : 500})
    }
    else{
        data.then( result => {
            res.json({status_code : 200})
        }).catch( err => {
            res.json({status_code : 500})
        })
   }
})

router.delete("/post/delete" , function(req , res){
    var post_id = req.body.id;
    
    var data = post_md.deletePost(post_id) ; 

    if(!data){
        res.json({status_code : 500}) ;
    }else{
        data.then( result => {
            res.json({status_code : 200 });
        }).catch( err => {
            res.json({data : {error : err}});
        })
    }
})
module.exports = router ; 