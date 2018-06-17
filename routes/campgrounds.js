var express=require("express");
var router=express.Router();
var campground = require("../models/campground");
var middleware=require("../middleware");
var multer = require('multer');
require('dotenv').config();
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dss3hwih5', 
  api_key:process.env.DB_APIKEY, 
  api_secret:process.env.DB_SECRETKEY, 
});

router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        campground.find({name: regex}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              if(allCampgrounds.length < 1) {
                  noMatch = "No campgrounds match that query, please try again.";
              }
              res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
           }
        });
    } else {
        // Get all campgrounds from DB
        campground.find({}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
           }
        });
    }
});
// creating new camp ground
router.post("/",middleware.isLogin,upload.single('image'),function(req,res){
    cloudinary.uploader.upload(req.file.path, function(result) {
        // add cloudinary url for the image to the campground object under image property
        req.body.campground.image = result.secure_url;
        // add author to campground
        req.body.campground.author = {
          id: req.user._id,
          username: req.user.username
        }
        campground.create(req.body.campground, function(err, campground) {
          if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          res.redirect('/campgrounds/' + campground.id);
        });
      });
});
// new app route
router.get("/new",middleware.isLogin,function(req,res){
    res.render("campgrounds/new");
});
// show campgrounds
//SHOW route- id route should be after /new else id willbe taking new as id
router.get("/:id",function(req,res){
    campground.findById(req.params.id).populate("comments").exec(function(err,foundcamp){
        if(err|| !foundcamp){
            req.flash("error","campground does not exist");
            return res.redirect("back");
        }else{
            console.log(foundcamp);
            res.render("campgrounds/show.ejs",{campground:foundcamp});
        }
    })
});

// edit campground route
router.get("/:id/edit",middleware.checkcampgroundownership,function(req,res){
    // is user loggedin?
    // does user own campgrounds
    // other wise redirect
    
        campground.findById(req.params.id,function(err,findcampground){
        res.render("campgrounds/edit",{campground:findcampground});
    });
}); 

// update campground route
router.put("/:id",middleware.checkcampgroundownership,function(req,res){
    campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatecampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            console.log(updatecampground);
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
// destroy campground route

router.delete("/:id",middleware.checkcampgroundownership,function(req,res){
    campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



module.exports=router;