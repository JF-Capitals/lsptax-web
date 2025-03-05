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

export const addProspect = async (
  ProspectName: string,
  Email: string,
  PHONENUMBER: string,
  MAILINGADDRESS: string,
  MAILINGADDRESSCITYTXZIP: string
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/add-prospect`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ProspectName,
          Email,
          PHONENUMBER,
          MAILINGADDRESS,
          MAILINGADDRESSCITYTXZIP,
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

export const addClient = async (
  CLIENTNAME: string,
  Email: string,
  PHONENUMBER: string,
  MAILINGADDRESSCITYTXZIP: string,
  TypeOfAcct: string
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/add-client`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CLIENTNAME,
          Email,
          PHONENUMBER,
          MAILINGADDRESSCITYTXZIP,
          TypeOfAcct,
        }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to add client");
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
          propertyId,
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

export const addProperty = async ({
  CLIENTNumber,
  propertyData,
}: {
  CLIENTNumber: string;
  propertyData: any;
}) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/action/add-property`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        CLIENTNumber,
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
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/action/move-to-client`, {
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
