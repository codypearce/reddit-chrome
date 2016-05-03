function getSubPosts(subreddit, lastPost) {
  if(!lastPost) {
    lastPost = '';
  }
  var xhr = new XMLHttpRequest();
  xhr.open("GET", 'http://www.reddit.com/r/' + subreddit + ".json?" + lastPost, true);
  xhr.onreadystatechange = function() {
   if (xhr.readyState == 4) {
     var sub;
     if(xhr.responseURL.indexOf('/r/') > 0) {
       var str = xhr.responseURL.slice(xhr.responseURL.indexOf('/r/') + 3);
       sub = str.slice(0, str.indexOf('.'));
     }
     $('#title').after('<button id="changeSub" value="'+sub+'">Change Sub</button>')
     $('#changeSub').after('<h2 id=subtitle>' + sub + '</h2>');
     $('#subtitle').after('<div id="reddit-content"></div>');

     var jsonString = JSON.parse(xhr.responseText)
     var posts = jsonString.data.children;
     for(var i = 2; i < posts.length; i++) {
       var post = '<div class="post" id="'+ posts[i].data.name + '"></div>';
       var title = '<a href="' + posts[i].data.url + '" id="'+posts[i].data.name+' " class="postTitle postLink">' + posts[i].data.title + '</a>';
       var upvotes = '<span class="postUps">' + posts[i].data.ups + '</span>';
       var subby = '<span class="postSub">r/' + posts[i].data.subreddit + '</span>';
       var author = '<a class="postSub" id="userAccount" href="https://www.reddit.com/user/'+posts[i].data.author+'">by ' + posts[i].data.author + '</a>';
       var commentLink = '<a class="postSub postLink" id="'+posts[i].data.name+'" href="https://www.reddit.com'+ posts[i].data.permalink + '">' + posts[i].data.num_comments + ' comments</a>';
       $('#reddit-content').append(post);
       $('#' +posts[i].data.name).append(upvotes);
       $('#' +posts[i].data.name).append(title);
       $('#' +posts[i].data.name).append(subby);
       $('#' +posts[i].data.name).append(author);
       $('#' +posts[i].data.name).append(commentLink);
     }
     var lastPost = $('.post').last().attr("id");
     var loadMore = '<a id="loadMore" href="http://www.reddit.com/r/'+sub+'.json?'+lastPost+'" >Load More</a>';
     $('#reddit-content').append(loadMore);
   }
  }
  xhr.send();
}
getSubPosts('all');
// Choose sub name
$(document).ready(function(){
   $('body').on('click', '#changeSub', function(){
     var sub = this.value;
     $('#title').after('<input name="sub" type="text" id="subInput"/>');
     $('#subInput').after('<button type="submit" id="subSubmit">Submit</button');
     $('#changeSub').remove();
   });
 });

 // Change Sub
 $(document).ready(function(){
    $('body').on('click', '#subSubmit', function(){
      var sub = $('#subInput').val();
      $('#subInput').remove();
      $('#subSubmit').remove();
      $('#reddit-content').remove();
      $('#subtitle').remove();
      getSubPosts(sub);
    });
  });


// Load More
$(document).ready(function(){
   $('body').on('click', '#loadMore', function(){
     $('.post').remove();
     $('#subtitle').remove();
     $('#changeSub').remove();
     $('#loadMore').remove();
     var sub;
     if(this.href.indexOf('/r/') > 0) {
       var str = this.href.slice(this.href.indexOf('/r/') + 3);
       sub = str.slice(0, str.indexOf('.'));
     }
     var lastPost = '?count=25&after=' + this.href.slice(this.href.indexOf('?')+1);
     getSubPosts(sub, lastPost);
   });
 });

// Get and Display Post Comments
$(document).ready(function(){
   $('body').on('click', '.postLink', function(){
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
