const express = require("express");
const dotenv = require("dotenv");
cors = require("cors");
const ConnectDB = require("./config/db");
const UserRoutes = require("./Routes/UserRoutes");
const {userNotFound,errorHandle} =require('./middleware/errorMiddleware');
const chatRoutes=require('./Routes/ChatRoutes')
const app = express();
dotenv.config();
// connect to DB using ConnectDB function
ConnectDB();
const port = 4000;

app.use(cors());
app.use(express.json()); //this will helps to take data from frontend to backend as json format
app.get("/", (req, res) => {
	res.send("api is running");
});

//this is used for login and signup routes and send the data to the db
app.use("/api/user", UserRoutes);

// after that we use two error handling middlewares
app.use(userNotFound);
app.use(errorHandle);

//this is used for all the works in the chat page
app.use('/api/chats',chatRoutes);

app.listen({ port }, console.log(`server is running on port ${port}`));
