import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  updateLastSeenMessage
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender, true));
  });

  socket.on("message-seen", (data) => {
    // Ensure that this socket event is intended for the logged in user
    const currentUserId = store.getState().user.id;
    if (currentUserId === data.targetUserId) {
      store.dispatch(updateLastSeenMessage(data.conversationId, data.targetUserId));
    }
  });
});

export default socket;
