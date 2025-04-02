import Suggestion from "./Suggestion";
import useRequest from "../../hooks/use-request";
import { useCallback, useEffect, useState } from "react";
import PersonSkeleton from "../Skeleton/PersonSkeleton";
import Skeleton from "../Skeleton/Skeleton";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

function Suggestions({ onToggleSuggestions, className }) {
  const [suggestions, setSuggestios] = useState(null);
  const onlineUsers = useSelector((state) => state.chats.onlineUsers);
  const { loading, error, sendRequest } = useRequest(
    useCallback((payload) => setSuggestios(payload.payload.suggestions), []),
    true
  );

  const handleRemoveSuggestion = useCallback(
    (sugId) => setSuggestios((prev) => prev.filter((sug) => sug._id !== sugId)),
    []
  );

  useEffect(() => {
    sendRequest({ endpoint: "/users/suggestions" });
  }, [sendRequest]);

  return (
    <div
      className={`shadow-md xl:max-w-[25%] min-w-80 xl:w-[25%] fixed lg:static top-0 self-stretch h-full lg:h-auto z-10 end-0 flex flex-col bg-white border-s ${className}`}
    >
      <button
        className="text-start p-4 pb-0 text-lg mt-3 me-3 border-0 bg-transparent lg:hidden"
        onClick={onToggleSuggestions}
      >
        <FontAwesomeIcon icon={faClose} />
      </button>
      <h3 className="font-semibold m-6 mb-5 text-text-main text-3xl">
        New people
      </h3>
      <div className="scrollbar-none overflow-auto flex-1">
        {loading ? (
          [...Array(4).keys()].map((i) => (
            <div key={i} className="flex items-center gap-3 py-2 px-4">
              <PersonSkeleton delay={i} className="flex-1 py-0 px-0" />
              <Skeleton delay={i} className="rounded-full w-[70px] h-8" />
            </div>
          ))
        ) : error ? (
          <p className="text-center text-red-500 font-semibold my-2">
            {error.message}
            <button
              onClick={() => sendRequest({ endpoint: "/users/suggestions" })}
              className="bg-main block mx-auto mt-3 px-3 py-2 rounded-full  text-white border-0"
            >
              Try again
            </button>
          </p>
        ) : suggestions.length ? (
          suggestions.map((sug) => (
            <Suggestion
              key={sug._id}
              member={sug}
              online={onlineUsers.includes(sug._id)}
              onToggleSuggestions={onToggleSuggestions}
              onRemoveSuggestion={handleRemoveSuggestion}
            />
          ))
        ) : (
          <p className="text-center font-semibold my-2">
            There are no suggestions yet!
          </p>
        )}
      </div>
    </div>
  );
}

Suggestions.propTypes = {
  onToggleSuggestions: PropTypes.func,
  className: PropTypes.string,
};

export default Suggestions;
