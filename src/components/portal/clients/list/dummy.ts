import { Clients } from "./columns";

const response = await fetch("http://localhost:3000/api/clients");
if (!response.ok) {
  throw new Error("Failed to fetch clients");
}

const clients = await response.json();

export const sampleClients: Clients[] = clients;
