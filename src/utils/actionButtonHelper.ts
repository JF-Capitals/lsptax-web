/** API v2: POST /action/archive-entity toggles archive state. Body: { tableName, id }. */
export async function handleArchiveUnarchive(
  resource: "invoice" | "client" | "property",
  id: string,
  action: "archive" | "unarchive"
): Promise<void> {
  try {
    const tableName = resource;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      alert("Invalid ID.");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/action/archive-entity`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tableName, id: numericId }),
      }
    );

    if (!response.ok) {
      let errorData: { message?: string; error?: string } = {};
      try {
        errorData = await response.json();
      } catch {
        // ignore
      }
      const msg = errorData.message ?? errorData.error ?? "Unknown error";
      alert(`Failed to ${action} the ${resource}: ${msg}`);
      return;
    }

    alert(
      `${resource.charAt(0).toUpperCase() + resource.slice(1)} ${action}d successfully.`
    );
  } catch (error) {
    console.error(`Error ${action}ing ${resource}:`, error);
    alert("An unexpected error occurred. Please try again later.");
  }
}
