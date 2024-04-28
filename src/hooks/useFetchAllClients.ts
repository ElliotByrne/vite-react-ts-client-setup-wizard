import { useQuery } from "@tanstack/react-query";

// This hook allows us to refetch client data from any component.
// useQuery caches results automatically,
export const useFetchAllClients = () => {
  return useQuery({
    queryKey: ["clientsData"],
    queryFn: () => {
      return fetch("http://localhost:3000/clients", {
        headers: { "Access-Control-Allow-Origin": "*" },
      }).then((res) => res.json());
    },
  });
};
