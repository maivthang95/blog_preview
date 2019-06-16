$(document).ready(function () {
   new Post();
});

function Post(){
    function bindEvent(){
        $(".post_edit").click(function(event){
            location.reload();
            var params = {
                id : $("#id").val(), 
                title : $("#title").val(),
                content : tinyMCE.get("content").getContent() , 
                author : $("#author").val()
            }
    
            var db_url = location.protocol + "//" + document.domain + ":" + location.port ;
    
            $.ajax({
                type: "PUT",
                url: db_url + "/admin/post/edit" ,
                data: params,
                dataType: "json",
                success: function (response) {
                    if(response && response.status == 200){
                        location.reload();
                        location.reload();
                    }
                }
            });
        })

        $(".post_delete").click(function(event){
            var post_id = $(this).attr("post_id");
            
            var db_url =  location.protocol + "//" + document.domain + ":" + location.port;
            
            $.ajax({
                type: "DELETE",
                url: db_url + "/admin/post/delete",
                data: {id : post_id},
                dataType: "json",
                success: function (response) {
                    if(response && response.status_code == 200 ){
                        location.reload();
                    }
                }
            });
        });
    }

    bindEvent();
}