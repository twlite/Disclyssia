const Discord = require('../index');
const client = new Discord.Client();

client.on('ready', (client) => {
    console.log(`${client.user.username}#${client.user.discriminator} is online !`);
    client.setPresence({ game: { name: 'Hello, World!' } });
});

client.on('message', (message) => {
    if (message.content.startsWith('!ping')) {
        client.sendMessage(message.channel_id, {
            content: 'Pong!'
        }).catch();
    }
});

client.login(''); // put your bot token here