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
