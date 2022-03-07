import axios from 'axios';

export const getMainCarousel = async() => {
    const response = await axios.get("/api/app/main-carousel");
    return response.data;
};