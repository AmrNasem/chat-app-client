import Person from "./Person";
import classes from "./Contacts.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import PersonSkeleton from "../Skeleton/PersonSkeleton";
import PropTypes from "prop-types";
import { fetchChats } from "../../store/chats-slice";
import ContactsHeader from "./ContactsHeader";

const Contacts = ({ className, onToggleAside }) => {
  const user = useSelector((state) => state.auth.user);
  const { loading, error, chats, onlineUsers, typers } = useSelector(
    (state) => state.chats
  );
  const [filteredChats, setFilteredChats] = useState([]);

  const unreadMessages = useSelector((state) => state.chat.unreadMessages);
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  useEffect(() => {
    if (chats) setFilteredChats(chats);
  }, [chats]);

  const handleSearch = (e) => {
    if (chats && e.target.value.trim())
      setFilteredChats(
        chats.filter((chat) =>
          chat.title
            .toLowerCase()
            .includes(e.target.value.trim().toLocaleLowerCase())
        )
      );
    else setFilteredChats(chats);
  };

  return (
    <aside
      className={`flex max-w-[30%] xl:max-w-[25%] w-[30%] xl:w-[25%] bg-aside flex-col items-start md:block overflow-auto scrollbar-none ${classes.aside} ${className}`}
    >
      <button
        className="py-3 px-4 ms-auto text-lg border-0 bg-transparent lg:hidden"
        onClick={onToggleAside}
      >
        <FontAwesomeIcon icon={faClose} />
      </button>
      <ContactsHeader />
      <h3 className="font-semibold m-6 mb-3 text-text-main text-3xl">Chats</h3>
      <form
        onSubmit={handleSearch}
        className="my-5 mx-4 flex gap-3 bg-white py-2 px-3 rounded-full shadow-md border border-transparent duration-150 has-[input:focus]:border-main-from"
      >
        <button className="text-text-main bg-transparent border-0">
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <input
          className="w-full outline-none"
          type="text"
          placeholder="Search"
          onChange={handleSearch}
        />
      </form>
      <div className=" flex-1 overflow-auto scrollbar-none">
        {loading ? (
          [...Array(4).keys()].map((i) => <PersonSkeleton key={i} delay={i} />)
        ) : error ? (
          <p className="text-center text-red-500 font-semibold my-2">
            {error}
            <button
              onClick={() => dispatch(fetchChats())}
              className="bg-main block mx-auto mt-3 px-3 py-2 rounded-full  text-white border-0"
            >
              Try again
            </button>
          </p>
        ) : chats.length ? (
          filteredChats.length ? (
            filteredChats.map((chat, i) => {
              const online = !!onlineUsers.find((onlineUser) =>
                chat.members.find(
                  (member) =>
                    member._id === onlineUser && member._id !== user._id
                )
              );
              const condition =
                chat.lastMessage?.conversation.members.length - 1;
              return (
                <Person
                  key={i}
                  chat={chat}
                  online={online}
                  unread={
                    unreadMessages.filter(
                      (msg) => msg.conversation._id === chat._id
                    ).length
                  }
                  isLastMessageReceived={
                    chat.lastMessage?.received.length * 2 >= condition
                  }
                  isLastMessageRead={
                    chat.lastMessage?.read.length * 2 >= condition
                  }
                  onToggleAside={onToggleAside}
                  typer={typers.find(
                    (typer) => typer.conversation._id === chat._id
                  )}
                />
              );
            })
          ) : (
            <p className="text-center font-semibold my-2">No matched chats.</p>
          )
        ) : (
          <p className="text-center font-semibold my-2">
            You have no chats yet!
          </p>
        )}
      </div>
    </aside>
  );
};

Contacts.propTypes = {
  onToggleAside: PropTypes.func,
  className: PropTypes.string,
};

export default Contacts;
