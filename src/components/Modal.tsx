import React, {
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import classNames from "classnames";
import "../App.css";
import { IconButton } from "./IconButton";
import { Icon } from "./Icon";
import { ModalContext } from "../global-state/ModalContext";

interface ModalInterface {
  children: ReactNode | Array<ReactNode> | null;
  open: boolean;
  onClose?: () => void;
}

export const Modal = ({ children, open, onClose }: ModalInterface) => {
  const [_, setModalContext] = useContext(ModalContext);

  const [isOpen, setIsOpen] = useState(open);
  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = () => {
    setModalContext({ isOpen: false });
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const classes = classNames({
    modal: true,
    "modal--open": isOpen,
  });

  return (
    <div className={classes}>
      <div className="modal-inner">
        <span className="modal__close">
          <IconButton onClick={() => handleClose()}>
            <Icon icon="cross" />
          </IconButton>
        </span>
        {children}
      </div>
    </div>
  );
};

export default Modal as FunctionComponent;
