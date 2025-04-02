import { memo, useCallback } from "react";
import PropTypes from "prop-types";
import useRequest from "../../hooks/use-request";
import { useDispatch } from "react-redux";
import { addNewChat } from "../../store/chats-slice";
import { openChat } from "../../store/chat-slice";

const Suggestion = memo(function Component({
  member,
  online,
  onToggleSuggestions,
  onRemoveSuggestion,
}) {
  const dispatch = useDispatch();
  const { loading, sendRequest } = useRequest(
    useCallback(
      (payload) => {
        const newChat = payload.payload.conversation;
        dispatch(addNewChat(newChat));
        dispatch(openChat(newChat));
        onToggleSuggestions();
        onRemoveSuggestion(member._id);
      },
      [dispatch, onToggleSuggestions, onRemoveSuggestion, member]
    )
  );

  return (
    <div className="flex px-4 py-2 items-center gap-2">
      <div className="relative h-12 w-12 min-h-12 min-w-12">
        {online && (
          <span
            style={{ width: "10px", height: "10px", backgroundColor: "#0d0" }}
            className="rounded-full absolute bottom-0 right-0 border -translate-x-1/2 -translate-y-1/2"
          ></span>
        )}
        <img
          className={`rounded-full block w-100 h-100 object-cover`}
          src={member.avatar}
          alt=""
        />
      </div>
      <div className="py-2 flex flex-col flex-1 overflow-hidden">
        <h6 className={`text-text-main font-bold`}>{member.name}</h6>
        <p className={`truncate text-text-sec text-xs`}>{member.email}</p>
      </div>
      <button
        disabled={loading}
        onClick={() =>
          sendRequest({
            method: "POST",
            endpoint: `/conversations/create/${member._id}`,
          })
        }
        className="disabled:opacity-50 text-white rounded-full py-1 px-5 bg-main font-semibold"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </div>
  );
});

Suggestion.propTypes = {
  member: PropTypes.object,
  online: PropTypes.bool,
  onToggleSuggestions: PropTypes.func,
  onRemoveSuggestion: PropTypes.func,
};

export default Suggestion;
