import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Disease Detection
export const predictDisease = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  
  const response = await api.post('/predict/disease', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Soil Recommendation
export const predictSoilRecommendation = async (soilData) => {
  const response = await api.post('/predict/soil', soilData);
  return response.data;
};

// Weather Advisory
export const getWeatherAdvisory = async (location) => {
  const response = await api.get('/predict/weather', {
    params: { location },
  });
  return response.data;
};

// Prediction History
export const getPredictionHistory = async (predictionType = null, limit = 50) => {
  const params = { limit };
  if (predictionType) {
    params.prediction_type = predictionType;
  }
  
  const response = await api.get('/predict/history', { params });
  return response.data;
};

// Statistics
export const getStatistics = async () => {
  const response = await api.get('/predict/statistics');
  return response.data;
};

// Health Check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
