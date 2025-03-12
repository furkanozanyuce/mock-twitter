import axios from 'axios';

const API_BASE_URL = '****';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach Basic Auth header if available
api.interceptors.request.use((config) => {
  const credentials = localStorage.getItem('credentials');
  if (credentials) {
    config.headers.Authorization = `Basic ${credentials}`;
  }
  return config;
});

export const auth = {
  register: async (email, userName, password) => {
    const response = await api.post('/auth/register', { email, userName, password });
    return response.data;
  },
  login: async (email, password) => {
    const credentials = btoa(`${email}:${password}`);
    localStorage.setItem('credentials', credentials);
    const response = await api.post('/auth/login', { email, password });
    return { ...response.data, email, userName: response.data.userName || email.split('@')[0] };
  },
  logout: () => {
    localStorage.removeItem('credentials');
    localStorage.removeItem('user');
  },
};

export const tweets = {
  create: async (sentence) => {
    const response = await api.post('/tweet', { sentence });
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/tweet');
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      throw new Error('Unauthorized: Received HTML instead of tweet data.');
    }
    return response.data;
  },
  getByUserId: async (userId) => {
    const response = await api.get(`/tweet/findByUserId?userId=${userId}`);
    return response.data;
  },
  getById: async (tweetId) => {
    const response = await api.get(`/tweet/findById?tweetId=${tweetId}`);
    return response.data;
  },
  update: async (tweetId, sentence) => {
    const response = await api.put(`/tweet/${tweetId}`, { sentence });
    return response.data;
  },
  delete: async (tweetId) => {
    await api.delete(`/tweet/${tweetId}`);
  },
};

export const comments = {
  create: async (tweetId, sentence) => {
    const response = await api.post('/comment', { tweetId, sentence });
    return response.data;
  },
  update: async (commentId, tweetId, sentence) => {
    const response = await api.put(`/comment/${commentId}`, { tweetId, sentence });
    return response.data;
  },
  delete: async (commentId) => {
    await api.delete(`/comment/${commentId}`);
  },
  // New endpoint to fetch comments by tweetId:
  getByTweetId: async (tweetId) => {
    const response = await api.get(`/comment/byTweet?tweetId=${tweetId}`);
    return response.data;
  },
};

export const likes = {
  like: async (tweetId) => {
    const response = await api.post(`/like?tweetId=${tweetId}`);
    return response.data;
  },
  unlike: async (tweetId) => {
    const response = await api.post(`/dislike?tweetId=${tweetId}`);
    return response.data;
  },
};

export const retweets = {
  create: async (tweetId, message) => {
    const response = await api.post('/retweet', { tweetId, message });
    return response.data;
  },
  delete: async (retweetId) => {
    await api.delete(`/retweet/${retweetId}`);
  },
};
