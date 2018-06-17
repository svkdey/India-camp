// all the middleware gose here
var campground = require("../models/campground.js");
var comment = require("../models/comment.js");
var middlewareObj={};

middlewareObj.checkcampgroundownership=function(req, res, next) {
    if(req.isAuthenticated()){
           campground.findById(req.params.id, function(err, findCampground){
              if(err|| !findCampground){
                req.flash("error","Campground not found");
                  res.redirect("back");
              }  else {
                  // does user own the campground?
               if(findCampground.author.id.equals(req.user._id)||req.user.isAdmin) {
                   next();
               } else {
                    req.flash("error","You don't have the the permission");
                   res.redirect("back");
               }
              }
           });
       } else {
           req.flash("error","You need to Login to do that");
           res.redirect("back");
       }
   };
middlewareObj.checkcommentownership=function(req, res, next) {
    if(req.isAuthenticated()){
           comment.findById(req.params.comment_id, function(err, foundComment){
              if(err|| !foundComment){
                  req.flash("error","comment not found");
                  res.redirect("back");
              }  else {
                  // does user own the campground?
               if(foundComment.author.id.equals(req.user._id)||req.user.isAdmin) {
                   next();
               } else {
                    req.flash("error","you don't have permisson to do that!");
                   res.redirect("back");
               }
              }
           });
       } else {
           res.redirect("back");
       }
   };
middlewareObj.isLogin=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to log in first!");
    res.redirect("/login");
}

module.exports=middlewareObj
