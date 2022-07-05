//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt=require("mongoose-encryption");

const app = express();
app.use(express.static("public"));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, {secret:secret, encryptedFields:['password']});

const User= new mongoose.model('User',userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/register",function(req,res){
    
    const user1= new User({email:req.body.username,password:req.body.password});
    user1.save(function(err){
        if(!err){
            res.render("secrets");
        }else{
            res.send(err);
        }
    });
});

app.post("/login",function(req,res){
    User.findOne({email:req.body.username},function(err,foundUser){
        if(foundUser){
            if(foundUser.password=== req.body.password){
                console.log("user found");
                res.render("secrets");
            }else{
                res.send("password not match");
            }            
        }else{
            res.send("user not found");
        }
    })
});

app.listen(3000,function(){
    console.log("the server is started at 3000");
});