import { useState } from "react";
import "./App.css";
import { Table } from "./components/Table";
import { Wizard } from "./components/Wizard";
import { WizardContext } from "./global-state/WizardContext";
import { ModalContext } from "./global-state/ModalContext";
import { Modal } from "./components/Modal";
import { FormAddNew } from "./components/FormAddNew";

// Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const [wizardStep, setWizardStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState({
    isOpen: false,
    editing: false,
  });
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ModalContext.Provider value={[isModalOpen, setIsModalOpen]}>
        <WizardContext.Provider value={[wizardStep, setWizardStep]}>
          <Table />
          <Wizard />
          <Modal open={isModalOpen.isOpen}>
            <h2 className="type--lg">
              {!isModalOpen.editing ? "Add a new client" : "Editing client"}
            </h2>
            <p className="type type--sm">
              Please ensure you have prior permission to add client records
              before submitting this form.
            </p>
            <FormAddNew />
          </Modal>
        </WizardContext.Provider>
      </ModalContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
