import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  error: null,
  currentChat: null,
  messages: null,
  unreadMessages: [],
  // socket: null,
  // onlineUsers: null,
  // lastMessage: null,
};

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (conversationId) => {
    const res = await fetch(`/api/messages/${conversationId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    return data;
  }
);

const messages = createSlice({
  name: "messages",
  initialState,
  reducers: {
    openChat(state, action) {
      const chat = action.payload;
      state.currentChat = chat;
      state.loading = true;
    },
    closeChat(state) {
      state.currentChat = null;
      state.messages = null;
    },
    getMessage(state, action) {
      const { msg, oldId } = action.payload;

      if (oldId) {
        if (state.messages)
          state.messages = state.messages.map((message) =>
            message._id === oldId ? msg : message
          );
        return;
      }

      if (state.messages && state.currentChat?._id === msg.conversation._id)
        state.messages.push(msg);
      else state.unreadMessages.push(msg);
    },
    sign(state, action) {
      const message = action.payload;

      if (state.messages)
        state.messages = state.messages.map((msg) =>
          msg._id === message._id ? message : msg
        );
    },
    readMessages(state, action) {
      const updatedMessages = action.payload;
      if (state.messages) {
        state.messages = state.messages.map(
          (msg) =>
            updatedMessages.find((updatedMsg) => updatedMsg._id === msg._id) ||
            msg
        );
        state.unreadMessages = state.unreadMessages.filter(
          (msg) => !updatedMessages.find((uMsg) => uMsg._id === msg._id)
        );
      }
    },
    setUnreadMessages(state, action) {
      state.unreadMessages = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  openChat,
  closeChat,
  getMessage,
  sign,
  readMessages,
  setUnreadMessages,
} = messages.actions;
export default messages.reducer;
