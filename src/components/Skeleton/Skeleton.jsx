import "./Skeleton.css";
import PropTypes from "prop-types";

const Skeleton = ({ className, style, delay }) => {
  return (
    <span
      style={{ animationDelay: `${delay * 150}ms`, ...style }}
      className={`skeleton block ${className}`}
    ></span>
  );
};

Skeleton.propTypes = {
  delay: PropTypes.number,
  style: PropTypes.object,
  className: PropTypes.string,
};
export default Skeleton;
