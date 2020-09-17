
Link: https://murmuring-oasis-58266.herokuapp.com/ 

[Some errors faced due to which the currentViewers count and totalViews count aren't updating]

In any case, the logic (that almost works lol) for updating viewCount and liveViewers :

```
//SHOW ROUTE - shows more info about one story
app.get("/stories/:id",isLoggedIn,function(req,res){
    //find the story with provided ID
    Story.findById(req.params.id).exec(function(err,foundStory){
       if(err){
           console.log('not found');
       } 
       else {
            var userid = ""+req.user.id;
            var articleId = ""+req.params.id;
            User.find({$and:[
                    {_id: new ObjectId(userid)},
                    {articlesViewed:articleId}
                    // check if the User has already visited this page
            ]}
            ).exec(function(err,results){
                if(err){
                    console.log(err);
                }
                else{
                    if(results==[]){
                        // if not visited
                        console.log(results)
                        console.log('not visited')
                        // add article id value to User's articleId to remember that the page has been visited
                        User.update(
                            {_id: new ObjectId(userid)},
                            {$push: {articlesViewed:articleId}}
                        );
                        // increment totalViews value if new user and update in DB
                        Story.update(
                            {_id: new ObjectId(req.params.id)},
                            {$inc:{totalViews:1}}
                        )    
                    }
                    else {
                        //if visited, update nothing
                        console.log('already visited')
                    }
                    // for all users, update live view count
                    Story.update(
                        {_id: new ObjectId(req.params.id)},
                        {$inc:{currentViewers:1}}
                    )                                   
                }   
            });
            res.render("stories/show", {story: foundStory});
            // when user closes the page (only way to currently exit viewing a story), decrement live viewer /// count (that can be seen by another user)
            req.on('close', function(){
                Story.update(
                    {_id: new ObjectId(req.params.id)},
                    {$inc: {currentViewers:-1}}
                )  
            });
       }
    });
});
```
