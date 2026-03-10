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

export const addProspect = async (data: {
  clientName: string;
  email: string;
  phoneNumber?: string;
  mailingAddress?: string;
  mailingAddressCityTxZip?: string;
}) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/add-prospect`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName: data.clientName,
          email: data.email,
          phoneNumber: data.phoneNumber ?? "",
          mailingAddress: data.mailingAddress ?? "",
          mailingAddressCityTxZip: data.mailingAddressCityTxZip ?? "",
        }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to add prospect");
    }

    return data;
  } catch (error: unknown) {
    let errorMessage = "Prospect Addition Failed. Please try again.";

    if (error instanceof Error) {
      console.log({ error });
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
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
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/edit-property`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/edit-client`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/edit-prospect`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/edit-prospect-property`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      },
      body: JSON.stringify({
        clientId,
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
    body: formData,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "CSV request failed");
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