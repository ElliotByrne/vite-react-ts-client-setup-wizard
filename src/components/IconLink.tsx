import { ReactNode } from "react";

interface IconButton extends React.ComponentProps<"a"> {
  children: ReactNode;
}

export const IconLink = ({ children, ...props }: IconButton) => {
  return (
    <a className="button button--icon" {...props}>
      {children}
    </a>
  );
};

export default { IconLink };
