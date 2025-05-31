import axiosIns from "../../utils/axiosIns";

export const createBill = async (billData) => {
    try {
        const response = await axiosIns.post('/api/bills', billData);
        return response.data;
    } catch (error) {
        console.error('Error creating bill:', error);
        throw error;
    }
}

export const getAllBills = async () => {
    try {
        const response = await axiosIns.get('/api/bills');
        return response.data;
    } catch (error) {
        console.error('Error fetching bills:', error);
        throw error;
    }
};

export const getBillById = async (id) => {
    try {
        const response = await axiosIns.get(`/api/bills/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching bill:', error);
        throw error;
    }
}

export const updateBill = async (id, billData) => {
    try {
        const response = await axiosIns.put(`/api/bills/${id}`, billData);
        return response.data;
    } catch (error) {
        console.error('Error updating bill:', error);
        throw error;
    }
};

export const deleteBill = async (id) => {
    try {
        const response = await axiosIns.delete(`/api/bills/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting bill:', error);
        throw error;
    }
};

export const calculateBillTotalsAndUpdate = async (id) => {
    try {
        const response = await axiosIns.put(`/api/bills/${id}/calculate`);
        return response.data;
    } catch (error) {
        console.error('Error calculating bill totals:', error);
        throw error;
    }
}