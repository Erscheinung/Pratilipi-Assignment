
Link: https://murmuring-oasis-58266.herokuapp.com/ 

[Some errors faced due to which the DB has been kept local, which may cause problems during authentication on the link provided]


In any case, the interim logic for displaying viewCount and liveViewers:

```
app.get("/stories/:id",isLoggedIn,function(req,res){
    //find the story with provided ID
    Story.findById(req.params.id).exec(function(err,foundStory){
       if(err){
           console.log('not found');
       } 
       else {
            var Username = ""+req.user.username+"";
            var articleId = ""+req.params.id+"";
            User.find({$and:[
                    {username: Username},
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
                        console.log('already visited')
                        // add article id value to User's articleId to remember that the page has been visited
                        
                        //regardless, increment CurrentViewers, decrement on logout/client connection closed
                    }
                    else {
                        console.log('not visited')
                        //if not visited, increment totalViews value and update in
                        //stories Schema
                        viewCount = viewCount + 1;
                        console.log(viewCount)
                        Story.findByIdAndUpdate({id:req.params.id},{totalViews:viewCount})
    
                        //regardless, increment CurrentViewers, decrement on logout/connection closed
                    }
                }
                
            })
            res.render("stories/show", {story: foundStory});
       }
    });
});
```
