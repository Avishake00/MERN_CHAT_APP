const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");

//access all chats
const accessChat = expressAsyncHandler(async (req, res, next) => {
	// Extract userId from the request body
	const { userId } = req.body;

	if (!userId) {
		// If userId is not provided in the request, respond with a 400 Bad Request
		console.log("UserId param not sent with request");
		return res.sendStatus(400);
	}

	// Find an existing chat where both req.user._id and req.userId are participants
	let isChat = await Chat.find({
		isGroupChat: false,
		$and: [
			{ users: { $elemMatch: { $eq: req.user._id } } },
			{ users: { $elemMatch: { $eq: req.userId } } },
		],
	})
		.populate("users", "-password") // Populate the users without the password field
		.populate("latestMessage");

	// Populate the sender information for the latestMessages in the chat
	isChat = await User.populate(isChat, {
		path: "latestMessages.sender",
		select: "name pic email",
	});

	if (isChat.length > 0) {
		// If a chat exists, send the first one found
		res.send(isChat[0]);
	} else {
		// If no chat exists, create a new chat
		let chatData = {
			chatName: "sender", // You may want to customize the chat name
			isGroupChat: false,
			users: [req.user._id, userId],
		};

		try {
			// Create a new chat and populate the users without the password field
			const createdChat = await Chat.create(chatData);
			const Fullchat = await Chat.findOne({ _id: createdChat._id }).populate(
				"users",
				"-password"
			);

			// Send the newly created chat as a response
			res.status(200).send(Fullchat);
		} catch (error) {
			// Handle any errors that occur during chat creation
			res.status(400).send({ error: error.message });
		}
	}
});

const fetchChat = expressAsyncHandler(async (req, res) => {
	try {
		Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
			.populate("users", "-password")
			.populate("groupAdmin", "-password")
			.populate("latestMasseges")
			.sort({ updatedAt: -1 })
			.then(async (results) => {
				results = await User.populate(results, {
					path: "latestMessages.sender",
					select: "name pic email",
				});
				res.status(200).send(results);
			});
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
});

const createGroupChat = expressAsyncHandler(async (req, res) => {
	if (!req.body.users || !req.body.name) {
		return res.status(400).send({ message: "Please Fill all the feilds" });
	}

	let users = JSON.parse(req.body.users);

	if (users.length < 2) {
		return res
			.status(400)
			.send("At lease 2 users are required to form a group chat");
	}

	users.push(req.user);

	try {
		const groupChat = await Chat.create({
			chatName: req.body.name,
			users: users,
			isGroupChat: true,
			groupAdmin: req.user,
		});

		const FullGroupChat = await Chat.findOne({ _id: groupChat._id })
			.populate("users", "-password")
			.populate("groupAdmin", "-password");
		res.status(200).json(FullGroupChat);
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
});

const renameGroup = expressAsyncHandler(async (req, res) => {
	const { chatId, chatName } = req.body;

	const updateChat = await Chat.findByIdAndUpdate(
		chatId,
		{
			chatName,
		},
		{
			new: true,
		}
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	if (!updateChat) {
		res.status(404).send("Chat not found");
	} else {
		res.json(updateChat);
	}
});

const addToGroup=expressAsyncHandler(async(req,res)=>{
	const {chatId,userId}=req.body;

	const added=await Chat.findByIdAndUpdate(
		chatId,
		{
			$push:{users:userId},
		},
		{new:true}
	)
	.populate("users", "-password")
		.populate("groupAdmin", "-password");

		if (!added) {
			res.status(404).send("Chat not found");
		} else {
			res.json(added);
		}

})

const removeFromGroup=expressAsyncHandler(async(req,res)=>{
	const {chatId,userId}=req.body;

	const added=await Chat.findByIdAndUpdate(
		chatId,
		{
			$pull:{users:userId},
		},
		{new:true}
	)
	.populate("users", "-password")
		.populate("groupAdmin", "-password");

		if (!added) {
			res.status(404).send("Chat not found");
		} else {
			res.json(added);
		}

})

module.exports = { accessChat, fetchChat, createGroupChat,renameGroup,addToGroup,removeFromGroup};
