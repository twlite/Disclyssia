'use strict';

const Endpoints = require('./Gateway/Endpoints');
const WebSocket = require('./Gateway/WebSocket');
const Payloads = require('./Gateway/Payloads');

const { EventEmitter } = require('events');
const axios = require('axios');
const FormData = require('form-data');

module.exports = class Client extends EventEmitter {
    /**
     * The Client class
     * @param token
     */
    constructor(token = null) {
        super();
        this.token = token;
        this.ws = new WebSocket(this);
        this.user = null;

        this.ws.on('ready', (user) => {
            this.user = user;
            this.emit('ready', this);
        });
        this.ws.on('message', (message) => this.emit('message', message));
    }

    /**
     * Connects the client to the Discord gateway
     * @param token
     */
    login(token) {
        this.token = token || this.token;
        this.ws.connect(this.token);
    }

    /**
     * Disconnects the client from the Discord gateway
     */
    logout() {
        this.ws.disconnect();
    }

    /**
     * Changes the client presence
     * @param data
     * @returns {Promise<unknown>} Void promise
     */
    setPresence(data) {
        return new Promise((resolve, reject) => {
            try {
                this.ws.WSSend(Payloads.PRESENCE(data));
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Create a message to a text channel
     * @param channelId
     * @param data
     * @returns {Promise<unknown>} Returns the message sent to Discord
     */
    sendMessage(channelId, data) {
        return new Promise((resolve, reject) => {
            if (!this.token)
                reject(new Error("No token provided, use Client#login() to set it"));
            if (!channelId)
                reject(new Error("No channelId provided, channelId is required to use Client#sendMessage()"));
            const form = new FormData();
            if (data.file && typeof data.file === 'object')
                form.append(data.file.name, data.file.attachment, data.file.name);
            if (data.files) {
                for (let i = 0; i < data.files.length; i++) {
                    let file = data.files[i];
                    form.append(file.name, file.attachment, file.name);
                }
            }
            if (data.embed && data.embed.rich)
                data.embed = data.embed.rich;
            if (data.embeds) {
                for (let i = 0; i < data.embeds.length; i++) {
                    let embed = data.embeds[i];
                    if (embed && embed.rich)
                        data.embed[i] = embed.rich;
                }
            }
            form.append('payload_json', JSON.stringify(data));
            axios.post(Endpoints.BASE_URL + '/channels/' + channelId + '/messages', form, {
                headers: Object.assign({ 'Authorization': 'Bot ' + this.token, }, form.getHeaders())
            })
                .then((response) => resolve(response.data))
                .catch(reject);
        });
    }
};