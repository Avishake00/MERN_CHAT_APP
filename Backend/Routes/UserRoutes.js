const express=require('express');
const router=express.Router();//this helps routes in different endpoints
const {RegisterUser,authUser}=require('../Controllers/UserControllers')


router.post('/',RegisterUser);//this is used for sign up setup
router.post('/login',authUser);//this is used for login setup

module.exports=router;