import { createContext } from "react";

export const ModalContext = createContext<{
  isOpen: boolean;
  editing?: false | string | number;
}>({ isOpen: false, editing: false });
