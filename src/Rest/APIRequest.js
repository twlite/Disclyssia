'use strict';

const axios = require('axios');
const Endpoints = require('../Gateway/Endpoints');

module.exports = class APIRequest {
    constructor(client) {
        this._client = client;
    }

    make(method, endpoint, options = {}) {
        return new Promise((resolve, reject) => {
            axios({
                method,
                url: Endpoints.BASE_URL + endpoint,
                data: options.data || null,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bot ${this._client.token}`
                }
            })
            .then((response) => resolve(response.data))
            .catch(reject);
        });
    }
};