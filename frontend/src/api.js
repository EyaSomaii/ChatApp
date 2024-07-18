// src/api.js
const API_URL = 'http://localhost:5000/api';

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return response.json();
};

export const loginUser = async (userData) => {
    const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return response.json();
};

export const createRoom = async (roomData) => {
    const response = await fetch(`${API_URL}/rooms`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
    });
    return response.json();
};

export const getUserRooms = async (userId) => {
    const response = await fetch(`${API_URL}/rooms/${userId}`);
    return response.json();
};

export const getMessages = async (roomId) => {
    const response = await fetch(`${API_URL}/messages/${roomId}`);
    return response.json();
};

export const getAlluser = async () => {
    const response = await fetch(`${API_URL}/users/findAllUser`);
    return response.json();
};
export const getUserById = async (userId) => {
    const response = await fetch(`${API_URL}/users/${userId}`);
    return response.json();
};
