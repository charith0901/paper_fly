import axiosIns from '../../utils/axiosIns';

export const getAllNewspapers = async () => {
  try {
    const response = await axiosIns.get('/api/newspapers');
    return response.data;
  } catch (error) {
    console.error('Error fetching newspapers:', error);
    throw error;
  }
};

export const getNewspaperById = async (id) => {
  try {
    const response = await axiosIns.get(`/api/newspapers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching newspaper by ID:', error);
    throw error;
  }
};


export const addNewspaper = async (newspaperData) => {
  try {
    const response = await axiosIns.post('/api/newspapers', newspaperData);
    return response.data;
  } catch (error) {
    console.error('Error adding newspaper:', error);
    throw error;
  }
};

export const updateNewspaperPrice = async (id, price) => {
  try {
    const response = await axiosIns.patch(`/api/newspapers/${id}`, { price });
    return response.data;
  } catch (error) {
    console.error('Error updating newspaper price:', error);
    throw error;
  }
};

export const deleteNewspaper = async (id) => {
  try {
    const response = await axiosIns.delete(`/api/newspapers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting newspaper:', error);
    throw error;
  }
};
