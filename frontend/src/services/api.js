import axios from 'axios';

// Define API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define API service functions
const ApiService = {
  // Articles
  getArticles: async (params = {}) => {
    try {
      const response = await api.get('/articles/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching articles:', error);
      return { results: [] };
    }
  },
  
  getArticle: async (id) => {
    try {
      const response = await api.get(`/articles/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching article ${id}:`, error);
      return null;
    }
  },
  
  // Regions
  getRegions: async () => {
    try {
      const response = await api.get('/regions/');
      return response.data;
    } catch (error) {
      console.error('Error fetching regions:', error);
      return { results: [] };
    }
  },
  
  // Topics
  getTopics: async () => {
    try {
      const response = await api.get('/topics/');
      return response.data;
    } catch (error) {
      console.error('Error fetching topics:', error);
      return { results: [] };
    }
  },
  
  // Sources
  getSources: async () => {
    try {
      const response = await api.get('/sources/');
      return response.data;
    } catch (error) {
      console.error('Error fetching sources:', error);
      return { results: [] };
    }
  },
  
  // User Posts
  getUserPosts: async () => {
    try {
      const response = await api.get('/posts/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return { results: [] };
    }
  },
};

export default ApiService;
