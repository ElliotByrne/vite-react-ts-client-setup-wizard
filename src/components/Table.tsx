import React, { useCallback, useEffect, useState, useContext } from "react";
import { ClientInterface } from "../interfaces/client.interface";
import { IconButton } from "./IconButton";
import { IconLink } from "./IconLink";
import { Icon } from "./Icon";
import { Checkbox } from "./Checkbox";
import { Loading } from "./Loading";
import { WizardContext } from "../global-state/WizardContext";
import { ModalContext } from "../global-state/ModalContext";

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
  const [wizardContext, setWizardContext] = useContext(WizardContext);
  const [modalContext, setModalContext] = useContext(ModalContext);

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

  const handleDelete = (id: string | Array<string>) => {
    if (typeof id === "string") {
      console.log("stirng");
    }
  };

  const ActionButtons = () => (
    <div className="table__actions">
      <IconButton>
        <Icon icon="bin" />
      </IconButton>
      <IconButton onClick={(e) => handleCopy(e)} data-wizard={8}>
        <Icon icon="paperclip" />
      </IconButton>
    </div>
  );

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

      const clientData = JSON.stringify(
        data.filter((el) => el.id === targetId)[0]
      );

      navigator.clipboard.writeText(clientData);
    }
  };

  const startWizard = useCallback(() => {
    setWizardContext(1);
  }, [setWizardContext]);

  const TableContents = () => {
    return data.map((el, i) => {
      return (
        <tr
          data-clientid={el.id}
          key={el.id}
          data-wizard={i === 0 ? 4 : undefined}
        >
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
      <div className="table__top col col--gap col--row col--align-center">
        <div className="col col--fill">
          <h1 className="type--lg">TurnPoint Client Records</h1>
        </div>
        <div className="col">
          <IconButton onClick={() => startWizard()}>
            <Icon icon="question-mark" />
          </IconButton>
        </div>
      </div>

      <div className="table__head">
        <label>Quick actions:</label>
        <IconButton onClick={() => setModalContext(true)} data-wizard={1}>
          <Icon icon="plus" />
        </IconButton>
        <IconButton data-wizard={5}>
          <Icon icon="bin" />
        </IconButton>
        <IconButton onClick={() => fetchData()} data-wizard={6}>
          <Icon icon="refresh" />
        </IconButton>
        <IconLink id="download" {...downloadAttrs} data-wizard={7}>
          <Icon icon="download" />
        </IconLink>
      </div>
      <table className="table__table" onClick={(e) => handleTableClick(e)}>
        <thead>
          <tr>
            <th></th>
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

      {loading && <Loading />}
    </div>
  );
};

export default { Table };
