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

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function authFetch(input: RequestInfo | URL, init?: RequestInit) {
  const headers = {
    ...(init?.headers || {}),
    ...getAuthHeaders(),
  } as Record<string, string>;

  const response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    // Token missing/invalid/blacklisted → force re-login on next navigation
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
  }

  return response;
}

/** Paginated list response per API v2 (limit, offset, data, total, hasMore) */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

const emptyPaginated = <T>(): PaginatedResponse<T> => ({
  data: [],
  total: 0,
  limit: 10,
  offset: 0,
  hasMore: false,
});

export const getClients = async (
  limit = 10,
  offset = 0,
  search?: string
): Promise<PaginatedResponse<unknown>> => {
  try {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (search?.trim()) params.set("search", search.trim());
    const response = await authFetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/clients?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch clients");
    }
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
    const response = await authFetch(
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
    const response = await authFetch(
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

export const getArchiveClients = async (
  limit = 10,
  offset = 0,
  search?: string
): Promise<PaginatedResponse<unknown>> => {
  try {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (search?.trim()) params.set("search", search.trim());
    const response = await authFetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/archive_clients?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch clients");
    }
    const json = await response.json();
    return {
      data: json.data ?? [],
      total: json.total ?? 0,
      limit: json.limit ?? limit,
      offset: json.offset ?? offset,
      hasMore: json.hasMore ?? false,
    };
  } catch (error) {
    console.log(error);
    return emptyPaginated();
  }
};

export const getProperties = async (
  limit = 10,
  offset = 0,
  search?: string
): Promise<PaginatedResponse<unknown>> => {
  try {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (search?.trim()) params.set("search", search.trim());
    const response = await authFetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/properties?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }
    const json = await response.json();
    return {
      data: json.data ?? [],
      total: json.total ?? 0,
      limit: json.limit ?? limit,
      offset: json.offset ?? offset,
      hasMore: json.hasMore ?? false,
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return emptyPaginated();
  }
};

export const getArchiveProperties = async (
  limit = 10,
  offset = 0,
  search?: string
): Promise<PaginatedResponse<unknown>> => {
  try {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (search?.trim()) params.set("search", search.trim());
    const response = await authFetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/archive_properties?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }
    const json = await response.json();
    return {
      data: json.data ?? [],
      total: json.total ?? 0,
      limit: json.limit ?? limit,
      offset: json.offset ?? offset,
      hasMore: json.hasMore ?? false,
    };
  } catch (error) {
    console.log(error);
    return emptyPaginated();
  }
};

export const getSingleProperty = async ({
  propertyId,
}: {
  propertyId: string;
}) => {
  try {
    const response = await authFetch(
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
    const response = await authFetch(
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
    const response = await authFetch(
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
    const response = await authFetch(
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
export const getAllInvoices = async (
  limit = 10,
  offset = 0,
  search?: string
): Promise<PaginatedResponse<unknown>> => {
  try {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (search?.trim()) params.set("search", search.trim());
    const response = await authFetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/invoices?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Invoices");
    }
    const json = await response.json();
    return {
      data: json.data ?? [],
      total: json.total ?? 0,
      limit: json.limit ?? limit,
      offset: json.offset ?? offset,
      hasMore: json.hasMore ?? false,
    };
  } catch (error) {
    console.log(error);
    return emptyPaginated();
  }
};

// Invoice Generation APIs
export const getClientsForInvoiceGeneration = async () => {
  try {
    const response = await authFetch(
      `${import.meta.env.VITE_BACKEND_URL}/invoice/clients`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch clients for invoice generation");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching clients for invoice generation:", error);
    throw error;
  }
};

export const getPropertiesForInvoiceGeneration = async (clientNumbers: string[]) => {
  try {
    const clientNumbersParam = clientNumbers.join(',');
    const response = await authFetch(
      `${import.meta.env.VITE_BACKEND_URL}/invoice/properties?clientNumbers=${clientNumbersParam}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch properties for invoice generation");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching properties for invoice generation:", error);
    throw error;
  }
};

export const generateInvoices = async (options: {
  clientNumbers: string[];
  propertyAccountNumbers?: string[] | null;
  years?: number[];
  invoiceDefaults?: Record<string, unknown>;
}) => {
  try {
    const headers = {
      ...(getAuthHeaders() as Record<string, string>),
      "Content-Type": "application/json",
    };
    const response = await authFetch(
      `${import.meta.env.VITE_BACKEND_URL}/invoice/generate`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(options),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to generate invoices");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating invoices:", error);
    throw error;
  }
};

export const getInvoiceGenerationStats = async (clientNumbers?: string[], years?: number[]) => {
  try {
    const params = new URLSearchParams();
    if (clientNumbers && clientNumbers.length > 0) {
      params.append('clientNumbers', clientNumbers.join(','));
    }
    if (years && years.length > 0) {
      params.append('years', years.map(y => y.toString()).join(','));
    }

    const response = await authFetch(
      `${import.meta.env.VITE_BACKEND_URL}/invoice/stats?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch invoice generation statistics");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching invoice generation stats:", error);
    throw error;
  }
};

export const getArchiveInvoices = async (
  limit = 10,
  offset = 0,
  search?: string
): Promise<PaginatedResponse<unknown>> => {
  try {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (search?.trim()) params.set("search", search.trim());
    const response = await authFetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/archive-invoices?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Invoices");
    }
    const json = await response.json();
    return {
      data: json.data ?? [],
      total: json.total ?? 0,
      limit: json.limit ?? limit,
      offset: json.offset ?? offset,
      hasMore: json.hasMore ?? false,
    };
  } catch (error) {
    console.log(error);
    return emptyPaginated();
  }
};

export const getProspects = async (
  limit = 10,
  offset = 0
): Promise<PaginatedResponse<unknown>> => {
  try {
    const response = await authFetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/prospects?limit=${limit}&offset=${offset}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch prospects");
    }
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
  limit = 10,
  offset = 0
): Promise<PaginatedResponse<unknown>> => {
  try {
    const response = await authFetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/archive-prospects?limit=${limit}&offset=${offset}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch prospects");
    }
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

export const getContractOwner = async () => {
  try {
    const response = await authFetch(
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
    const response = await authFetch(
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
    const response = await authFetch(
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
    const response = await authFetch(
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
    const response = await authFetch(
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
    const response = await authFetch(
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
    const response = await authFetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/download-clients-csv`
    );
    if (!response.ok) {
      throw new Error("Failed to download clients CSV");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clients_${getFormattedDate()}.xlsx`; // Include today's date in the filename
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
    const response = await authFetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/download-prospects-csv`
    );
    if (!response.ok) {
      throw new Error("Failed to download prospects CSV");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prospects_${getFormattedDate()}.xlsx`; // Include today's date in the filename
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
    const response = await authFetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/download-properties-csv`
    );
    if (!response.ok) {
      throw new Error("Failed to download properties CSV");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `properties_${getFormattedDate()}.xlsx`; // Include today's date in the filename
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
    const response = await authFetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/download-invoices-csv`
    );
    if (!response.ok) {
      throw new Error("Failed to download invoices CSV");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoices_${getFormattedDate()}.xlsx`; // Include today's date in the filename
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
    const headers = {
      ...(getAuthHeaders() as Record<string, string>),
      "Content-Type": "application/json",
    };
    const response = await authFetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/preview-signed-pdf`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ prospectId }),
      }
    );
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(text || "Failed to preview documents");
    }
    return response.json();
  } catch (error) {
    console.error("Error previewing documents:", error);
    throw error;
  }
};