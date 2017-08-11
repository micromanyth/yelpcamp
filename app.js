var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var campgrounds = [
  {name: "Salmon Creek", image: "https://farm5.staticflickr.com/4016/4369518024_0f64300987.jpg"},
  {name: "Granite Hill", image: "https://farm9.staticflickr.com/8225/8524305204_43934a319d.jpg"},
  {name: "Mountain Goat's Rest", image: "https://farm3.staticflickr.com/2353/2069978635_2eb8b33cd4.jpg"}
];




// ROUTES
app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image: image}
  campgrounds.push(newCampground);
  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
  res.render("new.ejs");
});






// LISTENERS
var url = 'mongodb://localhost:27017/';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db.close();
});

app.listen(3000, function() {
  console.log("App is running...");
});
