import { authFetch } from "@/api/client";
import {
  DEFAULT_PAGE_SIZE,
  emptyPaginated,
  getFormattedDate,
  type PaginatedResponse,
} from "./common";

const base = () => import.meta.env.VITE_BACKEND_URL as string;

export const getClients = async (
  limit = DEFAULT_PAGE_SIZE,
  offset = 0,
  search?: string
): Promise<PaginatedResponse<unknown>> => {
  try {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (search?.trim()) params.set("search", search.trim());
    const response = await authFetch(`${base()}/api/clients?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch clients");
    const json = await response.json();
    return {
      data: json.data ?? [],
      total: json.total ?? 0,
      limit: json.limit ?? limit,
      offset: json.offset ?? offset,
      hasMore: json.hasMore ?? false,
    };
  } catch (error) {
    console.error("Error fetching clients:", error);
    return emptyPaginated();
  }
};

export const getSingleClient = async ({ clientId }: { clientId?: string }) => {
  try {
    const response = await authFetch(`${base()}/api/client?clientId=${clientId}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Failed to fetch clients");
    return response.json();
  } catch {
    return null;
  }
};

export const getSingleProspect = async ({ prospectId }: { prospectId?: string }) => {
  try {
    const response = await authFetch(`${base()}/api/prospect?prospectId=${prospectId}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Failed to fetch prospect");
    return response.json();
  } catch {
    return null;
  }
};

export const getArchiveClients = async (
  limit = DEFAULT_PAGE_SIZE,
  offset = 0,
  search?: string
): Promise<PaginatedResponse<unknown>> => {
  try {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (search?.trim()) params.set("search", search.trim());
    const response = await authFetch(`${base()}/api/archive_clients?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch clients");
    const json = await response.json();
    return {
      data: json.data ?? [],
      total: json.total ?? 0,
      limit: json.limit ?? limit,
      offset: json.offset ?? offset,
      hasMore: json.hasMore ?? false,
    };
  } catch {
    return emptyPaginated();
  }
};

async function downloadCsv(endpoint: string, filenamePrefix: string) {
  const response = await authFetch(`${base()}${endpoint}`);
  if (!response.ok) throw new Error(`Failed to download ${filenamePrefix} CSV`);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filenamePrefix}_${getFormattedDate()}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export const downloadClientsCSV = async () => {
  try {
    await downloadCsv("/api/download-clients-csv", "clients");
  } catch (error) {
    console.error("Error downloading clients CSV:", error);
  }
};

export const downloadProspectsCSV = async () => {
  try {
    await downloadCsv("/api/download-prospects-csv", "prospects");
  } catch (error) {
    console.error("Error downloading prospects CSV:", error);
  }
};
