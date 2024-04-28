import React, { useCallback, useEffect, useState, useContext } from "react";
import { IconButton } from "./IconButton";
import { IconLink } from "./IconLink";
import { Icon } from "./Icon";
import { Checkbox } from "./Checkbox";
import { Loading } from "./Loading";
import { WizardContext } from "../global-state/WizardContext";
import { ModalContext } from "../global-state/ModalContext";
import { Modal } from "./Modal";
import { useFetchAllClients } from "../hooks/useFetchAllClients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jsonToCsv } from "../utils/jsonToCsv";

export const Table = () => {
  const [selectedClient, setSelectedClient] = useState<Array<string>>([]);
  const [downloadAttrs, setDownloadAttrs] = useState({
    href: "",
    download: "clients-csv.csv",
  });
  const [deleteModalMetaData, setDeleteModalMetaData] = useState<{
    isOpen: boolean;
    message?: string;
    id: string | Array<string>;
    hideSubmit?: boolean;
  }>({
    isOpen: false,
    id: "0",
    message: "",
    hideSubmit: false,
  });
  const [_, setWizardContext] = useContext(WizardContext);
  const [__, setModalContext] = useContext(ModalContext);
  const { isPending, error, data, refetch } = useFetchAllClients();
  const queryClient = useQueryClient();

  // Handles deleting one or multiple clients.
  const deleteClients = useMutation({
    mutationFn: (ids: Array<string> | string) => {
      // Delete single client
      if (ids && typeof ids === "string") {
        return fetch(`http://localhost:3000/clients/${ids}`, {
          method: "DELETE",
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      }
      // Delete multiple clients using different end point.
      if (ids && typeof ids === "object") {
        console.log(ids);
        return fetch(`http://localhost:3000/clients/delete`, {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: ids,
          }),
        });
      }
      return Promise.reject(
        () =>
          "No client ID or array of client ID's sent for deletion. How did you even manage to do this?!"
      );
    },
    onSuccess: () => {
      refetch();
      setDeleteModalMetaData({
        isOpen: false,
        id: "0",
        message: "",
        hideSubmit: false,
      });
      setSelectedClient([]);

      return async () => {
        await queryClient.invalidateQueries({ queryKey: ["client"] });
      };
    },
  });

  // When data changes, update CSV download URL with new data
  useEffect(() => {
    if (data && data.length > 0) {
      const csvData = jsonToCsv(data);
      // Create a CSV file and allow the user to download it
      const blob = new Blob([...csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const download = "data.csv";

      setDownloadAttrs({ href: url, download });
    }
  }, [data]);

  // Buttons to be passed into every table row.
  const ActionButtons = ({ id }: { id: string }) => (
    <div className="table__actions">
      <IconButton
        onClick={() =>
          setDeleteModalMetaData({
            isOpen: true,
            id: id,
            message: "Are you sure you want to delete this client?",
            hideSubmit: false,
          })
        }
      >
        <Icon icon="bin" />
      </IconButton>
      <IconButton onClick={(e) => handleCopy(e)} data-wizard={8}>
        <Icon icon="paperclip" />
      </IconButton>
      <IconButton
        onClick={() => setModalContext({ isOpen: true, editing: id })}
        data-wizard={9}
      >
        <Icon icon="pencil" />
      </IconButton>
    </div>
  );

  // Event delegation optimization - handle click event on the table instead of each child. Saves us passing in multiple click events.
  const handleTableClick = (e: MouseEvent) => {
    if (e.target instanceof HTMLElement) {
      const targetId = e.target.closest("tr")!.getAttribute("data-clientid")!;
      const currentSelectedClient = selectedClient ? [...selectedClient] : [];

      if (targetId !== null) {
        if (currentSelectedClient.indexOf(`${targetId}`) === -1) {
          currentSelectedClient.push(targetId);
        } else {
          currentSelectedClient.splice(
            currentSelectedClient.indexOf(`${targetId}`),
            1
          );
        }
        setSelectedClient(currentSelectedClient);
      }
    }
  };

  const handleCopy = useCallback(
    (e: MouseEvent) => {
      if (e?.target) {
        const targetId = e.target.closest("tr")!.getAttribute("data-clientid")!;

        const clientData = JSON.stringify(
          data.filter((el) => el.id == targetId)
        );

        navigator.clipboard.writeText(clientData);
      }
    },
    [data]
  );

  const TableContents = () => {
    return data?.map((el, i) => {
      return (
        <tr
          data-clientid={el.id}
          key={el.id}
          data-wizard={i === 0 ? 4 : undefined}
        >
          <td>
            <Checkbox checked={selectedClient.indexOf(`${el.id}`) > -1} />
          </td>
          <td>{el.name}</td>
          <td>{el.dob}</td>
          <td>{el["primary_language"]}</td>
          <td>{el["secondary_language"]}</td>
          <td>{el.funding}</td>
          <td>
            <ActionButtons id={`${el.id}`} />
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
          <IconButton onClick={() => setWizardContext(1)} data-wizard={10}>
            <Icon icon="question-mark" />
          </IconButton>
        </div>
      </div>

      <div className="table__head">
        <label>Quick actions:</label>
        <IconButton
          onClick={() => setModalContext({ isOpen: true })}
          data-wizard={1}
        >
          <Icon icon="plus" />
        </IconButton>
        <IconButton
          data-wizard={5}
          onClick={() => {
            if (selectedClient.length > 0) {
              setDeleteModalMetaData({
                isOpen: true,
                id: selectedClient,
                message: `Are you sure you want to delete ${
                  selectedClient.length
                } client${selectedClient.length > 1 ? "s" : ""}?`,
              });
            } else {
              setDeleteModalMetaData({
                isOpen: true,
                id: selectedClient,
                message: `You haven't selected any clients to delete in bulk. Please close this modal and select some clients before using the bulk delete function.`,
                hideSubmit: true,
              });
            }
          }}
        >
          <Icon icon="bin" />
        </IconButton>
        <IconButton onClick={() => refetch()} data-wizard={6}>
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

      {error && <p>{error.message}</p>}

      {isPending && <Loading />}

      <Modal
        open={deleteModalMetaData.isOpen}
        onClose={() =>
          setDeleteModalMetaData({ isOpen: false, message: "", id: "0" })
        }
      >
        <div className="modal-delete__inner">
          <p className="">{deleteModalMetaData.message}</p>
          <div className="col col--row col--gap">
            {!deleteModalMetaData.hideSubmit && (
              <button
                className="button button--fill"
                onClick={() => deleteClients.mutate(deleteModalMetaData.id)}
              >
                Delete
              </button>
            )}

            <button
              className="button button--outline"
              onClick={() => setDeleteModalMetaData({ isOpen: false, id: "0" })}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default { Table };
