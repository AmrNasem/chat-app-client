import { useEffect } from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.css";
import useKey from "../hooks/use-key";

const Modal = ({
  className,
  style,
  onClick,
  children,
  bdClassName,
  closing,
}) => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  useKey("Escape", onClick);

  return ReactDOM.createPortal(
    <>
      <div
        className={`${bdClassName} ${classes.modal} ${
          closing ? classes.closing : ""
        } z-[1000] fixed top-0 start-0 w-full h-full`}
        onClick={onClick}
      ></div>
      <Popup style={style} className={className}>
        {children}
      </Popup>
    </>,
    document.getElementById("overlay-root")
  );
};

const Popup = ({ children, className, style }) => {
  return ReactDOM.createPortal(
    <div style={style} className={`z-[1001] ${className}`}>
      {children}
    </div>,
    document.getElementById("popup-root")
  );
};

export default Modal;
