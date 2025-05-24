import axiosIns from "../../utils/axiosIns";

export const createDailyRecieve = async (dailyRecieveData) => {
    try {
        const response = await axiosIns.post('/api/dailyRecieves', dailyRecieveData);
        return response.data;
    } catch (error) {
        console.error('Error creating daily receive record:', error);
        throw error;
    }
};

export const getAllDailyRecieves = async () => {
    try {
        const response = await axiosIns.get('/api/dailyRecieves');
        return response.data;
    } catch (error) {
        console.error('Error fetching daily receive records:', error);
        throw error;
    }
};

export const getDailyRecieveById = async (id) => {
    try {
        const response = await axiosIns.get(`/api/dailyRecieves/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily receive record:', error);
        throw error;
    }
};

export const updateDailyRecieve = async (id, dailyRecieveData) => {
    try {
        const response = await axiosIns.put(`/api/dailyRecieves/${id}`, dailyRecieveData);
        return response.data;
    } catch (error) {
        console.error('Error updating daily receive record:', error);
        throw error;
    }
};

export const deleteDailyRecieve = async (id) => {
    try {
        const response = await axiosIns.delete(`/api/dailyRecieves/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting daily receive record:', error);
        throw error;
    }
};