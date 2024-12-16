

export const getClients = async() => {
   try {
     const response = await fetch(
       `${import.meta.env.VITE_BACKEND_URL}/api/clients`
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
} 

export const getProperties = async() => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/properties`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    };
    const properties = await response.json();
    return properties;
  } catch (error) {
    console.log(error);
    return [{}]
  }
}

export const getInvoices = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/invoices`
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
}

export const getProspects = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/prospects`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Prospects");
    }
    const prospects = await response.json();
    return prospects;
  } catch (error) {
    console.log(error);
    return [{}];
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
}
interface Stats {
  numOfClients: number;
  numOfProspects: number;
  numOfAgents: number;
}

// Function to fetch data and return stats
export const dashboardData = async (): Promise<Stats | null> => {
  try {
    const clients = await getClients();
    const prospects = await getProspects();
    const agents = await getAgents();

    // Assuming getClients(), getProspects(), getAgents() return arrays
    const numOfClients = clients.length;
    const numOfProspects = prospects.length;
    const numOfAgents = agents.length;

    const stats: Stats = {
      numOfClients,
      numOfProspects,
      numOfAgents,
    };

    console.log({ stats });

    return stats;
  } catch (error) {
    console.log(error);
    return null; // Returning null in case of error to align with Stats | null type
  }
}
