import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import PropTypes from "prop-types";
import { memo } from "react";

const Message = memo(function Component({
  message,
  isMyMessage,
  before,
  after,
  isReceived,
  isRead,
}) {
  return (
    <div
      className={`my-2 font-semibold text-sm ${
        isMyMessage ? "text-right" : "text-left"
      }`}
    >
      <p
        className={`flex items-end py-2 ${
          isMyMessage ? "ms-auto" : "me-auto"
        } w-fit max-w-[80%] ${
          isMyMessage
            ? "bg-main text-white pe-2 ps-5"
            : " px-3 bg-other-message text-text-main"
        }`}
        style={{
          borderRadius: `2rem ${
            isMyMessage ? (after ? (before ? "0 0" : "2rem 0") : "0 2rem") : ""
          } 2rem`,
        }}
      >
        <span>{message.text}</span>
        {isMyMessage &&
          (isReceived ? (
            <FontAwesomeIcon
              icon={faCheckDouble}
              className={`ms-2 ${isRead ? "text-cyan-400" : ""} text-xs`}
            />
          ) : message.draft ? (
            <FontAwesomeIcon icon={faClock} className={`ms-2 text-xs`} />
          ) : (
            <FontAwesomeIcon icon={faCheck} className={`ms-2 text-xs`} />
          ))}
      </p>
      <span className="text-text-sec text-xs">
        {new Date(message.createdAt).toLocaleTimeString([], {
          hour: "numeric",
          minute: "numeric",
        })}
      </span>
    </div>
  );
});

Message.propTypes = {
  before: PropTypes.bool,
  after: PropTypes.bool,
  message: PropTypes.object,
  isMyMessage: PropTypes.bool,
  isReceived: PropTypes.bool,
  isRead: PropTypes.bool,
};

export default Message;
