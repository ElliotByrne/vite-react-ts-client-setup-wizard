import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ToDoList } from "./components/ToDoList";
import { Table } from "./components/Table";

function App() {
  return (
    <div>
      <Table />
    </div>
  );
}

export default App;
