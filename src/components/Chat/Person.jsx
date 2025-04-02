import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDate } from "../../utils/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import PropTypes from "prop-types";
import { openChat } from "../../store/chat-slice";

const Person = memo(function Component({
  chat,
  onToggleAside,
  online,
  unread,
  isLastMessageReceived,
  isLastMessageRead,
  typer,
}) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const { currentChat, unreadMessages } = useSelector((state) => state.chat);
  const isActive = chat._id === currentChat?._id;

  return (
    <div
      onClick={() => {
        onToggleAside();
        if (isActive) return;
        dispatch(openChat(chat));
      }}
      className={`hover:border-text-sec border-transparent border duration-150 rounded-xl shadow-lg mx-4 my-2 cursor-pointer p-3 ${
        isActive ? "bg-text-main" : "bg-white"
      } flex gap-3 items-center`}
    >
      <div className="relative h-11 w-11 min-h-11 min-w-11">
        {online && (
          <span
            style={{ width: "10px", height: "10px", backgroundColor: "#0d0" }}
            className="rounded-full absolute bottom-0 right-0 border -translate-x-1/2 -translate-y-1/2"
          ></span>
        )}
        <img
          className={`rounded-full block w-100 h-100 object-cover`}
          src={chat.avatar}
          alt=""
        />
      </div>
      <div className="py-2 flex flex-col flex-1 overflow-hidden">
        <h6
          className={`${isActive ? "text-white" : "text-text-main"} font-bold`}
        >
          {chat.title}
        </h6>
        {typer ? (
          <span className="text-text-sec font-semibold">
            {chat.members.length > 2 ? `${typer.member.name} is` : ""} Typing...
          </span>
        ) : (
          <p
            className={`truncate ${
              unreadMessages.find((uMsg) => uMsg._id === chat.lastMessage?._id)
                ? "font-semibold text-main-from"
                : "text-text-sec"
            }`}
          >
            {chat.lastMessage?.senderId === user._id &&
              (isLastMessageReceived ? (
                <FontAwesomeIcon
                  icon={faCheckDouble}
                  className={`me-2 ${
                    isLastMessageRead ? "text-cyan-400" : ""
                  } text-xs`}
                />
              ) : chat.lastMessage.draft ? (
                <FontAwesomeIcon icon={faClock} className={`me-2 text-xs`} />
              ) : (
                <FontAwesomeIcon icon={faCheck} className={`me-2 text-xs`} />
              ))}
            {chat.lastMessage?.text}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1 items-center">
        {chat.lastMessage && (
          <h6 className="text-xs text-text-sec">
            {getDate(chat.lastMessage.createdAt)}
          </h6>
        )}
        {!!unread && (
          <span
            className={`min-w-5 min-h-5 text-[0.68rem] font-semibold flex items-center justify-center rounded-full ms-1 bg-main text-white`}
          >
            {unread}
          </span>
        )}
      </div>
    </div>
  );
});

Person.propTypes = {
  onToggleAside: PropTypes.func,
  chat: PropTypes.object,
  online: PropTypes.bool,
  isLastMessageReceived: PropTypes.bool,
  isLastMessageRead: PropTypes.bool,
  unread: PropTypes.number,
  typer: PropTypes.object,
};

export default Person;
