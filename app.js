var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    assert      = require('assert'),
    mongoose    = require('mongoose'),
    passport    = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override');
    Campground  = require('./models/campground'),
    Comment     = require('./models/comment'),
    User        = require('./models/user'),
    seedDB      = require('./seeds');

var commentRoutes    = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes      = require('./routes/index');

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB(); //seed the database

// PASSPORT CONFIG
app.use(require('express-session')({
  secret: "The Secret Line",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments/", commentRoutes);

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
