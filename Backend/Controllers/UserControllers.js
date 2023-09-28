const User=require('../models/UserModel');
const expressasyncHandler=require('express-async-handler')
const generateToken=require('../config/GenerateToken');


//this is used to handle all the things at the time of signup
const RegisterUser = expressasyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
  
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please Enter all the Feilds");
    }
  
    const userExists = await User.findOne({ email });
  
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
  
    const user = await User.create({
      name,
      email,
      password,
      pic,
    });
  
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("User not found");
    }
  });


//this is used to check all the queries at the time of login
const authUser = expressasyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // user.matchPassword must be use for those users whose email is exist so here we use the upperline's user 
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});
module.exports={RegisterUser,authUser}; // here RegisterUser is a javaScript function so we export in braces