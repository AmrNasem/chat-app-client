import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { getCookie } from "./utils/globals";
import { login } from "./store/auth-slice";
import Header from "./components/Header";
import Home from "./pages/Home";
import {
  on,
  connectSocket,
  disconnectSocket,
  socket,
  emit,
  off,
} from "./utils/socket";
import {
  getMessage,
  readMessages,
  setUnreadMessages,
  sign,
} from "./store/chat-slice";
import {
  addNewTyper,
  removeTyper,
  setLastMessage,
  setOnlineUsers,
  sortChats,
} from "./store/chats-slice";

function App() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [messageSound, setMessageSound] = useState(false);
  const currentChat = useSelector((state) => state.chat.currentChat);
  const [suggestionsDisplayed, setSuggestionsDisplayed] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleToggleSuggestions = useCallback(
    () => setSuggestionsDisplayed((prev) => !prev),
    []
  );

  const handlePlaySound = () => {
    setMessageSound(true);
    setTimeout(() => {
      setMessageSound(false);
    }, 4000);
  };

  useEffect(() => {
    const userData = getCookie("user_data");
    if (userData) dispatch(login({ user: userData }));
    setLoading(false)
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;
    connectSocket();
    return () => {
      if (socket.connected) disconnectSocket();
    };
  }, [user]);

  useEffect(() => {}, [dispatch]);

  useEffect(() => {
    on("getMessage", (msg, receivedAck) => {
      receivedAck();
      handlePlaySound();
      dispatch(setLastMessage(msg));
      dispatch(getMessage({ msg }));
      dispatch(sortChats());
      if (msg.conversation._id === currentChat?._id)
        emit("readMessages", [msg._id], (updatedMessages) =>
          dispatch(readMessages(updatedMessages))
        );
    });
    return () => {
      off("getMessage");
    };
  }, [currentChat, dispatch]);

  useEffect(() => {
    on("connect", () => {
      on("users", (users) => dispatch(setOnlineUsers(users)));

      on("signReceived", (msg) => {
        dispatch(sign(msg));
        dispatch(setLastMessage(msg));
      });

      on("signRead", (msg) => {
        dispatch(sign(msg));
        dispatch(setLastMessage(msg));
      });

      on("unreadMessages", (unread, receiveMsgsAck) => {
        dispatch(setUnreadMessages(unread));
        receiveMsgsAck();
      });

      on("typing", (typer) => {
        dispatch(addNewTyper(typer));
        setTimeout(() => {
          dispatch(removeTyper(typer));
        }, 3000);
      });
    });
  }, [dispatch]);

  if (loading) return;

  return (
    <>
      <Header onToggleSuggestions={handleToggleSuggestions} />
      <Routes>
          <Route
            path="/"
            element={ user ?
              <Home
                onToggleSuggestions={handleToggleSuggestions}
                suggestionsDisplayed={suggestionsDisplayed}
                messageSound={messageSound}
              /> : <Navigate to="/login" />
            }
          />
            {!user && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </>
        )}
        <Route
          path="*"
          element={
            <main>
              <h2 className="text-4xl my-4 text-center">Not Found!</h2>
            </main>
          }
        />
      </Routes>
    </>
  );
}

export default App;
