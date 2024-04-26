import React, { useCallback, useEffect, useState, lazy } from "react";
import { ClientInterface } from "../interfaces/client.interface";
import { FormAddNew } from "./FormAddNew";
import { IconButton } from "./IconButton";
import { IconLink } from "./IconLink";
import { Icon } from "./Icon";
import { Checkbox } from "./Checkbox";
import { Modal } from "./Modal";
import { Loading } from "./Loading";

function jsonToCsv(jsonData) {
  let csv = "";
  // Get the headers
  let headers = Object.keys(jsonData[0]);
  csv += headers.join(",") + "\n";
  // Add the data
  jsonData.forEach(function (row) {
    let data = headers.map((header) => JSON.stringify(row[header])).join(","); // Add JSON.stringify statement
    csv += data + "\n";
  });
  return csv;
}

// Mock api data
const clientData = [
  {
    id: "1",
    name: "Alfreds Futterkiste",
    dob: "07/06/1996",
    "primary-language": "English",
    "secondary-language": "English",
    funding: "NDIS",
  },
  {
    id: "2",
    name: "Monkey boy",
    dob: "07/06/1996",
    "primary-language": "English",
    "secondary-language": "English",
    funding: "NDIS",
  },
  {
    id: "3",
    name: "Mr Burns",
    dob: "07/06/1996",
    "primary-language": "English",
    "secondary-language": "English",
    funding: "NDIS",
  },
  {
    id: "4",
    name: "Bailey Stripes",
    dob: "07/06/1996",
    "primary-language": "English",
    "secondary-language": "English",
    funding: "NDIS",
  },
  {
    id: "5",
    name: "Smithers",
    dob: "07/06/1996",
    "primary-language": "English",
    "secondary-language": "English",
    funding: "NDIS",
  },
];

// Mock api promise.
const getData = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 500, clientData);
  });

export const Table = () => {
  const paginationLimit = 4;
  const [data, setData] = useState<Array<ClientInterface>>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState(0);
  const [selectedClient, setSelectedClient] = useState<Array<string>>([]);
  const [csv, setCsv] = useState(null);
  const [downloadAttrs, setDownloadAttrs] = useState({
    href: "",
    download: "clients-csv.csv",
  });

  // Initial render
  useEffect(() => {
    fetchData();
  }, []);

  // When data changes, update CSV download URL with new data
  useEffect(() => {
    if (data && data.length > 0) {
      let csvData = jsonToCsv(data); // Add .items.data
      console.log("cdsv", csvData);
      // Create a CSV file and allow the user to download it
      let blob = new Blob([...csvData], { type: "text/csv" });
      let url = window.URL.createObjectURL(blob);
      const download = "data.csv";

      setDownloadAttrs({ href: url, download });
    }
  }, [data]);

  const fetchData = () => {
    setLoading(true);
    getData()
      .then((res) => {
        console.log("data", res);
        setData(res);
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   const highestIdInArray =
  //     todos.length > 0
  //       ? todos.reduce((prev, cur) => (cur.id > prev.id ? cur : prev)).id
  //       : 0;
  //   if (highestIdInArray > lastFetched) {
  //     setLastFetched(highestIdInArray);
  //   }
  // }, [todos]);

  const handleDelete = (id: string | Array<string>) => {
    if (typeof id === "string") {
      console.log("stirng");
    }
  };

  const ActionButtons = () => {
    return (
      <div className="table__actions">
        <IconButton>
          <Icon icon="bin" />
        </IconButton>
        <IconButton onClick={(e) => handleCopy(e)}>
          <Icon icon="paperclip" />
        </IconButton>
      </div>
    );
  };

  const handleModalVisible = (visible: boolean) => {
    // Do something with the dynamically imported module
    setIsModalOpen(visible);
  };

  const handleTableClick = (e: MouseEvent) => {
    if (e.target instanceof HTMLElement) {
      const targetId = e.target.closest("tr")!.getAttribute("data-clientid")!;
      const currentSelectedClient = selectedClient ? [...selectedClient] : [];

      if (targetId !== null) {
        if (currentSelectedClient.indexOf(targetId) === -1) {
          currentSelectedClient.push(targetId);
        } else {
          currentSelectedClient.splice(
            currentSelectedClient.indexOf(targetId),
            1
          );
        }

        setSelectedClient(currentSelectedClient);
      }
    }
  };

  const handleCopy = (e: MouseEvent) => {
    if (e.target) {
      const targetId = e.target.closest("tr")!.getAttribute("data-clientid")!;
      console.log(e.target);

      const clientData = JSON.stringify(
        data.filter((el) => el.id === targetId)[0]
      );

      navigator.clipboard.writeText(clientData);
    }
  };

  const TableContents = () => {
    return data.map((el) => {
      return (
        <tr data-clientid={el.id} key={el.id}>
          <td>
            <Checkbox checked={selectedClient.indexOf(el.id) > -1} />
          </td>
          <td>{el.name}</td>
          <td>{el.dob}</td>
          <td>{el["primary-language"]}</td>
          <td>{el["secondary-language"]}</td>
          <td>{el.funding}</td>
          <td>
            <ActionButtons />
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="table">
      <h1 className="type--lg">TurnPoint client records</h1>
      <div className="table__head">
        <label>Quick actions:</label>
        <IconButton onClick={() => handleModalVisible(true)}>
          <Icon icon="plus" />
        </IconButton>
        <IconButton>
          <Icon icon="bin" />
        </IconButton>
        <IconButton onClick={() => fetchData()}>
          <Icon icon="refresh" />
        </IconButton>
        <IconLink
          id="download"
          // onClick={() => (window.location = downloadAttrs.href)}
          {...downloadAttrs}
        >
          <Icon icon="download" />
        </IconLink>
      </div>
      <table className="table__table" onClick={(e) => handleTableClick(e)}>
        <thead>
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
        </thead>
        <tbody>
          <TableContents />
        </tbody>
      </table>
      {error && <p>{error}</p>}
      <Modal open={isModalOpen} onClose={() => handleModalVisible(false)}>
        <h2 className="type--lg">Add a new client</h2>
        <p className="type type--sm">
          Please ensure you have prior permission to add client records before
          submitting this form.
        </p>
        <FormAddNew />
      </Modal>
      {loading && <Loading />}
    </div>
  );
};

export default { Table };
