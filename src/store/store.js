import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import chatSlice from "./chat-slice";
import chatsSlice from "./chats-slice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    chat: chatSlice,
    chats: chatsSlice,
  },
});

export default store;
