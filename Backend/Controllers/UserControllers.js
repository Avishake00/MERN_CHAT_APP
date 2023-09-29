const User = require("../models/UserModel");
const expressasyncHandler = require("express-async-handler");
const generateToken = require("../config/GenerateToken");

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

// this is used to search in user data
//like- /api/user?search=avishake
const allUsers = expressasyncHandler(async (req, res) => {
	//this lines denotes-
  //first query or search for the user in the api likelike- /api/user?search=avishake
  //then in those users search with name or email and not get any then return nothing
  //then i
	const keyward = req.query.search
		? {
				$or: [
					{ name: { $regex: req.query.search, $options: "i" } },
					{ email: { $regex: req.query.search, $options: "i" } },
				],
		  }
		: {};

    //to use the req.user_id we need to authorize the user that is curently login cause we save all user data after authorize it
    //se we use a authorization middle ware that will be used before using this allUsers
	const users = await User.find(keyward).find({ _id: { $ne: req.user._id } });
	res.send(users);
});
module.exports = { RegisterUser, authUser, allUsers }; // here RegisterUser is a javaScript function so we export in braces
