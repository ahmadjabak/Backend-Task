const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
bcrypt = require("bcrypt");

//login or sgin in.
router.post(
    "/login",
    check("username", "username is required").notEmpty().trim(),
    check("password", "password is required")
      .notEmpty()
      .trim(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors, message: "Error" });
      }
      const { username, password } = req.query;
      try {
        const admin = await User.findOne({ username: username});
        const bycrypt=await admin.comparePassword(password);
        console.log(bycrypt)
        if (admin&&bycrypt===true ) {
            
          res.json({
            _id: admin.id,
            name: admin.firstName+" "+admin.lastName,
            token: generateToken(admin._id),
          });
        } else {
            
          res.status(400).json({ error: "Invalid credentials" });
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  );

//logout.
  router.put("/logout",auth, function (req, res) {
    const authHeader = req.headers["authorization"];

    jwt.sign(authHeader, "", { expiresIn: 1 } , (logout, err) => {
    if (logout) {
    res.send({msg : 'You have been Logged Out' });
    } else {
    res.send({msg:'Error'});
    }
    });
    });

  const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
  };

  router.post("/adduser",auth,
  check("username", "usernamename should be provided").not().isEmpty(),
    check("password", "password should be provided").not().isEmpty(),
    check("firstName", "First name should be provided").not().isEmpty(),
    check("lastName", "Last name should be provided").not().isEmpty(),
    async (req, res) => {
        //check all fields are not empty.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        const { firstName, lastName, username, password } = req.body
        try {
            const user = new User({
                username, 
                password,
                firstName, 
                lastName 
                
            });
            await user.save();
            message = "User Added Successfully";
            return res.json(message);
        } catch (err) {
            return res.status(403).json(err.message);
        }
    });

    router.delete('/deleteuser/:id',auth, async(req, res) => {
        try{
            const deleteUser = await User.findOne({
                _id: req.params.id,
            });
            await deleteUser.remove()
            message = "user Deleted Successfully";
            return res.json(message);
} catch (err) {
    return res.status(403).json(err.message);
}
    })

router.put('/passwordReset/:username',auth,async (req,res)=>{

    User.findOneAndUpdate(({ username: req.params.username }), {
        $set: {
         password:req.query.password
        }
    }, 
    { new: true }, (err, val) => {
        if (val != null) {
            User.find(({username:req.params.username}),(err, val) => {
                res.send(val)
            })
        } else {
            res.status(404).send({ status: 404, error: true, message: 'the data  does not exist' })
        }
    })
  
  
  
})
  module.exports = router;