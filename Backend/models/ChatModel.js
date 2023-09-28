//if must contain all the Schema of the chat-
//chatName
//Users
//isGroupChat
//groupAdmin
//latestMasseges

const mongoose = require("mongoose");
const User = require("./UserModel");
const Message = require("./MessageModel");
const ChatSchema = mongoose.Schema(
	{
		chatName: { type: String, trim: true },
		isGroupChat: { type: Boolean, default: false },
		users: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User", //usermodel
			},
		],
		latestMasseges: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message", //messagemodel
		},
		groupAdmin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

const Chat = mongoose.model("Chat", ChatSchema); //here we use the mongoose scheema as chat

module.exports = Chat;
