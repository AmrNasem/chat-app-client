import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const Header = ({ onToggleSuggestions }) => {
  const user = useSelector((state) => state.auth.user);
  return (
    <header className="py-5 shadow-md z-10">
      <div className="flex gap-3 justify-between items-center container">
        <h3 className="text-2xl font-semibold">Chat App</h3>
        {user && (
          <button
            onClick={onToggleSuggestions}
            className="rounded-full py-1 px-5 border lg:hidden text-main-from border-main-from font-semibold"
          >
            People
          </button>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  onToggleSuggestions: PropTypes.func,
};

export default Header;
