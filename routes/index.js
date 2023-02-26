var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {  //requests the homepage 
  res.render("index", { title: "Usage Recorder" }); // looks up index.ejs in the views folder
});

module.exports = router;
