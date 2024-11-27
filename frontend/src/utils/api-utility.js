const BASE_URL = "http://localhost:5002";

//GET request
export async function getData(endpoint) {
  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error("Data not found");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export const saveData = async (endpoint, object) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  });

  if (!response.ok) {
    throw new Error("Failed to save data");
  } else {
    const data = await response.json();
    return data;
  }
};
