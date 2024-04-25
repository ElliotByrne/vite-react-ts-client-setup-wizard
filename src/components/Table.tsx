import React, { useEffect, useState } from "react";
import { ClientInterface } from "../interfaces/client.interface";
import { Modal } from "./Modal";
import { FormAddNew } from "./FormAddNew";
import { IconButton } from "./IconButton";
import { Icon } from "./Icon";
import { Checkbox } from "./Checkbox";

export const Table = () => {
  const paginationLimit = 4;
  const [todos, setTodos] = useState<Array<ClientInterface>>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
          //   setStartX(0);
          //   setMouseDownTarget({ element: null, id: "0" });
          //   setCursorPosition(100);
        });
    }, 500);
  };

  // Initial render
  useEffect(() => {
    fetchData();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("table", isModalOpen);
  }, [isModalOpen]);

  useEffect(() => {
    const highestIdInArray =
      todos.length > 0
        ? todos.reduce((prev, cur) => (cur.id > prev.id ? cur : prev)).id
        : 0;
    if (highestIdInArray > lastFetched) {
      setLastFetched(highestIdInArray);
    }
  }, [todos]);

  const ActionButtons = () => {
    return (
      <>
        <IconButton>
          <Icon icon="bin" />
        </IconButton>
        <IconButton>
          <Icon icon="paperclip" />
        </IconButton>
      </>
    );
  };

  return (
    <div className="table">
      <h1 className="type--lg">TurnPoint client records</h1>
      <div className="table__head">
        <label>Quick actions:</label>
        <IconButton onClick={() => setIsModalOpen(true)}>
          <Icon icon="plus" />
        </IconButton>
        <IconButton>
          <Icon icon="bin" />
        </IconButton>
        <IconButton>
          <Icon icon="refresh" />
        </IconButton>
        <IconButton>
          <Icon icon="download" />
        </IconButton>
      </div>
      <table className="table__table">
        <tr>
          <th>
            <Checkbox />
          </th>
          <th>Client name</th>
          <th>Date of birth</th>
          <th>Main language</th>
          <th>Secondary language</th>
          <th>Primary funding source</th>
          <th>Action</th>
        </tr>
        <tr>
          <td>
            <Checkbox />
          </td>
          <td>Alfreds Futterkiste</td>
          <td>07/06/1996</td>
          <td>English</td>
          <td>German</td>
          <td>NDIS</td>
          <td>
            <ActionButtons />
          </td>
        </tr>
        <tr>
          <td>
            <Checkbox />
          </td>
          <td>Alfreds Futterkiste</td>
          <td>07/06/1996</td>
          <td>Romanian</td>
          <td>English</td>
          <td>HCP</td>
          <td>
            <ActionButtons />
          </td>
        </tr>
        <tr>
          <td>
            <Checkbox />
          </td>
          <td>Alfreds Futterkiste</td>
          <td>07/06/1996</td>
          <td>Vietnamese</td>
          <td></td>
          <td>CHSP</td>
          <td>
            <ActionButtons />
          </td>
        </tr>
        <tr>
          <td>
            <Checkbox />
          </td>
          <td>Alfreds Futterkiste</td>
          <td>07/06/1996</td>
          <td>Adnyamathanha</td>
          <td>English</td>
          <td>DVA</td>
          <td>
            <ActionButtons />
          </td>
        </tr>
        <tr>
          <td>
            <Checkbox />
          </td>
          <td>Alfreds Futterkiste</td>
          <td>07/06/1996</td>
          <td>Dhuwal</td>
          <td></td>
          <td>HACC</td>
          <td>
            <ActionButtons />
          </td>
        </tr>
      </table>
      {error && <p>{error}</p>}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="type--lg">Add a new client</h2>
        <p className="type type--sm">
          Please ensure you have prior permission to add client records before
          submitting this form.
        </p>
        <FormAddNew
          handleClose={() => {
            setIsModalOpen(false);
          }}
          postData={postData}
        />
      </Modal>
    </div>
  );
};

export default { Table };
