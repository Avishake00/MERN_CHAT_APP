// messagemodel schema should contain 3 things-
//id ir name of the sender
//data contains in the message
//of which chat it belongs to

const mongoose = require("mongoose");
const User = require("./UserModel");
const Chat = require("./ChatModel");
const MessageSchema = mongoose.Schema(
	{
		sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		content: { type: String, trim: true },
		chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
	},
	{
		timestamps: true,
	}
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
