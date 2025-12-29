const API_URL = 'http://127.0.0.1:8001';

export const getAnalysisHistory = async () => {
  try {
    const response = await fetch(`${API_URL}/analyses`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch analysis history:", error);
    return []; // Return an empty array on error
  }
};