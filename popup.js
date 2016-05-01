
var xhr = new XMLHttpRequest();
xhr.open("GET", "http://www.reddit.com/r/askreddit.json?", true);
xhr.onreadystatechange = function() {
 if (xhr.readyState == 4) {
   // WARNING! Might be injecting a malicious script!\
   var jsonString = JSON.parse(xhr.responseText)
   var arrayOfPosts = jsonString.data.children;
   for(var i = 2; i < arrayOfPosts.length; i++) {
     var title ='<a href="' + arrayOfPosts[i].data.url + '"id="post'+ i + '"><p>' + arrayOfPosts[i].data.title + '</p></a>';
     $('#reddit-content').append(title);
   }
 }
}
xhr.send();

$(document).ready(function(){
   $('body').on('click', 'a', function(){
     if(this.href.indexOf('reddit') > 0) {
       $('.post').remove()
       $('.comment').remove()
       var xhr = new XMLHttpRequest();
       xhr.open("GET", this.href + '.json' + "?" + this.id, true);
       xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          var postId = xhr.responseURL.slice(xhr.responseURL.indexOf('?') + 1);
          var jsonString = JSON.parse(xhr.responseText)
          var post = jsonString[0].data.children[0].data;
          $('#'+postId).after('<div class="post"></div>');
          $('.post').append('<p>Title: ' + post.title +'</p>');
          $('.post').append('<p>OP: ' + post.author +'</p>');
          $('.post').append('<p>' + post.selftext +'</p>');
          var comments = jsonString[1].data.children;
          for(var i = 0; i < comments.length; i++) {
            var comment = "<ul class='comment' id='comment"+ i + "'></ul>"
            var author ='<li id="author'+i+'">' + comments[i].data.author + ' </li>';
            var ups ='<span " style"margin: 0 20px;">' + comments[i].data.ups + ' </span>';
            var body ='<li >' + comments[i].data.body + ' </li>';
            $('.post').append(comment);
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
