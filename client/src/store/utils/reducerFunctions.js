export const addMessageToStore = (state, payload) => {
  const { message, sender, isIncomingMessage } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };

    newConvo.latestMessageText = message.text;

    if (isIncomingMessage) {
      newConvo.unreadMessages = 1;
    }

    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;

      if (isIncomingMessage) {
        convoCopy.unreadMessages += 1;
      }

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      const fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      convoCopy.unreadMessages = 0;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const markConvoReadInStore = (state, conversation) => {
  return state.map((convo) => {
    if (convo.id === conversation.id) {
      const convoCopy = { ...convo };
      convoCopy.unreadMessages = 0;
      return convoCopy;
    }

    return convo
  });
};

export const updateLastSeenMessageInStore = (state, conversationId) => {
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const convoCopy = { ...convo };

      // Mark the most recent message in the conversation as read
      const lastMessageId = convoCopy.messages[convoCopy.messages.length - 1].id;
      convoCopy.lastReadMessageId = lastMessageId;

      return convoCopy;
    }

    return convo;
  })
};
