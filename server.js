var express = require("express");
var app = express();

app.use(express.static("./client"));
app.use(express.static("./node_modules"));

app.use(require("body-parser").json());

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/survey-test-app3");
mongoose.Promise = global.Promise;

var userSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
}, {timestamps: true});

mongoose.model("User", userSchema);
var User = mongoose.model("User");

var optionSchema = new mongoose.Schema({
  text: {type: String, minlength: 3},
  votes: {type: Number, default: 0}
});

var surveySchema = new mongoose.Schema({
  _user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  question: { type: String, minlength: 8, required: true},
  options: [optionSchema]
});

mongoose.model("Survey", surveySchema);
var Survey = mongoose.model("Survey");


//
// s.save(function(error){
//   if(error) {console.log(error);}
//   else {
//     console.log("Yay!", s);
//   }
// });


app.get("/users/:username", function(req, res){
  console.log(req.params.username);
  User.findOne({ username: req.params.username}, function(error, user){
    console.log(user);
    res.json({ user: user});
  });

});

app.post("/users", function(req, res){
  console.log(req.body.username);

  var user = new User({username: req.body.username});

  user.save(function(error){
    if(error) {
      console.log(error);
      res.json({ error: error });
    }
    res.json ({user: user});
  });

});

app.post("/surveys", function(req, res){

  var s = new Survey({
    _user: req.body._user,
    question: req.body.question,
    options: req.body.options
  });

  s.save(function(error){
    if(error){
      console.log(error);
      res.json({ error: error });
    }
    res.json({survey:s});
  })


})


app.listen(8000, function() {
  console.log("Listening on 8000");
});
