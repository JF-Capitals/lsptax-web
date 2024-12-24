export async function handleArchiveUnarchive(
  resource: "invoice" | "client" | "property", // New parameter for the resource type
  id: string,
  action: "archive" | "unarchive"
): Promise<void> {
  try {
    console.log({ resource, id, action });
    console.log(JSON.stringify({ [resource]: id, action }));

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/data/${resource}/${action}`, // Dynamic URL based on resource type
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Set JSON Content-Type
        },
        body: JSON.stringify({ [resource]: id }), // Dynamically set the resource field in the request body
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        throw new Error("Unexpected response from the server.");
      }
      console.error(`Error ${action}ing ${resource}:`, errorData.error);
      alert(`Failed to ${action} the ${resource}: ${errorData.error}`);
      return;
    }

    // Success message
    alert(
      `${
        resource.charAt(0).toUpperCase() + resource.slice(1)
      } ${action}d successfully.`
    );
  } catch (error) {
    console.error(`Error ${action}ing ${resource}:`, error);
    alert("An unexpected error occurred. Please try again later.");
  }
}
