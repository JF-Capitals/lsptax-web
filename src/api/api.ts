export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure content type is set
        },
        body: JSON.stringify({ email, password }),
      }
    );

    console.log(response);

    // If the response is not OK, throw an error
    if (!response.ok) {
      const errorText = await response.text(); // Get the response as text
      console.error("Error response:", errorText);
      throw new Error("Login failed");
    }

    // Parse JSON response
    const data = await response.json();

    // Save token and username in localStorage
    const { token, user } = data;
    localStorage.setItem("token", token);
    localStorage.setItem("username", user.name);
    localStorage.setItem("email", email); // Save username
    localStorage.setItem("user", JSON.stringify(user)); // Save user info

    return data; // Return parsed data for further use
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error("Login failed. Please try again.");
  }
};

export const logoutUser = async () => {
  try {
    // Optionally, send a request to the backend to invalidate the token
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    if (token) {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response during logout:", errorText);
        throw new Error("Logout failed on the server");
      }
    }

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user");

    console.log("User successfully logged out");
  } catch (error) {
    console.error("Error during logout:", error);
    throw new Error("Logout failed. Please try again.");
  }
};

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const addProspect = async (payload: {
  clientName: string;
  email: string;
  phoneNumber?: string;
  mailingAddress?: string;
  mailingAddressCityTxZip?: string;
}) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  if (!baseUrl) {
    throw new Error("Server URL is not configured. Please set VITE_BACKEND_URL.");
  }

  try {
    const response = await fetch(`${baseUrl}/action/add-prospect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        clientName: payload.clientName,
        email: payload.email,
        phoneNumber: payload.phoneNumber ?? "",
        mailingAddress: payload.mailingAddress ?? "",
        mailingAddressCityTxZip: payload.mailingAddressCityTxZip ?? "",
      }),
    });

    const text = await response.text();
    let result: Record<string, unknown> = {};
    if (text) {
      try {
        result = JSON.parse(text);
      } catch {
        // non-JSON response (e.g. HTML error page)
      }
    }

    if (!response.ok) {
      const msg = (result?.message as string) || (result?.error as string) || "Failed to add prospect";
      throw new Error(msg);
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error("Prospect addition failed. Please try again.");
  }
};

export const addClient = async (clientDetails: {
  clientName: string;
  email: string;
  phoneNumber?: string;
  mailingAddressCityTxZip?: string;
  typeOfAcct?: string;
  billingEmail?: string;
  billingAddress?: string;
}) => {
  try {
    const body: Record<string, string> = {
      clientName: clientDetails.clientName,
      email: clientDetails.email,
      phoneNumber: clientDetails.phoneNumber ?? "",
      mailingAddressCityTxZip: clientDetails.mailingAddressCityTxZip ?? "",
      typeOfAcct: clientDetails.typeOfAcct ?? "",
    };
    if (clientDetails.billingEmail != null) body.billingEmail = clientDetails.billingEmail;
    if (clientDetails.billingAddress != null) body.billingAddress = clientDetails.billingAddress;
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/add-client`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to add client");
    }

    return data;
  } catch (error: unknown) {
    let errorMessage = "Client Addition Failed. Please try again.";

    if (error instanceof Error) {
      console.log({ error });
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const editProperty = async (
  propertyId: string,
  propertyDetails: any,
  yearlyData: Record<number, any>
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/edit-property`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          propertyId: Number(propertyId),
          propertyDetails,
          yearlyData,
        }),
      }
    );

    // Check if response is OK before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to update property");
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    let errorMessage = "Property Update Failed. Please try again.";

    if (error instanceof Error) {
      console.log({ error });
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const editClient = async (
  clientId: string,
  clientDetails: any,
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/edit-client`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          clientId: Number(clientId),
          clientDetails,
        }),
      }
    );

    // Check if response is OK before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to update client");
    }
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    return data;
  } catch (error: unknown) {
    let errorMessage = "Client Update Failed. Please try again.";

    if (error instanceof Error) {
      console.log({ error });
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const editProspect = async (prospectId: string, prospectDetails: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/edit-prospect`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          prospectId: Number(prospectId),
          prospectDetails,
        }),
      }
    );

    // Check if response is OK before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to update prospect");
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    let errorMessage = "Prospect Update Failed. Please try again.";

    if (error instanceof Error) {
      console.log({ error });
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const deleteProperty = async (propertyId: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/delete-property`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ id: Number(propertyId) }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete property");
    }

    return response.json();
  } catch (error: unknown) {
    let errorMessage = "Property Deletion Failed. Please try again.";

    if (error instanceof Error) {
      console.error("Error deleting property:", error);
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const editProspectProperty = async (
  propertyId: string,
  propertyDetails: any
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/edit-prospect-property`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          propertyId: Number(propertyId),
          propertyDetails,
        }),
      }
    );

    // Check if response is OK before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to update property");
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    let errorMessage = "Property Update Failed. Please try again.";

    if (error instanceof Error) {
      console.log({ error });
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const addProperty = async ({
  clientId,
  propertyData,
}: {
  clientId: number;
  propertyData: Record<string, unknown>;
}) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/action/add-property`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        clientId,
        propertyData,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Failed to add property");
  }

  return response.json();
};

export const addProspectProperty = async ({
  id,
  propertyData,
}: {
  id: number;
  propertyData: Record<string, unknown>;
}) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/action/add-prospect-property`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        id,
        propertyData,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add property");
  }

  return response.json();
};

export const deleteProspectProperty = async (propertyId: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/delete-prospect-property`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ id: Number(propertyId) }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete property");
    }

    return response.json();
  } catch (error: unknown) {
    let errorMessage = "Property Deletion Failed. Please try again.";

    if (error instanceof Error) {
      console.error("Error deleting property:", error);
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const deleteClient = async (id: Number) => {
  try {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/action/delete-client`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        id,
      }),
    });
  } catch (error: unknown) {
    let errorMessage = "Client Deletion Failed. Please try again.";

    if (error instanceof Error) {
      console.log({ error });
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const deleteProspect = async (id: Number) => {
  try {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/action/delete-prospect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        id,
      }),
    });
  } catch (error: unknown) {
    let errorMessage = "Prospect Deletion Failed. Please try again.";

    if (error instanceof Error) {
      console.log({ error });
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const moveProspectToClient = async (id: Number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/move-to-client`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          id,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to move prospect to client.");
    }
    const data = await response.json();
    return data.client;
  } catch (error: unknown) {
    let errorMessage = "Prospect Moving Failed. Please try again.";

    if (error instanceof Error) {
      console.log({ error });
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const changeProspectStatus = async ({
  prospectId,
  newStatus,
}: {
  prospectId: Number;
  newStatus: String;
}) => {
  try {
    await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/change-prospect-status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          prospectId,
          newStatus,
        }),
      }
    );
  } catch (error: unknown) {
    let errorMessage = "Prospect Status Updation Failed. Please try again.";

    if (error instanceof Error) {
      console.log({ error });
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const sendContract = async ({ prospectId }: { prospectId: Number }) => {
  try {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/action/sign-aoa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        prospectId,
      }),
    });
  } catch (error: unknown) {
    let errorMessage =
      "Not able to send Contract to prospect. Please try again.";

    if (error instanceof Error) {
      console.log({ error });
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const sendAOAToClient = async ({
  clientId,
  propertyId,
}: {
  clientId: string;
  propertyId?: number;
}) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/sign-aoa`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          clientId,
          propertyId,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to send AOA to client");
    }
  } catch (error: unknown) {
    let errorMessage = "Not able to send AOA to client. Please try again.";

    if (error instanceof Error) {
      console.log({ error });
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const sendClientContract = async ({ clientId }: { clientId: string }) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/sign-aoa`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          clientId,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to send contract to client");
    }
  } catch (error: unknown) {
    let errorMessage = "Not able to send contract to client. Please try again.";

    if (error instanceof Error) {
      console.log({ error });
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

// --- DocuSign + Supabase contract/AOA flow (document_signing.md) ---

export const previewContract = async (clientId: number): Promise<{ contractPdf: string }> => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/contracts/preview-contract`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ clientId }),
    }
  );
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
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/contracts/preview-aoa`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ clientId, propertyId }),
    }
  );
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
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/contracts/send-contract`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ clientId }),
    }
  );
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
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/contracts/send-aoa`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ clientId, propertyId }),
    }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { message?: string }).message || "Failed to send AOA");
  }
  return data as { success: boolean; contract: { id: number; envelopeId: string; status: string }; envelopeId: string };
};

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

export const getContractsByClient = async (
  clientId: string | number
): Promise<ContractListItem[]> => {
  const id = typeof clientId === "string" ? clientId : String(clientId);
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/contracts/client/${id}`,
    { headers: getAuthHeaders() }
  );
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
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/contracts/sync-client-status`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ clientId }),
    }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { message?: string }).message || "Failed to sync contract status");
  }
  return data as { success: boolean; updated?: number };
};

export const getContractDownloadUrl = async (
  contractId: number,
  expiresIn = 3600
): Promise<{ url: string }> => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/contracts/${contractId}/download-url?expiresIn=${expiresIn}`,
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
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/contracts/poll-status`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ envelopeId }),
    }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { message?: string }).message || "Failed to poll status");
  }
  return data as { success: boolean; status: string };
};

// --- end DocuSign contract flow ---

export const downloadSignedPDF = async ({
  prospectId,
}: {
  prospectId: number;
}) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/download-signed-pdf`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          prospectId,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to download signed documents");
    }

    // Handle the ZIP file response
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `signed_documents_${prospectId}.zip`; // Download as a ZIP file
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url); // Clean up the Blob URL
  } catch (error) {
    console.error("Error downloading signed documents:", error);
    throw new Error("Error downloading signed documents. Please try again.");
  }
};

export const archiveItem = async (tableName: string, id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/archive-entity`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ tableName, id }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to archive item");
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    let errorMessage = "Archiving Failed. Please try again.";

    if (error instanceof Error) {
      console.error("Error archiving item:", error);
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

async function postCsv(endpoint: string, file: File) {
  const formData = new FormData();
  formData.append("csv", file);

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  const text = await response.text();
  let data: Record<string, unknown> = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // ignore
  }

  if (!response.ok) {
    const err = new Error(
      (data?.message as string) || (data?.error as string) || "CSV request failed"
    ) as Error & { details?: Record<string, unknown> };
    err.details = data;
    throw err;
  }

  return data;
}

// CSV v2 endpoints (multipart form-data, field name: `csv`)
export const previewClientsPropertiesCsv = async (file: File) =>
  postCsv("/csv/preview-clients-properties", file);

export const uploadClientsPropertiesCsv = async (file: File) =>
  postCsv("/csv/upload-clients-properties", file);

export const previewInvoicesCsv = async (file: File) =>
  postCsv("/csv/preview-invoices", file);

export const uploadInvoicesCsv = async (file: File) =>
  postCsv("/csv/upload-invoices", file);