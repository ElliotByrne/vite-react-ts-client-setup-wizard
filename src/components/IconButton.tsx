import { ReactNode } from "react";

interface IconButton extends React.ComponentProps<"button"> {
  children: ReactNode;
}

export const IconButton = ({ children, ...props }: IconButton) => {
  return (
    <button className="button button--icon" {...props}>
      {children}
    </button>
  );
};

export default { IconButton };
