var express = require("express");
var app=express();
var bodyParser=require("body-parser");
app.use(express.static("public"));//tell express to serve the contents of the public dir which has css/js files
app.use(bodyParser.urlencoded({extended:true})); // tells to use body-parser

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/siamdb", { useNewUrlParser: true });

var methodOverride = require("method-override");
app.use(methodOverride("_method"));


var multer = require('multer');
var upload = multer({ dest: 'uploads/' });




// SCHEMA SETUP

var siamSchema = new mongoose.Schema({
    name:String,
    username:String,
    email:String,
    password:String,
    mobile:String,
    team:[String],
    member:String,
    imageurl:String 
    
});
var Siam = mongoose.model("Siam",siamSchema);
// Siam.create(
//     { name:"Pranav",
//         username:"pranav_01",
//        email:"iampranavkr@gmail.com",
//         password:"12345a",
//         mobile:"9876543210",
//         team:["Technical","Sponsorship"],
//         member:"Core",
//         imageurl:"C:\Users\Pranav Kumar\Pictures\Screenshots\Screenshot (41).png"

//     },function(err,siam){
//         if(err) {
//             console.log(err);
//         }
//         else{
//             console.log("Newly create member:");
//             console.log(siam);
//         }
//     });

var t=[];
var students=[{name:"Pranav",
username:"pranav1200",
email:"abcd@gmail.com",
password:"1234",
mob:"1234567890",
teams:t,
member:"board",
profilePic:""
}];
    
//New  --new member form
app.get("/member/new",function(req,res){
    
 res.render("SignUp.ejs",{mem:students});
}); 

//Create  --save member to DB
app.post("/member",upload.single('picture'),function(req,res){
    // get data from FORM and store in database
    var name=req.body.name;
    var username = req.body.username;
    var email= req.body.email;
    var mobile= req.body.mobile;
    var member=req.body.member;
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database

    var finalImg = {
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, 'base64')
    };
    
    var newmember={name:name, username:username,email:email,mobile:mobile,member:member,finalImg:image};
    //create a new member
    Siam.create(newmember,function(err,newlyCreated){
        if(err) console.log(err);
        else res.redirect("/member");
    });
});

//Index  --show all member
app.get("/member",function(req,res){
// students.push(req.body);
// console.log(students[0]);
//  res.redirect("/");

    Siam.find({},function(err, allmembers){
        if(err){
            console.log(err)
        }else{
            res.render("list.ejs",{mem:allmembers});
        }
    });
 });


//Show  --Display details of member
app.get("/member/:id",function(req,res){
    //find member with given id
    Siam.findById(req.params.id,function(err,foundMember){
        if(err)
        {
            console.log(err);
        }else{
            res.render("showpage.ejs",{mem:foundMember});
         
        }
    });
   
});

//EDIT ROUTE
app.get("/member/:id/edit", function (req, res) {
    Siam.findById(req.params.id, function (err, foundMember) {
        if (err) {
            console.log(err);
        } else {
            res.render("edit.ejs", { mem: foundMember });
        }
    });

});

//UPDATE ROUTE
app.put("/member/:id",function(req,res){
     Siam.findByIdAndUpdate(req.params.id ,
            {
               
                name : req.body.name,
             username : req.body.username,
             email : req.body.email,
                mobile : req.body.mobile,
             member : req.body.member
            }, function (err, updatedMember) {
                if (err) console.log(err);
                else {
                    
                    res.redirect('/member/' + req.params.id);
                }
            });
        

});
   
//DELETE ROUTE
app.delete("/member/:id",function (req,res) {
    Siam.findByIdAndRemove(req.params.id,function(err){
        if(err) console.log(err);
        else{
            res.redirect("/member");
        }
    }); 
});


// app.put("/member/:id/edit", function (req, res) {


app.listen(3000,function(){
    console.log("serving port 3000");
});
