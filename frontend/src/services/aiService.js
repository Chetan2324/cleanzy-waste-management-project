import api from './api';

const analyzeWaste = async (formData) => {
  // We send the data to our new AI endpoint
  const response = await api.post('/ai/analyze', formData);
  return response.data;
};

const aiService = {
  analyzeWaste,
};

export default aiService;