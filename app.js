const express=require("express");
const app=express();
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
    flash=require("connect-flash");
    passport=require("passport");

const cookieParser = require("cookie-parser"),
    localstrategy=require("passport-local");
    methodoverride=require("method-override");
   
const campground=require("./models/campground");
    comment=require("./models/comment");
    User=require("./models/user");
const seedDB=require("./seeds");
require('dotenv').config();
mongoose.connect(process.env.DB_HOST);
const commentRouters=require("./routes/comments");
const campgroundRouters=require("./routes/campgrounds");
const authRouters=require("./routes/auth");


app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs")
app.use(express.static(__dirname+"/public"));
app.use(methodoverride("_method"));
app.use(cookieParser("secret"));
app.use(flash());
// seedDB();

app.locals.moment = require('moment');
// Passport config
app.use(session({
    secret:"svkdey9",
    resave:false,
    saveUninitialized:false,
   
}));
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new localstrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());

// keeping the user defination ie sm1 is logged in or not!
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});
app.use("/campgrounds",campgroundRouters);
app.use("/campgrounds/:id/comments",commentRouters);
app.use("/",authRouters);


// server listener
app.listen(2000 ||process.env.PORT, process.env.IP,function(){
    console.log("connection establishment started!");
});

