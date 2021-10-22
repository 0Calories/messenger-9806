const Sequelize = require("sequelize");
const db = require("../db");

const User_Conversation = db.define("user_conversation", {
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = User_Conversation;
