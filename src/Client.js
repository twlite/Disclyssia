'use strict';

const Endpoints = require('./Gateway/Endpoints');
const WebSocket = require('./Gateway/WebSocket');
const Payloads = require('./Gateway/Payloads');
const APIRequest = require('./Rest/APIRequest');

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
        this._APIRequest = new APIRequest(this);
        /* Declare client events */
        this.ws.on('ready', (user) => {
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
     * @returns {Promise<void>} Void promise
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
     * Get client information
     * @returns {Promise<Object>} Returns a promise object of the client user
     */
    getSelf() {
        return this._APIRequest.make('get', Endpoints.USER('@me'));
    }

    /**
     * Updates information of the client
     * @param data
     * @returns {Promise<Object>}
     */
    updateSelf(data = {}) {
        return this._APIRequest.make('patch', Endpoints.USER('@me'), { data });
    }

    /**
     * Get a specified user
     * @param userId
     * @returns {Promise<Object>} Returns a promise object of a specified user
     */
    getUser(userId) {
        return this._APIRequest.make('get', Endpoints.USER(userId));
    }

    /**
     * Get all guilds where the client is
     * @returns {Promise<Object>} Returns a promise object of the client guilds
     */
    getGuilds() {
        return this._APIRequest.make('get', Endpoints.GUILDS('@me'));
    }

    /**
     * Get a specified guild
     * @param guildId
     * @returns {Promise<Object>} Returns a promise object of a specified guild
     */
    getGuild(guildId) {
        return this._APIRequest.make('get', Endpoints.GUILD(guildId));
    }

    /**
     * Get all channels where the client has an access to read
     * @returns {Promise<Object>} Returns a promise object of the client channels
     */
    getChannels() {
        return this._APIRequest.make('get', Endpoints.CHANNELS('@me'));
    }

    /**
     * Get a specified channel
     * @param channelId
     * @returns {Promise<Object>} Returns a promise object of the client user
     */
    getChannel(channelId) {
        return this._APIRequest.make('get', Endpoints.CHANNEL(channelId));
    }

    /**
     * Create a message to a text channel
     * @param channelId
     * @param data
     * @returns {Promise<Object>} Returns the message sent to Discord
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
