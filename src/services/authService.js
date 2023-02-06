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

export { login };
