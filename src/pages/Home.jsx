import { useDispatch, useSelector } from "react-redux";
import ChatArea from "../components/Chat/ChatArea";
import Contacts from "../components/Chat/Contacts";
import { useCallback, useEffect, useState } from "react";
import useKey from "../hooks/use-key";
import { closeChat, fetchMessages } from "../store/chat-slice";
import notificationSound from "../assets/message-notification.mp3";
// import { emit } from "../utils/socket";
import PropTypes from "prop-types";
import Suggestions from "../components/Chat/Suggestions";

const Home = ({ messageSound, onToggleSuggestions, suggestionsDisplayed }) => {
  const currentChat = useSelector((state) => state.chat.currentChat);
  const [chatsDisplayed, setChatsDisplayed] = useState(false);
  const dispatch = useDispatch();

  const handleToggleChats = useCallback(
    () => setChatsDisplayed((prev) => !prev),
    []
  );

  useEffect(() => {
    if (currentChat) dispatch(fetchMessages(currentChat._id));
  }, [currentChat, dispatch]);

  useEffect(() => () => dispatch(closeChat()), [dispatch]);

  useKey("Escape", () => dispatch(closeChat()));

  return (
    <main className="flex bg-aside pt-2 max-h-[calc(100vh-72px)]">
      <Contacts
        onToggleAside={handleToggleChats}
        className={`${
          chatsDisplayed ? "" : "-translate-x-[500px] lg:-translate-x-0"
        }`}
      />
      {currentChat ? (
        <ChatArea
          className="flex-1"
          onToggleSuggestions={onToggleSuggestions}
          onToggleChats={handleToggleChats}
        />
      ) : (
        <div className="relative bg-white flex-1 flex items-center justify-center">
          <button
            onClick={handleToggleChats}
            className="bg-main p-3 rounded-full font-semibold text-white border-0 lg:hidden absolute left-50 top-50"
          >
            Click on a chat
          </button>
          <h4 className="absolute hidden lg:block text-text-main text-3xl font-semibold">
            Click on a chat
          </h4>
        </div>
      )}
      <Suggestions
        onToggleSuggestions={onToggleSuggestions}
        className={`duration-150 ${
          suggestionsDisplayed ? "" : "translate-x-[500px] lg:translate-x-0"
        }`}
      />
      {messageSound && <audio hidden autoPlay src={notificationSound} />}
    </main>
  );
};

Home.propTypes = {
  messageSound: PropTypes.bool,
  onToggleSuggestions: PropTypes.func,
  suggestionsDisplayed: PropTypes.bool,
};

export default Home;
