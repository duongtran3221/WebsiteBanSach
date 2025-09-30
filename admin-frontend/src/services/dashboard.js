import axios from 'axios'

const API_URL = "http://localhost:3000";
export const getDonHangGanDay = async() => {
    try {
        const response = await axios.get(`${API_URL}/donhang/getdonhangganday`);
        return response.data;
    } 
    catch (error) {
        throw error;
    }
}

export const getThongKeHomNay = async() => {
    try {
        const response = await axios.get(`${API_URL}/thongke/homnay`);
        return response.data.data;
    } 
    catch (error) {
        throw error;
    }
}

export const getBestSellingBooks = async() => {
    try {
        const response = await axios.get(`${API_URL}/thongke/bestsellbook`);
        return response.data.data;
    } 
    catch (error) {
        throw error;
    }
}