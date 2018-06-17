var express=require("express");
var router  = express.Router({mergeParams: true});
var campground = require("../models/campground.js");
var comment = require("../models/comment.js");
var middleware=require("../middleware");

router.get("/",middleware.isLogin,function(req,res){
    campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
    }
    })
});
router.post("/",middleware.isLogin,function(req,res){
    // looking post id
    campground.findById(req.params.id,function(err,campground){
        if(err){
            req.flash("error","Something is wrong!");
            res.redirect("/campgrounds");
        }else{
            comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    // add user +id and save
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfully comment add!");
                    res.redirect("/campgrounds/"+campground._id);
                }
            })
        }
    })
    // create new comment
    // connect new campground
    // redirect campground show page

});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkcommentownership, function(req, res){
    comment.findById(req.params.id,function(err,foundcamp){
        if(err){
            console.log(err);
            req.flash("error",err);
            
            return res.redirect("back");
        }
        comment.findById(req.params.comment_id, function(err,foundComment){
            if(err){
                res.redirect("back");
            } else {
              res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
 });
// COMMENT UPDATE
router.put("/:comment_id",middleware.checkcommentownership, function(req, res){
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id );
       }
    });
 });

 // COMMENT DESTROY ROUTE
router.delete("/:comment_id",middleware.checkcommentownership, function(req, res){
    //findByIdAndRemove
    comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success","Comment deleted!");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});


module.exports=router;