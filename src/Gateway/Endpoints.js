'use strict';

const Constants = require('../Constants');

module.exports.BASE_URL = 'https://discordapp.com/api/v' + Constants.API_VERSION;
module.exports.CDN_URL = 'http://cdn.discordapp.com';
module.exports.GATEWAY = 'wss://gateway.discord.gg';
module.exports.USER = (userId) => `/users/${userId}`;
module.exports.CHANNELS = (userId) => `/users/${userId}/channels`;
module.exports.CHANNEL = (channelId) => `/channels/${channelId}`;
module.exports.GUILDS = (userId) => `/users/${userId}/guilds`;
module.exports.GUILD = (guildId) => `/guilds/${guildId}`;
module.exports.GUILD_MEMBERS = (guildId) => `/guilds/${guildId}/members`;
module.exports.GUILD_MEMBER = (guildId, userId) => `/guilds/${guildId}/members/${userId}`;