const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
	accessChat,
	fetchChat,
	createGroupChat,
	renameGroup,
	removeFromGroup,
	addToGroup,
} = require("../Controllers/chatControllers");
const router = express.Router();

//all routes
router.route("/").post(protect, accessChat); //this is used to access all the chats
router.route("/").get(protect, fetchChat); //this is used to access the chats of a perticular user
router.route("/group").post(protect, createGroupChat); //this is used to create a group chat
router.route('/rename').post(protect,renameGroup);//this is used to rename a group
router.route('/groupRemove').post(protect,removeFromGroup);//this is used to remove a user from a group
router.route('/groupAdd').post(protect,addToGroup);//this helps to add a user to the group

module.exports = router;
