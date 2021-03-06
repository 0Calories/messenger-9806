const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[0].text;
      conversations[i] = convoJSON;

      // Count number of unread messages for the logged in user and add it as a property
      convoJSON.unreadMessages = convoJSON.messages.filter(message => !message.isRead && message.senderId !== userId).length;

      // Find the most recent message that the other user in the conversation has seen, and mark it 
      const lastReadMessage = convoJSON.messages.find(message => message.senderId === userId && message.isRead);

      if (lastReadMessage) {
        convoJSON.lastReadMessageId = lastReadMessage.id;
      }
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

// Mark all messages in a conversation as read for the logged in user
router.put("/:conversationId/read-status", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const userId = req.user.id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      where: { id: conversationId }
    });

    if (!conversation) {
      return res.sendStatus(404);
    }
    if (userId !== conversation.user1Id && userId !== conversation.user2Id) {
      return res.sendStatus(403);
    }

    // Find all unread messages in this conversation where senderId != userId, and mark them as read
    await Message.update({ isRead: true }, {
      where: {
        conversationId,
        senderId: {
          [Op.ne]: userId
        },
        isRead: {
          [Op.eq]: false
        }
      }
    });

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
