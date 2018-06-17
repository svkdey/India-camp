routings:


name              url                   work                 description
==========================================================================
index        /campgrounds                Get                 homepage...and description of content
new           /campgrounds/new           Get               display form that to be submitted
create        /campgrounds               Post               add the data to db
show          /campground/:id             Get               show one thing particular

#for creating comment by use:

#nested routers is needed:
NEW campgrounds/:id/comments/new    get
CREATE campgrounds/:id/comments        post



==============================================================
user authentication:1
#install package
#define user model!

user authentication:2
#config passport
#add passport route
#add register tamplate

user authentication part:3
#login rotes

log Out part:4
#logout
#hide and show bar!


#authorization
user can edit/chnge his/her camp grounds
edit/dlt button will be hidden!

#edit & deleling comment
delete nd edit button 
provide routes






