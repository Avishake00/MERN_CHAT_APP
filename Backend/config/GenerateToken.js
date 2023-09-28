const jwt = require('jsonwebtoken');


const generateToken=(id)=>{
    return jwt.sign({id},"avishake",{
        expiresIn:"50d",
    });
};

module.exports=generateToken;