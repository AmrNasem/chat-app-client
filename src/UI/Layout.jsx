import PropTypes from "prop-types";

const Layout = ({ children, className }) => {
  return (
    <main className={`${className}`}>
      {children}
      {/* <div className="max-w-[600px] mx-auto px-2.5 py-10">

      </div> */}
    </main>
  );
};

Layout.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
};

export default Layout;
