const jwt=require('jsonwebtoken');
const User=require('../models/UserModel');
const expressasyncHandler=require('express-async-handler');

//this is used to check that the user currently wants to login is authorized or not
const protect=expressasyncHandler(async(req,res,next)=>{
    let token;
    if(
        req.headers.authorization&&req.headers.authorization.startsWith("Bearer")//here we used Bearer token
    ){
        try {
            //the token after authorization looks like-"Bearer tokenName " so we remove Bearer and take the token id
            token=req.headers.authorization.split(" ")[1];

            const decoded=jwt.verify(token,"avishake"); //then decoded the token id
            req.user=await User.findById(decoded.id).select("-password");//then take the user of that token id without the password cause we dont want to show the password to other user
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized ,token failed");
        }
    }

    //if token is not available then send a error

    if(!token){
        res.status(401);
        throw new Error("Not authorized ,no token");
    }
})

module.exports={protect};