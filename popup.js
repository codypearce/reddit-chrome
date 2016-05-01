
var xhr = new XMLHttpRequest();
xhr.open("GET", "http://www.reddit.com/r/askreddit.json?", true);
xhr.onreadystatechange = function() {
 if (xhr.readyState == 4) {
   var sub;
   if(xhr.responseURL.indexOf('/r/') > 0) {
     var str = xhr.responseURL.slice(xhr.responseURL.indexOf('/r/') + 3);
     sub = str.slice(0, str.indexOf('.'));
   }
   var jsonString = JSON.parse(xhr.responseText)
   var posts = jsonString.data.children;
   for(var i = 2; i < posts.length; i++) {
     console.log(posts[i].data);
     var post = '<div class="post" id="'+ posts[i].data.name + '"></div>';
     var title = '<a href="' + posts[i].data.url + '" id="'+posts[i].data.name+' " class="postTitle">' + posts[i].data.title + '</a>';
     var upvotes = '<span class="postUps">' + posts[i].data.ups + '</span>';
     $('#reddit-content').append(post);
     $('#' +posts[i].data.name).append(upvotes);
     $('#' +posts[i].data.name).append(title);
   }
   var lastPost = $('.post').last().attr("id");
   var loadMore = '<a id="loadMore" href="http://www.reddit.com/r/'+sub+'.json?'+lastPost+'" >Load More</a>';
   $('#reddit-content').append(loadMore);
 }
}
xhr.send();

$(document).ready(function(){
   $('body').on('click', '#loadMore', function(){
     $('.post').remove();
     $('#loadMore').remove();
     var link = this.href.slice(0, this.href.indexOf('?'));
     var lastPost = this.href.slice(this.href.indexOf('?')+1);
     var xhr = new XMLHttpRequest();
     xhr.open("GET", link + '?count=25&after=' + lastPost  , true);
     xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var sub;
        if(xhr.responseURL.indexOf('/r/') > 0) {
          var str = xhr.responseURL.slice(xhr.responseURL.indexOf('/r/') + 3);
          sub = str.slice(0, str.indexOf('.'));
        }
        var jsonString = JSON.parse(xhr.responseText)
        var posts = jsonString.data.children;
        for(var i = 2; i < posts.length; i++) {
          console.log(posts[i].data);
          var post = '<div class="post" id="'+ posts[i].data.name + '"></div>';
          var title = '<a href="' + posts[i].data.url + '" id="'+posts[i].data.name+' " class="postTitle">' + posts[i].data.title + '</a>';
          var upvotes = '<span class="postUps">' + posts[i].data.ups + '</span>';
          $('#reddit-content').append(post);
          $('#' +posts[i].data.name).append(upvotes);
          $('#' +posts[i].data.name).append(title);
        }
        var lastPost = $('.post').last().attr("id");
        var loadMore = '<a id="loadMore" href="http://www.reddit.com/r/'+sub+'.json?'+lastPost+'" >Load More</a>';
        $('#reddit-content').append(loadMore);
      }
     }
     xhr.send();
   });
 });

$(document).ready(function(){
   $('body').on('click', '.postTitle', function(){
     if(this.href.indexOf('reddit') > 0) {
       $('.postContent').remove()
       $('.comment').remove()
       var xhr = new XMLHttpRequest();
       xhr.open("GET", this.href + '.json' + "?" + this.id, true);
       xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          var postId = xhr.responseURL.slice(xhr.responseURL.indexOf('?') + 1);
          var jsonString = JSON.parse(xhr.responseText)
          var post = jsonString[0].data.children[0].data;
          $('#'+postId).after('<div class="postContent"></div>');
          $('.postContent').append('<p>Title: ' + post.title +'</p>');
          $('.postContent').append('<p>OP: ' + post.author +'</p>');
          $('.postContent').append('<p>' + post.selftext +'</p>');
          var comments = jsonString[1].data.children;
          for(var i = 0; i < comments.length; i++) {
            var comment = "<ul class='comment' id='comment"+ i + "'></ul>"
            var author ='<li id="author'+i+'">' + comments[i].data.author + ' </li>';
            var ups ='<span>' + comments[i].data.ups + ' </span>';
            var body ='<li >' + comments[i].data.body + ' </li>';
            $('.postContent').append(comment);
            $('#comment' + i).append(author);
            $('#author' + i).append(ups);
            $('#author' + i).append(body);
          }
        }
       }
       xhr.send();
     } else {
       chrome.tabs.create({url: $(this).attr('href')});
     }
     return false;
   });
});
