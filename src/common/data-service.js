import request from 'superagent'
import { API_URL } from '../const';

const getApiGenerator = next => (route, name, action, token) => request
    .get(API_URL + route)
    .set('accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
        console.error(err);
        if (err) {
            return next({
                type: name + '_ERROR',
                payload: err.response.body,
                action
            })
        }
        const data = JSON.parse(res.text)
        next({
            type: name + '_RECEIVED',
            payload: data,
            action
        })
    })

const postApiGenerator = next => (route, name, data) => request
    .post(API_URL + route)
    .send(JSON.stringify(data))
    .set('accept', 'application/json')
    .set('Content-Type', 'application/json')
    .end((err, res) => {
        if (err) {
            return next({
                type: name + '_ERROR',
                payload: err.response.body
            })
        }
        const data = JSON.parse(res.text)
        next({
            type: name + '_RECEIVED',
            payload: data
        })
    })

const dataService = store => next => action => {
    next(action)
    const token = store.getState().auth.token;
    console.log(token);
    switch (action.type) {
        case 'GET_TOKEN':
            postApiGenerator(next)('token', 'GET_TOKEN', action.payload)
            break;
        case 'GET_MASTERDATA_ALL':
            getApiGenerator(next)('all', 'GET_MASTERDATA_ALL', action.payload, token)
            break;
        case 'GET_MASTERDATA_VERSION':
            getApiGenerator(next)('version', 'GET_MASTERDATA_VERSION', action.payload, token)
            break;
        default:
            break
    }

};

export default dataService;