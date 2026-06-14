import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Get device ID from localStorage or generate new one
export const getDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
};

// API functions
export const fetchDoaList = async () => {
    const response = await api.get('/doa');
    return response.data;
};

export const fetchDoaById = async (id) => {
    const response = await api.get(`/doa/${id}`);
    return response.data;
};

export const fetchQuiz = async (doaId) => {
    const response = await api.get(`/quiz/${doaId}`);
    return response.data;
};

export const saveProgress = async (doaId, status, score) => {
    const device_id = getDeviceId();
    const response = await api.post('/progress', { device_id, doa_id: doaId, status, score });
    return response.data;
};

export const fetchProgress = async () => {
    const device_id = getDeviceId();
    const response = await api.get(`/progress/${device_id}`);
    return response.data;
};

export default api;