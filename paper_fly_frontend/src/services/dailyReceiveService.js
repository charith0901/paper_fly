import axiosIns from "../../utils/axiosIns";

export const createDailyReceive = async (dailyReceiveData) => {
    try {
        const response = await axiosIns.post('/api/dailyReceives', dailyReceiveData);
        return response.data;
    } catch (error) {
        console.error('Error creating daily receive record:', error);
        throw error;
    }
};

export const getAllDailyReceivesByBillId = async (bill_id) => {
    try {
        const response = await axiosIns.get('/api/dailyReceives/bill/' + bill_id);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily receive records:', error);
        throw error;
    }
};

export const getDailyReceiveById = async (id) => {
    try {
        const response = await axiosIns.get(`/api/dailyReceives/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily receive record:', error);
        throw error;
    }
};

export const updateDailyReceive = async (id, dailyReceiveData) => {
    try {
        const response = await axiosIns.put(`/api/dailyReceives/${id}`, dailyReceiveData);
        return response.data;
    } catch (error) {
        console.error('Error updating daily receive record:', error);
        throw error;
    }
};

export const deleteDailyReceive = async (id) => {
    try {
        const response = await axiosIns.delete(`/api/dailyReceives/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting daily receive record:', error);
        throw error;
    }
};