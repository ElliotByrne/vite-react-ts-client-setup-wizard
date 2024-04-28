import { useState } from "react";
import "./App.css";
import { Table } from "./components/Table";
import { Wizard } from "./components/Wizard";
import { WizardContext } from "./global-state/WizardContext";
import { ModalContext } from "./global-state/ModalContext";
import { Modal } from "./components/Modal";
import { FormAddNew } from "./components/FormAddNew";

function App() {
  const [wizardStep, setWizardStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ModalContext.Provider value={[isModalOpen, setIsModalOpen]}>
      <WizardContext.Provider value={[wizardStep, setWizardStep]}>
        <div>
          <Table />
          <Wizard />
          <Modal open={isModalOpen}>
            <h2 className="type--lg">Add a new client</h2>
            <p className="type type--sm">
              Please ensure you have prior permission to add client records
              before submitting this form.
            </p>
            <FormAddNew />
          </Modal>
        </div>
      </WizardContext.Provider>
    </ModalContext.Provider>
  );
}

export default App;
