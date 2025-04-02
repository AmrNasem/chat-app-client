import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  error: null,
  chats: null,
  onlineUsers: [],
  typers: [],
};

export const fetchChats = createAsyncThunk("chats/fetchChats", async () => {
  const res = await fetch(`/api/conversations`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
});

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
    setLastMessage(state, action) {
      const lastMessage = action.payload;

      if (!state.chats) return;

      if (
        !state.chats.find((chat) => chat._id === lastMessage.conversation._id)
      ) {
        state.chats.unshift(lastMessage.conversation);
        return;
      }

      state.chats = state.chats.map((chat) =>
        chat._id === lastMessage.conversation._id
          ? { ...chat, lastMessage }
          : chat
      );
    },
    addNewTyper(state, action) {
      const newTyper = action.payload;
      const typerExists = state.typers.find(
        (typer) =>
          typer.conversation._id === newTyper.conversation._id &&
          typer.member._id === newTyper.member._id
      );

      if (!typerExists) state.typers.push(newTyper);
    },
    removeTyper(state, action) {
      const removedTyper = action.payload;
      state.typers = state.typers.filter(
        (typer) =>
          typer.conversation._id !== removedTyper.conversation._id ||
          typer.member._id !== removedTyper.member._id
      );
    },
    addNewChat(state, action) {
      if (state.chats) state.chats.unshift(action.payload);
    },
    sortChats(state) {
      if (state.chats)
        state.chats.sort(
          (a, b) =>
            new Date(b.lastMessage.createdAt).getTime() -
            new Date(a.lastMessage.createdAt).getTime()
        );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload.payload.conversations.sort(
          (a, b) =>
            new Date(b.lastMessage?.createdAt).getTime() -
            new Date(a.lastMessage?.createdAt).getTime()
        );
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setOnlineUsers,
  setLastMessage,
  addNewTyper,
  removeTyper,
  addNewChat,
  sortChats,
} = chatsSlice.actions;

export default chatsSlice.reducer;
