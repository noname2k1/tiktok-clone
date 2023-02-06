import axios from 'axios';

const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

const get = async (url, config) => {
    const res = await httpRequest.get(url, config);
    return res.data;
};

const post = async (url, config) => {
    const res = await httpRequest.post(url, config);
    return res.data;
};

const put = async (url, config) => {
    const res = await httpRequest.put(url, config);
    return res.data;
};

const patch = async (url, config) => {
    const res = await httpRequest.patch(url, config);
    return res.data;
};

const del = async (url, config) => {
    const res = await httpRequest.delete(url, config);
    return res.data;
};

export { get, post, put, patch, del };
export default httpRequest;
