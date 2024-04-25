import React, { useEffect, useState, useCallback } from "react";
import classNames from "classnames";

export const ListItem = ({
  key,
  todo,
  completed,
  id,
  deleteBtnPos = 100,
  isDeleted = false,
}: any) => {
  const [delFull, setDelFull] = useState(false);
  // Only recreates the function when neccessary
  const handleClick = useCallback(() => {}, []);

  const statusClasses = classNames({
    "todo__list-item__status": true,
    "todo__list-item__status--complete": completed,
  });

  useEffect(() => {
    if (deleteBtnPos < 50) {
      setDelFull(true);
    }
  }, [deleteBtnPos]);

  useEffect(() => {
    setDelFull(false);
  }, [delFull]);

  return (
    <li
      key={id}
      data-id={id}
      aria-label="pie"
      onClick={handleClick}
      className="todo__list-item"
      style={
        {
          // opacity: delFull ? 0.2 : 1,
          // display: isDeleted ? "none" : "flex",
        }
      }
    >
      <div className="col col--fill col--gap">
        <p className="c-type c-type--sm">{todo}</p>
      </div>
      <div>
        <span
          className={statusClasses}
          aria-label={completed ? "Checked" : "Unchecked"}
        ></span>
      </div>
      <button
        style={{
          transform: `translateX(${delFull ? 0 : deleteBtnPos}%)`,
        }}
        className="todo__list-item__delete"
      >
        Deleting...
      </button>
    </li>
  );
};

export default { ListItem };
