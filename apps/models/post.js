var db = require("../common/database");
var q = require("q");

var conn = db.getConnection();

function getAllPost(){
    var defer = q.defer();
    var query = conn.query("SELECT* FROM posts" , function(err ,result){
        if(err){
            defer.reject(err) ;
        }else{
            defer.resolve(result);
        }
    })
    return defer.promise
}

function addPost( post ){
    if(post){
        var defer = q.defer();
        var query = conn.query("INSERT INTO posts SET ? " , post , function(err , result ){
            if(err){
                defer.reject(err) ;
            }else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false ;
}

function getPostById( id ){
    var defer = q.defer();
    var query = conn.query("SELECT * FROM posts WHERE id = ? " , id , function(err , result){
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(result);
        }
    })
    return defer.promise;
}

function updatePost( param ){
    if(param){
        var defer = q.defer() ; 

        var query = conn.query("UPDATE posts SET title = ? , content = ? , author = ? , updated_date =? WHERE id = ? " , 
        [param.title , param.content , param.author , new Date() , param.id] , function(err , result ){
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(result) ; 
            }
        })
        return defer.promise;
    }
    return false 
}

function deletePost( id ){
    if(id){
        var defer = q.defer() ; 

        var query = conn.query("DELETE FROM posts WHERE ? " , { id : id }, function(err , result ){
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(result) ; 
            }
        })
        return defer.promise;
    }
    return false ;
}
module.exports = {
    getAllPost : getAllPost ,
    addPost : addPost,
    getPostById : getPostById,
    updatePost : updatePost ,
    deletePost : deletePost
}