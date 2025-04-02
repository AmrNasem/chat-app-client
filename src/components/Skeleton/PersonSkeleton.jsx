import Skeleton from "./Skeleton.jsx";
import PropTypes from "prop-types";

const PersonSkeleton = ({ delay, className }) => {
  return (
    <div className={`flex items-center py-2 px-4 gap-2 ${className}`}>
      <Skeleton
        delay={delay}
        style={{ width: "60px", height: "60px" }}
        className="rounded-full"
      />
      <div className="flex-1">
        <Skeleton delay={delay} className="mb-2" />
        <Skeleton delay={delay} />
      </div>
    </div>
  );
};

PersonSkeleton.propTypes = {
  delay: PropTypes.number,
  className: PropTypes.string,
};

export default PersonSkeleton;
