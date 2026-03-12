import { authFetch, getAuthHeaders } from "@/api/client";
import {
  DEFAULT_PAGE_SIZE,
  emptyPaginated,
  type PaginatedResponse,
} from "./common";

const base = () => import.meta.env.VITE_BACKEND_URL as string;

export const getProspects = async (
  limit = DEFAULT_PAGE_SIZE,
  offset = 0
): Promise<PaginatedResponse<unknown>> => {
  try {
    const response = await authFetch(
      `${base()}/api/prospects?limit=${limit}&offset=${offset}`
    );
    if (!response.ok) throw new Error("Failed to fetch prospects");
    const json = await response.json();
    return {
      data: json.data ?? [],
      total: json.total ?? 0,
      limit: json.limit ?? limit,
      offset: json.offset ?? offset,
      hasMore: json.hasMore ?? false,
    };
  } catch (error) {
    console.error("Error fetching prospects:", error);
    return emptyPaginated();
  }
};

export const getArchiveProspects = async (
  limit = DEFAULT_PAGE_SIZE,
  offset = 0
): Promise<PaginatedResponse<unknown>> => {
  try {
    const response = await authFetch(
      `${base()}/api/archive-prospects?limit=${limit}&offset=${offset}`
    );
    if (!response.ok) throw new Error("Failed to fetch prospects");
    const json = await response.json();
    return {
      data: json.data ?? [],
      total: json.total ?? 0,
      limit: json.limit ?? limit,
      offset: json.offset ?? offset,
      hasMore: json.hasMore ?? false,
    };
  } catch (error) {
    console.error("Error fetching prospects:", error);
    return emptyPaginated();
  }
};

export const getPreviewDocuments = async ({ prospectId }: { prospectId: Number }) => {
  const response = await authFetch(`${base()}/action/preview-signed-pdf`, {
    method: "POST",
    headers: {
      ...(getAuthHeaders() as Record<string, string>),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prospectId }),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to preview documents");
  }
  return response.json();
};
