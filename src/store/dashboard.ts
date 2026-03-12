import { authFetch, getApiBaseUrl } from "@/api/client";

const base = getApiBaseUrl;

interface Stats {
  numOfClients: number;
  numOfProspects: number;
  numOfAgents: number;
}

export const dashboardData = async (): Promise<Stats> => {
  try {
    const response = await authFetch(`${base()}/api/stats`);
    if (!response.ok) throw new Error("Failed to fetch dashboard stats");
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const getContractOwner = async () => {
  try {
    const response = await authFetch(`${base()}/api/contract_owner`);
    if (!response.ok) throw new Error("Failed to fetch Contract Owners");
    return response.json();
  } catch {
    return [];
  }
};

export const getContractOwnerById = async ({ coId }: { coId: number }) => {
  try {
    const response = await authFetch(
      `${base()}/api/contract_owner_details?co_id=${coId}`
    );
    if (!response.ok) throw new Error("Failed to fetch Contract Owner Details");
    return response.json();
  } catch {
    return [];
  }
};

export const getContracts = async () => {
  try {
    const response = await authFetch(`${base()}/api/form/contracts`);
    if (!response.ok) throw new Error("Failed to fetch Contracts");
    return response.json();
  } catch {
    return [];
  }
};

export const getAgents = async () => {
  try {
    const response = await authFetch(`${base()}/api/form/agents`);
    if (!response.ok) throw new Error("Failed to fetch Agents");
    return response.json();
  } catch {
    return [];
  }
};
