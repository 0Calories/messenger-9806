import React, { useState, useEffect } from "react";
import { Box, Chip } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { markConversationRead } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    },
    fontWeight: "bold"
  }
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation, user } = props;
  const { otherUser } = conversation;
  const [unreadMessages, setUnreadMessages] = useState(0);

  const handleClick = (conversation) => {
    props.setActiveChat(conversation.otherUser.username);
    props.markConversationRead(conversation);
  };

  useEffect(() => {
    setUnreadMessages(conversation.messages.filter(message => message.senderId !== user.id && !message.isRead).length);
  }, [conversation, user]);

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />

      {unreadMessages > 0 &&
        <Chip
          label={unreadMessages}
          size="small"
          color="primary"
        />
      }

    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    markConversationRead: (conversation) => {
      dispatch(markConversationRead(conversation));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
