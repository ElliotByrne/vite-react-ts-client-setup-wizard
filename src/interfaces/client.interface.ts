export interface ClientInterface {
  id: string;
  name: string;
  dob: string;
  "primary-language": string;
  "secondary-language": string;
  funding: "NDIS" | "HCP" | "CHSP" | "DVA" | "HACC";
}
