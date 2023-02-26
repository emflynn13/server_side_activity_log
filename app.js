var createError = require("http-errors"); 
var express = require("express"); 
const bodyParser = require("body-parser");
var path = require("path"); 
var cookieParser = require("cookie-parser"); 
var logger = require("morgan"); 
var mongoose = require("mongoose"); 
var indexRouter = require("./routes/index"); 
var usageRouter = require("./routes/usageRouter"); 
var urlencodedParser = bodyParser.urlencoded({extended: false})

var app = express();




app.set("views", path.join(__dirname, "views")); 
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const url = "mongodb://localhost:27017/userInfo"; 
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);


app.use("/", indexRouter); 

app.get("/aboutus", function(req, res){
  res.sendFile(__dirname + '/aboutus.html');
});

app.get("/help", function(req, res){
  console.log(req.query);
  res.sendFile(__dirname + '/help.html');
});

app.use("/usage", usageRouter); 



app.use(function (req, res, next) {
  next(createError(404));
});


app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};


  res.status(err.status || 500);
  res.render("pages/error");
});

module.exports = app; //to expose app as a module
