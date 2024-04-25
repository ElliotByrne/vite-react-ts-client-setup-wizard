import React, { useEffect, useState, MouseEvent } from "react";
import { ClientInterface } from "../interfaces/client.interface";
import { ListItem } from "./ListItem";
import { Modal } from "./Modal";
import { FormAddNew } from "./FormAddNew";

export const ToDoList = () => {
  const paginationLimit = 4;
  const [todos, setTodos] = useState<Array<ClientInterface>>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mouseDownTarget, setMouseDownTarget] = useState<{
    element: HTMLElement | null;
    id: string | null | undefined;
  }>({
    element: null,
    id: "0",
  });
  const [startX, setStartX] = useState(0);
  const [lastFetched, setLastFetched] = useState(0);

  const fetchData = () => {
    setTimeout(() => {
      fetch(
        `https://dummyjson.com/todo?limit=${paginationLimit}&skip=${lastFetched}`
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const newTodos = [...todos, ...data.todos].filter(
            (el) => !el.isDeleted
          );
          setTodos(newTodos);
        })
        .catch((err) => {
          console.log(err);
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }, 500);
  };

  const postData = (todo: string, completed: boolean, userId: number) => {
    setLoading(false);

    setTimeout(() => {
      fetch(`https://dummyjson.com/todos/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          todo,
          completed,
          userId,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("new data", data);
          const newTodos = [...todos, data].filter((el) => !el.isDeleted);
          setTodos(newTodos);
        })
        .catch((err) => {
          console.log(err);
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }, 500);
  };

  const delData = (id: number) => {
    setLoading(false);

    setTimeout(() => {
      fetch(`https://dummyjson.com/todos/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("new data", data);
          const newDataSet = [...todos].filter(
            (el) => el.id !== id && !el.isDeleted
          );
          setTodos(newDataSet);
        })
        .catch((err) => {
          console.log(err);
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
          setStartX(0);
          setMouseDownTarget({ element: null, id: "0" });
          setCursorPosition(100);
        });
    }, 500);
  };

  // Initial render
  useEffect(() => {
    fetchData();
  }, []);

  const [cursorPosition, setCursorPosition] = useState(100);

  const handleMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target.closest("li")) {
      setStartX(e.pageX);
      setMouseDownTarget({
        element: target,
        id: target?.closest("li")?.getAttribute("data-id"),
      });
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (e.pageX < startX) {
      if (mouseDownTarget.id) {
        delData(+mouseDownTarget.id);
      }
    } else {
      console.log("remove");
      // setCursorPosition(100);
    }

    setStartX(0);
    setMouseDownTarget({ element: null, id: "0" });
    setCursorPosition(100);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (mouseDownTarget.element && startX > e.pageX) {
      const percentage = (e.pageX / startX) * 100;
      setCursorPosition(percentage - percentage);
    }

    // if (mouseDownTarget && startX < e.pageX) {
    //   let reversePercentage = (startX / e.pageX) * 100;
    //   console.log("opposite", reversePercentage);
    //   // if (reversePercentage > 80) {
    //   //   setCursorPosition(100);
    //   //   setMouseDownTarget(null);
    //   //   setStartX(0);
    //   // } else {
    //   //   setCursorPosition(reversePercentage);
    //   // }

    //   // setCursorPosition(100);
    // }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const highestIdInArray =
      todos.length > 0
        ? todos.reduce((prev, cur) => (cur.id > prev.id ? cur : prev)).id
        : 0;
    if (highestIdInArray > lastFetched) {
      setLastFetched(highestIdInArray);
    }
  }, [todos]);

  return (
    <>
      <div
        className="todo"
        onMouseDown={(e: MouseEvent) => handleMouseDown(e)}
        onMouseUp={(e: MouseEvent) => handleMouseUp(e)}
        onMouseMove={(e) => handleMouseMove(e)}
      >
        <div className="todo__head">
          <div className="col col--fill col--direction-column">
            <h1 className="todo__title">Clients</h1>
          </div>
          <div className="col col--gap">
            <button
              className="button button--green"
              onClick={() => setIsModalOpen(true)}
            >
              Add new
            </button>
            <button className="button button--outline button--green">
              Copy list
            </button>
          </div>
        </div>
        <div>
          <label>Sort by:</label>
          <button className="button button--outline button--green">
            Date added
          </button>
          <button className="button button--outline button--green">A-Z</button>
          <button className="button button--outline button--green">
            Completed
          </button>
        </div>
        {todos && (
          <ul className="todo__list">
            {todos?.map(
              ({
                id,
                todo,
                completed,
                isDeleted,
              }: {
                id: number;
                todo: string;
                completed: boolean;
                isDeleted: boolean;
              }) => (
                <ListItem
                  id={id}
                  todo={todo}
                  completed={completed}
                  deleteBtnPos={
                    mouseDownTarget.id === id.toString() ? cursorPosition : 100
                  }
                  isDeleted={isDeleted}
                />
              )
            )}
          </ul>
        )}
        {!todos && <p>No items on your todo list. Try adding one!</p>}
        <button
          className="button button--green"
          onClick={() => {
            fetchData();
            setLoading(true);
          }}
        >
          Load more {loading && "..."}
        </button>
      </div>

      {loading && <p>Loading your initial todos</p>}

      {error && <p>{error}</p>}
      <Modal open={isModalOpen}>
        <h2>Add a new todo</h2>
        <FormAddNew
          handleClose={() => {
            setIsModalOpen(false);
          }}
          postData={postData}
        />
      </Modal>
    </>
  );
};

export default { ToDoList };
