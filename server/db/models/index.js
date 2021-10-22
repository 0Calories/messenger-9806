const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const User_Conversation = require("./user_conversations");

// associations

User.belongsToMany(Conversation, { through: User_Conversation });
Conversation.belongsToMany(User, { through: User_Conversation });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);
Message.belongsToMany(User, { through: "message_readers" });
User.belongsToMany(Message, { through: "message_readers" });

module.exports = {
  User,
  Conversation,
  Message
};
