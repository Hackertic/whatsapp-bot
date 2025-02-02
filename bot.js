// Import necessary modules
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { sessionId } = require('./config');

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
});

// Variables to keep track of command states
let antilinkEnabled = false;
let antiwordEnabled = false;
let warnEnabled = false;
let greetingsEnabled = false;
let blockedWords = [];

// Event listener for when the bot is ready
client.on('ready', () => {
    console.log('Bot is ready!');
});

// Event listener for QR code generation
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true }); // Show QR code in terminal for scanning
});

// Command Handlers

// Anti-link functionality
client.on('message', async message => {
    if (message.body === '.Antilink on' && message.fromMe) {
        antilinkEnabled = true;
        client.sendMessage(message.from, 'Antilink enabled');
    } else if (message.body === '.Antilink off' && message.fromMe) {
        antilinkEnabled = false;
        client.sendMessage(message.from, 'Antilink disabled');
    }

    // If Anti-link is enabled, delete links and kick users (but not admins)
    if (antilinkEnabled && message.body.match(/https?:\/\/[^\s]+/)) {
        const chat = await message.getChat();
        const participant = await chat.getParticipant(message.author);
        // Check if the user is not an admin
        if (!participant.isAdmin) {
            await message.delete();
            await chat.removeParticipants([message.author]);
            client.sendMessage(chat.id, 'Pls links are not allowed by users in this group. You will be kicked out if you continue.');
        }
    }

    // Antiword functionality
    if (message.body.startsWith('.Antiword ') && message.fromMe) {
        blockedWords = message.body.split(' ').slice(1);
        client.sendMessage(message.from, 'Antiword updated');
    }

    if (antiwordEnabled && blockedWords.some(word => message.body.includes(word))) {
        await message.delete();
        client.sendMessage(message.from, 'Please avoid using blocked words.');
    }

    // Warn functionality
    if (warnEnabled && message.body.match(/https?:\/\/[^\s]+/)) {
        let warnings = 0;
        // Implement warning count logic
        warnings++;
        const chat = await message.getChat();
        const participant = await chat.getParticipant(message.author);
        // Check if the user is not an admin
        if (!participant.isAdmin) {
            if (warnings >= 3) {
                await message.delete();
                await chat.removeParticipants([message.author]);
                client.sendMessage(chat.id, 'You have been kicked out due to multiple link warnings.');
            } else {
                client.sendMessage(message.from, `Pls links are not allowed by users in this group. Warning ${warnings}/3`);
            }
        } else {
            // Don't warn admins
            client.sendMessage(message.from, 'Admins are exempt from warnings.');
        }
    }

    // Greetings functionality
    if (message.body === '.Greetings on' && message.fromMe) {
        greetingsEnabled = true;
        client.sendMessage(message.from, 'Greeting message enabled');
    } else if (message.body === '.Greetings off' && message.fromMe) {
        greetingsEnabled = false;
        client.sendMessage(message.from, 'Greeting message disabled');
    }

    if (greetingsEnabled && message.newMessage) {
        client.sendMessage(message.chatId, `Welcome to the group, ${message.author}!`);
    }

    // Hidetag functionality
    if (message.body === '.Hidetag' && message.fromMe) {
        const chat = await message.getChat();
        const users = chat.participants;
        let tags = '';
        users.forEach(user => {
            tags += `@${user.id.user} `;
        });
        client.sendMessage(chat.id, tags, { mentions: users });
    }

    // List all commands
    if (message.body === '.List' && message.fromMe) {
        client.sendMessage(message.from, `
Commands Available:
1. .Antilink on/off
2. .Antiword [list of words]
3. .warn [links]
4. .Hidetag
5. .Greetings on/off
6. .List
        `);
    }
});

// Initialize client
client.initialize();