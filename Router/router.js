const express = require("express");
const router = express.Router();
const signupTemplateCopy = require("../Modals/SignupModal");

router.post("/signup", (req, res) => {
   const signedUpUser =  new signupTemplateCopy({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
   });

   signedUpUser.save((err, data) => { 
      if(err){
         console.log(err);
      }
      res.json(data);
   })   
});

router.post("/login", (req, res) => {
   signupTemplateCopy.find({email: req.body.mail, password: req.body.pwd}).exec()
      .then(doc => {
         if(doc.length === 0){
            res.status(500).json({message: "email & password is required"})
         }
         res.json(doc);
      })
      .catch(err => {
         res.status(500).json({error: err});
      })
})

module.exports = router;