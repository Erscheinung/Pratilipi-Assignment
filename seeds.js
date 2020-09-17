var mongoose = require("mongoose");
var Stories = require("./models/stories");
 
var data = [
    {
        title: "A Little Fable", 
        content: "'Alas,' said the mouse, 'the world gets smaller every day. At first it was so wide that I ran along and was happy to see walls appearing to my right and left, but these high walls converged so quickly that I’m already in the last room, and there in the corner is the trap into which I must run.' 'But you’ve only got to run the other way,' said the cat, and ate it.",
        currentViewers: 1,
        totalViews: 1
    },
    {
        title: "The Metamorphosis", 
        content: "As Gregor Samsa awoke one morning from uneasy dreams he found himself transformed in his bed into a gigantic insect.",
        currentViewers: 1,
        totalViews: 1
    },
]
 
function seedDB(){
   //Remove all stories
   Stories.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed stories!");
        data.forEach(function(seed){
            Stories.create(seed, function(err, stories){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a story");
                }
            });
        });
    }); 
}

module.exports = seedDB;