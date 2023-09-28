//this section used to connect the node.js to out mongoDB server

const mongoose=require('mongoose');

//connect to DB
const ConnectDB=async()=>{
    try {
        const conn=await mongoose.connect(`mongodb+srv://Avishake:Taniadas2020@cluster0.immn06y.mongodb.net/?retryWrites=true&w=majority`,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        //if connect then log it
        console.log(`MongoDB Connected :${conn.connection.host}`);
    } 
    //if error occurs then print the error
    catch (error) {
        console.log(`Error:${error.message}`);
        process.exit();
    }
};

module.exports=ConnectDB;