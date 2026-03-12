/**
 * Shared API client: auth headers and authenticated fetch with 401 handling.
 * Used by both api.ts (mutations) and store/data.ts (queries).
 */

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const headers = {
    ...(init?.headers || {}),
    ...getAuthHeaders(),
  } as Record<string, string>;

  const response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
  }

  return response;
}
