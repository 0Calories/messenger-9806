import React from "react";
import { Box, Badge } from "@material-ui/core";
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
    paddingRight: 20
  },
  badge: {
    fontWeight: "bold",
    fontWeight: "bold",
    fontSize: 10,
    padding: props => props.conversation.unreadMessages >= 10 ? "0 10px" : "0 8px",
  }
}));

const Chat = (props) => {
  const classes = useStyles(props);
  const { conversation } = props;
  const { otherUser } = conversation;

  const handleClick = (conversation) => {
    props.setActiveChat(conversation.otherUser.username);
    props.markConversationRead(conversation);
  };


  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />

      <Badge
        badgeContent={conversation.unreadMessages}
        size="small"
        color="primary"
        classes={{ badge: classes.badge }}
      />
    </Box>
  );
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

export default connect(null, mapDispatchToProps)(Chat);
