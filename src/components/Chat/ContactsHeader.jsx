import { useDispatch, useSelector } from "react-redux";
import useRequest from "../../hooks/use-request";
import { useCallback } from "react";
import { logout } from "../../store/auth-slice";
import { useNavigate } from "react-router-dom";

function ContactsHeader() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, sendRequest } = useRequest(
    useCallback(() => {
      navigate("/login");
      dispatch(logout());
    }, [dispatch, navigate])
  );

  return (
    <div className="bg-white shadow-md flex px-3 py-2 items-center gap-2">
      <div className="relative h-12 w-12 min-h-12 min-w-12">
        <span
          style={{ width: "10px", height: "10px", backgroundColor: "#0d0" }}
          className="rounded-full absolute bottom-0 right-0 border -translate-x-1/2 -translate-y-1/2"
        ></span>
        <img
          className={`rounded-full block w-100 h-100 object-cover`}
          src={user.avatar}
          alt=""
        />
      </div>
      <div className="py-2 flex flex-col flex-1 overflow-hidden">
        <h6 className={`text-text-main font-bold`}>
          {user.name} <span className="text-text-sec font-normal">(You)</span>
        </h6>
        <p className={`truncate text-text-sec text-xs`}>{user.email}</p>
      </div>
      <button
        disabled={loading}
        onClick={() =>
          sendRequest({
            method: "POST",
            endpoint: `/users/logout`,
          })
        }
        className="disabled:opacity-50 rounded-full py-1 px-5 border text-red-500 border-red-500 font-semibold"
      >
        Logout
      </button>
    </div>
  );
}

export default ContactsHeader;
