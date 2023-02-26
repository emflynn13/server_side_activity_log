const express = require("express");
const mongoose = require('mongoose');
const usage = require("../models/usage"); 
const usageRouter = express.Router();

// show all records
usageRouter.route("/records")
  .get((req, res, next) => {
    usage.find()     // find entries from database
        .then((usagefound) => {   // usagefound is variable holding all entries
          res.render("currentusage", 
          {usagelist: usagefound,  // entries stored in usagelist which is passed into currentusage.ejs
             title: "Records" });
  })})


usageRouter.route("/create")
  .get((req, res, next) => {
    res.render("newusage.ejs", { title: "Usage Recorder" });
  })

  .post((req, res, next) => {
    // validation of total time per day 
    if ((Number(req.body.educational) + Number(req.body.browsing) + Number(req.body.socialMedia) + Number(req.body.shopping)) > 1440){
      res.end("Can't exceed 1440 minutes per day! Try again.");
    }
    usage.create(req.body) // create an entry from what was typed in the request body
      .then(
        (usagecreated) => {
          usage.find() 
            .then((usagefound) => {
                res.render("currentusage", {
                  usagelist: usagefound,
                  title: "All Usages",
                });
              },
              (err) => next(err)
            )
            .catch((err) => next(err)); 
        },
        (err) => next(err)
      )
      .catch((err) => next(err)); 
  });

  // show specific user records
usageRouter.route('/userReport')
  .get((req, res, next) => {
    res.render("selectUser", { title: "User Report" });
  })
   .post((req, res, next) => {
          console.log(req.body);
          // find name, start date, end date from the body of the form filled out (identified by "name=")
          usage.find({name: req.body.name, date: {$gte: new Date(req.body.startDate), $lt: new Date(req.body.endDate)}}) 
            .then((foundUsage) => { // foundusage stores results
              numEntries= foundUsage.length; // find length of array to use in title

                res.render("userReport", {
                  usagelist: foundUsage,
                  title: "User Report: \n" + req.body.name + " made " + numEntries + " entries",
                });
              },
              (err) => next(err)
            )
            .catch((err) => next(err)); 
  });



 // delete user by id 
usageRouter.route('/delete/:id')
.get(function(req, res) {
  usage.deleteOne({_id: req.params.id}, function(err) { // find usage based on id and delete
    if (err){
      res.end("Sorry there was an error")
    }
     res.redirect("/usage/records");

  })
})

// find usage by id
usageRouter.route('/edit/:id')
.get(function(req, res) {
    console.log(req.params.id);
    usage.findById(req.params.id, function(err, user) {
        if (err) {
            res.end("There has been an error");
        } else {  // if usages are found then render the edit form containing their details
            console.log(user);
            res.render('edit-form', {user: user, title: "Updating: " + user.name + "'s Entry"});
        }
    })
})

// when edit form is submitted this route finishes the update
usageRouter.route('/finishUpdate')
.post(function(req, res) {
  // validation 
  if ((Number(req.body.educational) + Number(req.body.browsing) + Number(req.body.socialMedia) + Number(req.body.shopping)) > 1440){
      res.end("Can't exceed 1440 minutes per day! Try again.");
    }
    else{
      // usage is updated using the id and the details entered in the form
  usage.findByIdAndUpdate(req.body._id, req.body, {runValidators: true}, function(err) {
      if (err) {
          res.end("There has been an error please go back");
      } else {
          res.redirect("/usage/records");
            
        }
    })}
});



module.exports = usageRouter;
