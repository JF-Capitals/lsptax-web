import { getAuthHeaders, getApiBaseUrl } from "./client";

const baseUrl = getApiBaseUrl;

export interface ContractListItem {
  id: number;
  type: string;
  status: string;
  clientId: number;
  propertyId?: number;
  envelopeId?: string;
  signedAt?: string | null;
  signedFileUrl?: string | null;
  createdAt: string;
  property?: { id: number; accountNumber?: string };
}

export const previewContract = async (clientId: number): Promise<{ contractPdf: string }> => {
  const response = await fetch(`${baseUrl()}/api/contracts/preview-contract`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ clientId }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || "Failed to preview contract");
  }
  return response.json();
};

export const previewAoa = async (
  clientId: number,
  propertyId: number
): Promise<{ aoaPdf: string }> => {
  const response = await fetch(`${baseUrl()}/api/contracts/preview-aoa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ clientId, propertyId }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || "Failed to preview AOA");
  }
  return response.json();
};

export const sendContractForClient = async (clientId: number): Promise<{
  success: boolean;
  contract: { id: number; envelopeId: string; status: string };
  envelopeId: string;
}> => {
  const response = await fetch(`${baseUrl()}/api/contracts/send-contract`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ clientId }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { message?: string }).message || "Failed to send contract");
  }
  return data as { success: boolean; contract: { id: number; envelopeId: string; status: string }; envelopeId: string };
};

export const sendAoaForClient = async (
  clientId: number,
  propertyId: number
): Promise<{
  success: boolean;
  contract: { id: number; envelopeId: string; status: string };
  envelopeId: string;
}> => {
  const response = await fetch(`${baseUrl()}/api/contracts/send-aoa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ clientId, propertyId }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { message?: string }).message || "Failed to send AOA");
  }
  return data as { success: boolean; contract: { id: number; envelopeId: string; status: string }; envelopeId: string };
};

export const getContractsByClient = async (
  clientId: string | number
): Promise<ContractListItem[]> => {
  const id = typeof clientId === "string" ? clientId : String(clientId);
  const response = await fetch(`${baseUrl()}/api/contracts/client/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error("Failed to fetch contracts");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.contracts ?? [];
};

export const syncClientContractStatus = async (
  clientId: number
): Promise<{ success: boolean; updated?: number }> => {
  const response = await fetch(`${baseUrl()}/api/contracts/sync-client-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ clientId }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { message?: string }).message || "Failed to sync contract status");
  }
  return data as { success: boolean; updated?: number };
};

const CONTRACT_DOWNLOAD_URL_EXPIRY_SECONDS = 3600;

export const getContractDownloadUrl = async (
  contractId: number,
  expiresIn = CONTRACT_DOWNLOAD_URL_EXPIRY_SECONDS
): Promise<{ url: string }> => {
  const response = await fetch(
    `${baseUrl()}/api/contracts/${contractId}/download-url?expiresIn=${expiresIn}`,
    { headers: getAuthHeaders() }
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || "Signed document not yet available");
  }
  return response.json();
};

export const pollContractStatus = async (
  envelopeId: string
): Promise<{ success: boolean; status: string }> => {
  const response = await fetch(`${baseUrl()}/api/contracts/poll-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ envelopeId }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { message?: string }).message || "Failed to poll status");
  }
  return data as { success: boolean; status: string };
};
