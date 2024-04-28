export interface ClientInterface {
  id: string;
  name: string;
  dob: string;
  primary_language: string;
  secondary_language: string;
  funding: "NDIS" | "HCP" | "CHSP" | "DVA" | "HACC";
}
