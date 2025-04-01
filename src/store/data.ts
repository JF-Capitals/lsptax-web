const getFormattedDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  // Add the ordinal suffix to the day (e.g., 1st, 2nd, 3rd, 4th, etc.)
  const ordinalSuffix =
    day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";
  return `${day}${ordinalSuffix}${month}${year}`;
};

export const getClients = async (limit = 10) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/clients?limit=${limit}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch clients");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};

export const getSingleClient = async ({ clientId }: { clientId?: string }) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/client?clientId=${clientId}`
    );
    if (response.status == 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error("Failed to fetch clients");
    }
    const client = await response.json();
    return client;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getSingleProspect = async ({
  prospectId
}: {
  prospectId?: string;
}) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/prospect?prospectId=${prospectId}`
    );
     if (response.status == 404) {
       return null;
     }
    if (!response.ok) {
      throw new Error("Failed to fetch prospect");
    }
    const prospect = await response.json();
    return prospect;
  } catch (error) {
    console.log(error);
     return null;
  }
};

export const getArchiveClients = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/archive_clients`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch clients");
    }
    const clients = await response.json();
    return clients;
  } catch (error) {
    console.log(error);
    return [{}];
  }
};

export const getProperties = async (limit = 10) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/properties?limit=${limit}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
};

export const getArchiveProperties = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/archive_properties`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }
    const properties = await response.json();
    return properties;
  } catch (error) {
    console.log(error);
    return [{}];
  }
};

export const getSingleProperty = async ({
  propertyId,
}: {
  propertyId: string;
}) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/property?propertyId=${propertyId}`
    );
    if (response.status === 404) {
      console.warn(`Property with ID ${propertyId} not found.`);
      return null; // Return `null` to indicate the property was not found
    }
    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }
    const property = await response.json();
    // console.log("PROPERTY:", property);
    return property;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getProspectProperty = async ({
  propertyId,
}: {
  propertyId: string;
}) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/prospect-property?id=${propertyId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }
    const property = await response.json();
    console.log("PROPERTY:", property);
    return property;
  } catch (error) {
    console.log(error);
    return [{}];
  }
};

export const getInvoice = async ({ clientId }: { clientId: string }) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/invoice/${clientId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Invoices");
    }
    const invoice = await response.json();
    return invoice;
  } catch (error) {
    console.log(error);
    return [{}];
  }
};
export const getInvoiceByPropertyId = async ({
  propertyId,
}: {
  propertyId: string;
}) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/invoice_prop?propertyId=${propertyId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Invoices");
    }
    const invoices = await response.json();
    return invoices;
  } catch (error) {
    console.log(error);
    return [{}];
  }
};
export const getAllInvoices = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/invoices`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Invoices");
    }
    const invoice = await response.json();
    return invoice;
  } catch (error) {
    console.log(error);
    return [{}];
  }
};

export const getArchiveInvoices = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/archive-invoices`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Invoices");
    }
    const invoices = await response.json();
    return invoices;
  } catch (error) {
    console.log(error);
    return [{}];
  }
};

export const getProspects = async (limit = 10) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/prospects?limit=${limit}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch prospects");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching prospects:", error);
    return [];
  }
};

export const getArchiveProspects = async (limit = 10) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/archive-prospects?limit=${limit}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch prospects");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching prospects:", error);
    return [];
  }
};

export const getContractOwner = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/contract_owner`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Contract Owners");
    }
    const contract_owner = await response.json();
    return contract_owner;
  } catch (error) {
    console.log(error);
    return [{}];
  }
};

export const getContractOwnerById = async ({ coId }: { coId: number }) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/contract_owner_details?co_id=${coId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Contract Owner Details");
    }
    const contract_owner = await response.json();
    return contract_owner;
  } catch (error) {
    console.log(error);
    return [{}];
  }
};

export const getContracts = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/form/contracts`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Contracts");
    }
    const contracts = await response.json();
    return contracts;
  } catch (error) {
    console.log(error);
    return [{}];
  }
};

export const getAgents = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/form/agents`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Agents");
    }
    const contracts = await response.json();
    return contracts;
  } catch (error) {
    console.log(error);
    return [{}];
  }
};

export const getProtests = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/contracts`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }
    const contracts = await response.json();
    return contracts;
  } catch (error) {
    console.log(error);
    return [{}];
  }
};

interface Stats {
  numOfClients: number;
  numOfProspects: number;
  numOfAgents: number;
}

// Function to fetch data and return stats
export const dashboardData = async (): Promise<Stats | null> => {
  try {
    // Fetch stats from the new /stats endpoint
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/stats`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch dashboard stats");
    }

    const stats: Stats = await response.json(); // Assuming the response is { numOfClients, numOfProspects, numOfAgents }

    console.log({ stats });

    return stats;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null; // Returning null in case of error to align with Stats | null type
  }
};

export const downloadClientsCSV = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/download-clients-csv`
    );
    if (!response.ok) {
      throw new Error("Failed to download clients CSV");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clients_${getFormattedDate()}.csv`; // Include today's date in the filename
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading clients CSV:", error);
  }
};

export const downloadProspectsCSV = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/download-prospects-csv`
    );
    if (!response.ok) {
      throw new Error("Failed to download prospects CSV");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prospects_${getFormattedDate()}.csv`; // Include today's date in the filename
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading prospects CSV:", error);
  }
};

export const downloadPropertiesCSV = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/download-properties-csv`
    );
    if (!response.ok) {
      throw new Error("Failed to download properties CSV");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `properties_${getFormattedDate()}.csv`; // Include today's date in the filename
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading properties CSV:", error);
  }
};

export const downloadInvoicesCSV = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/download-invoices-csv`
    );
    if (!response.ok) {
      throw new Error("Failed to download invoices CSV");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoices_${getFormattedDate()}.csv`; // Include today's date in the filename
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading invoices CSV:", error);
  }
};


export const getPreviewDocuments = async ({ prospectId }: { prospectId: Number }) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/preview-signed-pdf`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prospectId }),
      }
    );
    return response.json();
  } catch (error) {}
};