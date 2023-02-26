import * as httpRequest from '~/utils/httpRequest';

const login = (email, password) => {
    return new Promise((resolve, reject) => {
        httpRequest
            .post('auth/login', {
                email,
                password,
            })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err.response.data);
            });
    });
};

const signup = (email, password, type = 'email') => {
    return new Promise((resolve, reject) => {
        httpRequest
            .post('auth/register', {
                email,
                password,
                type,
            })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err.response.data);
            });
    });
};

const updateMyProfile = async (data) => {
    try {
        const res = await httpRequest.post('auth/me?_method=PATCH', data);
        return res.data;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};
export { login, signup, updateMyProfile };
