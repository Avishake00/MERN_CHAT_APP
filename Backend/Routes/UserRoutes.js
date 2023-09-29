const express=require('express');
const router=express.Router();//this helps routes in different endpoints
const {RegisterUser,authUser,allUsers}=require('../Controllers/UserControllers');
const { protect } = require('../middleware/authMiddleware');


router.post('/',RegisterUser);//this is used for sign up setup
router.post('/login',authUser);//this is used for login setup
router.get('/',protect,allUsers)//before use the allUsers we authorized the user and then with the help of allUser we search a user
//or we can write this as -router.route('/).post(RegisterUser).
module.exports=router;