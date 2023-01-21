import axios from 'axios';

const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

const get = async (url, config) => {
    const res = await httpRequest.get(url, config);
    return res.data;
};

export { get };
