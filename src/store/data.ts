

export const getClients = async() => {
   try {
     const response = await fetch("http://localhost:3000/api/clients");
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
    const response = await fetch("http://localhost:3000/api/properties");
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