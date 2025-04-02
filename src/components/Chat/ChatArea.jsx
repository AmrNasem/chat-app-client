import { faBars, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Message from "./Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "../Skeleton/Skeleton";
import {
  fetchMessages,
  getMessage,
  readMessages,
} from "../../store/chat-slice";
import { emit } from "../../utils/socket";
import PropTypes from "prop-types";
import { setLastMessage } from "../../store/chats-slice";
import { getDay } from "../../utils/date";
// import { getMostUnitDiff } from "../../utils/date";

const isMyMessage = (member, user) => member?.senderId === user._id;

const ChatArea = memo(function Component({ style, className, onToggleChats }) {
  const areaRef = useRef();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");
  const { onlineUsers, typers } = useSelector((state) => state.chats);
  const { currentChat, messages, loading, error, unreadMessages } = useSelector(
    (state) => state.chat
  );
  const [messagesSectioned, setMessagesSectioned] = useState([]);
  // const [lastSeen, setLastSeen] = useState(null);

  const online = !!onlineUsers.find((onlineUser) =>
    currentChat.members.find(
      (member) => member._id === onlineUser && member._id !== user._id
    )
  );
  const typer = typers.find(
    (typer) => typer.conversation._id === currentChat._id
  );

  useEffect(() => {
    // Auto scroll to bottom on new message
    if (areaRef.current)
      areaRef.current.scrollTo({
        left: 0,
        top: areaRef.current.scrollHeight,
        behavior: "smooth",
      });

    if (!messages?.length) return;

    // Dividing messages by days
    let oldest = getDay(messages[0].createdAt);
    let arr = [{ text: oldest.text, messages: [messages[0]] }];

    for (let i = 1; i < messages.length; i++) {
      const day = getDay(messages[i].createdAt);
      if (day.days === oldest.days)
        arr[arr.length - 1] = {
          text: oldest.text,
          messages: [...arr[arr.length - 1].messages, messages[i]],
        };
      else {
        oldest = day;
        arr.push({ text: oldest.text, messages: [messages[i]] });
      }
    }

    setMessagesSectioned(arr);
  }, [messages]);

  // // Get last seen
  // useEffect(() => {
  //   emit("lastSeen", currentChat.members, (lastSeenMembers) => {
  //     console.log(lastSeenMembers);
  //     setLastSeen(
  //       getMostUnitDiff(
  //         lastSeenMembers.find(
  //           (member) =>
  //             member.memberId ===
  //             currentChat.members.find((m) => m._id !== user._id)._id
  //         )
  //       )?.date
  //     );
  //   });
  // }, [currentChat, user]);

  // Read unread messages of the current chat
  useEffect(() => {
    if (!messages) return;
    const msgsIds = unreadMessages.flatMap((msg) =>
      msg.conversation._id === currentChat?._id ? [msg._id] : []
    );

    if (msgsIds.length) {
      emit("readMessages", msgsIds, (updatedMessages) =>
        dispatch(readMessages(updatedMessages))
      );
    }
  }, [unreadMessages, messages, currentChat, dispatch]);

  // Handle input change
  const handleChange = (e) => {
    setMessage(e.target.value);
    emit("typeMessage", currentChat);
  };

  // Send new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !messages) return;

    const newMessage = {
      text: message.trim(),
      conversationId: currentChat._id,
    };

    const randomId = Math.random().toString();
    emit("sendMessage", newMessage, (retrievedMessage) => {
      dispatch(getMessage({ msg: retrievedMessage, oldId: randomId }));
      dispatch(setLastMessage(retrievedMessage));
    });

    // Temporary message until sending message is acknowledged
    const temp = {
      ...newMessage,
      _id: randomId,
      createdAt: new Date().toUTCString(),
      senderId: user._id,
      conversation: currentChat,
      draft: true,
      read: [],
      received: [],
    };

    dispatch(
      getMessage({
        msg: temp,
      })
    );
    dispatch(setLastMessage(temp));
    setMessage("");
  };

  return (
    <div style={style} className={`${className} flex flex-col bg-aside`}>
      <div className="flex items-center gap-1 border-s-2 border-aside bg-white px-3 mb-2 py-2 border-b shadow-md shadow-gray-200">
        <button
          className="px-2 py-1 text-lg border-0 bg-transparent lg:hidden"
          onClick={onToggleChats}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className={`flex gap-3 items-center`}>
          <div className="relative h-12 w-12 min-h-12 min-w-12">
            {online && (
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#0d0",
                }}
                className="rounded-full absolute bottom-0 right-0 border -translate-x-1/2 -translate-y-1/2"
              ></span>
            )}
            <img
              className={`rounded-full block w-100 h-100 object-cover`}
              src={currentChat.avatar}
              alt=""
            />
          </div>
          <div className="py-2 flex flex-col flex-1 overflow-hidden">
            <h6 className="text-text-main font-bold">{currentChat.title}</h6>
            {typer ? (
              <p className="text-text-sec font-semibold text-xs">
                {currentChat.members.length > 2
                  ? `${typer.member.name} is`
                  : ""}{" "}
                Typing...
              </p>
            ) : (
              <p className={` text-text-sec text-xs`}>
                {
                  online ? "Online" : "Offline"
                  // : lastSeen
                  // ? `Last seen ${
                  //     lastSeen.amount === 0
                  //       ? "few seconds"
                  //       : `${lastSeen.amount} ${lastSeen.unit}`
                  //   } ago`
                }
              </p>
            )}
          </div>
        </div>
      </div>
      <div
        ref={areaRef}
        className={`p-3 flex-1 overflow-auto bg-white scrollbar-none max-w-full`}
      >
        {loading ? (
          [...Array(4).keys()].map((i) => (
            <Skeleton
              key={i}
              className={`my-6 ${i % 2 ? "ms-auto" : ""} h-4 max-w-[60%]`}
            />
          ))
        ) : error ? (
          <p className="text-center text-red-500 font-semibold my-2">
            {error}
            <button
              onClick={() => {
                if (currentChat) dispatch(fetchMessages(currentChat._id));
              }}
              className="bg-main block mx-auto mt-3 px-3 py-2 rounded-full  text-white border-0"
            >
              Try again
            </button>
          </p>
        ) : messages.length ? (
          messagesSectioned.map((section) => (
            <div key={section.text}>
              <h3 className="shadow-sm sticky top-0 w-fit mx-auto px-2 rounded border my-4 text-text-sec text-lg font-semibold">
                {section.text}
              </h3>
              <div>
                {section.messages.map((message, i) => {
                  const condition = message.conversation.members.length - 1;
                  return (
                    <Message
                      before={isMyMessage(section.messages[i - 1], user)}
                      after={isMyMessage(section.messages[i + 1], user)}
                      isMyMessage={isMyMessage(message, user)}
                      key={message._id}
                      message={message}
                      isReceived={message.received?.length * 2 >= condition}
                      isRead={message.read?.length * 2 >= condition}
                    />
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <h4 className="text-center text-3xl relative top-1/2 left-1/2 opacity-75 -translate-x-1/2 -translate-y-1/2">
            Send your first message
          </h4>
        )}
      </div>
      <form
        onSubmit={handleSendMessage}
        style={{ boxShadow: "0 -1px 6px #eee" }}
        className="flex bg-white gap-2 px-3 items-center py-2"
      >
        <button
          style={{
            cursor: message.trim() ? "pointer" : "auto",
          }}
          className={`w-10 h-10 border-0 px-2 bg-main duration-150 rounded-full relative text-white ${
            message.trim() ? "" : "opacity-75"
          }`}
        >
          <FontAwesomeIcon
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
            icon={faPaperPlane}
          />
        </button>

        <div className="has-[input:focus]:border-main-to duration-150 border flex-1 flex gap-1 items-center p-1 rounded-full">
          <input
            autoFocus
            className=" w-full border-0 outline-none bg-transparent p-2"
            type="text"
            placeholder="Message"
            onChange={handleChange}
            value={message}
          />
        </div>
      </form>
    </div>
  );
});

ChatArea.propTypes = {
  onToggleChats: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default ChatArea;
