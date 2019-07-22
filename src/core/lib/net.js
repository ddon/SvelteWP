import axios from 'axios';
import qs from 'qs';


export function get(url, params) {
    params = params || {};

    return axios.get(url, { params }).then((res) => {
        return new Promise((resolve) => {
            resolve(res.data);
        });
    });
}


export function post(url, params) {
    params = params || {};

    return axios.post(url, qs.stringify(params)).then((res) => {
        return new Promise((resolve) => {
            resolve(res.data);
        });
    });
}
