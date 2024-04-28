import { ClientInterface } from "../interfaces/client.interface";

export function jsonToCsv(jsonData: Array<ClientInterface>) {
  let csv = "";
  // Get the headers
  const headers = Object.keys(jsonData[0]);
  csv += headers.join(",") + "\n";
  // Add the data
  jsonData.forEach(function (row) {
    const data = headers.map((header) => JSON.stringify(row[header])).join(",");
    csv += data + "\n";
  });
  return csv;
}
