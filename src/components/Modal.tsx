import React, { ReactNode, useEffect, useState } from "react";
import classNames from "classnames";
import "../App.css";
import { IconButton } from "./IconButton";
import { Icon } from "./Icon";

interface ModalInterface {
  children: ReactNode | Array<ReactNode> | null;
  open: boolean;
  onClose: () => void;
}

export const Modal = ({ children, open, onClose }: ModalInterface) => {
  const [isOpen, setIsOpen] = useState(open);
  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
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
