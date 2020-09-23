const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();
const prefix = '!';
const ownerId = config.ownerId;

client.once('ready', () => {
	console.log('Ready!');
});

const messageType = {sound: 1, text: 2} 

const commands = {
    joke: { type: messageType.sound, file: 'JokeIsOver'},
    good: { type: messageType.sound, file: 'IAmGood'},
    ability: { type: messageType.sound, file: 'ability'},
    laugh1: { type: messageType.sound, file: 'laugh1'},
    sorry: { type: messageType.sound, file: 'sorry'},
    smirk: { type: messageType.sound, file: 'smirk'},
    yeah: { type: messageType.sound, file: 'yeah'},
    click: { type: messageType.sound, file: 'click'},
    okay: { type: messageType.sound, file: 'okay'},
    tongue: { type: messageType.sound, file: 'tongue'},
    shiton: { type: messageType.sound, file: 'shiton'},
    song1: { type: messageType.sound, file: 'song1'},
    tokyo: { type: messageType.sound, file: 'tokyo'},
    stretching: { type: messageType.sound, file: 'stretching'},
    countryroad: { type: messageType.sound, file: 'countryroad'},
    back: { type: messageType.sound, file: 'back'},
    blackcooking: { type: messageType.sound, file: 'blackcooking', http: 'https://www.youtube.com/watch?v=hh-Qn1d3DjA'},
    wtf: { type: messageType.sound, file: 'wtf'},
    yamero: { type: messageType.sound, file: 'yamero'},
    roasted: { type: messageType.sound, file: 'roasted'},
    stratus: { type: messageType.text, text: 'OH OH OH OH CODY CODY CODY, BF BF'},
    song2: { type: messageType.sound, file: 'song2'},
    twelve: { type: messageType.sound, file: 'twelve'},
    dinosaur: { type: messageType.sound, file: 'dinosaur'},
    upgrade: { type: messageType.sound, file: 'upgrade'},
    earlobe: { type: messageType.sound, file: 'earlobe'},
    scream: { type: messageType.sound, file: 'scream'},
    sneeze: { type: messageType.sound, file: 'sneeze'}
};


client.login(config.token);

client.on('ready', () => console.log('Active'));

client.on('message', async message => {
    if (message.author.bot) return;
    console.log(message.content);
    let args = message.content.substring(prefix.length).split(' ');
    if (message.content.startsWith(prefix)){
        for (let i = 0; i<args.length; i++){
            let userCommand = commands[args[i]];
            if (args[i].toLowerCase() === "help"){
                let helpText = 'Here are the available commands \n```';
                Object.keys(commands).forEach(function (command){
                    helpText = helpText + prefix + command + '\n';
                })
                helpText = helpText + '```';
                message.channel.send(helpText);
                return;
            }
            if (args[i].toLowerCase() === 'stop' && message.author.id === ownerId)
            {
                //how do i kill the async voice from here????
                message.voiceChannel.leave();
            }
            if (userCommand !== undefined){
                if (userCommand.type === messageType.sound){
                    playSoundFile(message, userCommand.file);
                } else if (userCommand.type === messageType.text) {
                    message.channel.send(userCommand.text);
                }
                if (userCommand.http !== undefined){
                    message.channel.send(userCommand.http);
                }
            } else {
                message.channel.send('Command doesn\'t exist, type !help to see available commands')
            }
        }
    }
});

async function playSoundFile(message, soundFile){
    soundFile = 'sounds/' + soundFile + '.mp3';
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send('nahhhh - You need to be in a voice channel to use this command');
    const permissions = voiceChannel.permissionsFor(message.client.user)
    if (!permissions.has('CONNECT')) return message.channel.send('nahhhh - I don\'t have permissions to join the voice channel'); 
    if (!permissions.has('SPEAK')) return message.channel.send('nahhhh - I don\'t have permissions to speak in the voice channel'); 

    try {
        var connection = await voiceChannel.join();
    } catch (error){
        console.log('error: ${error}')
    }
    
    const dispatcher = connection.play(soundFile, { volume: 0.7 })
    .on('finish', () =>{
        voiceChannel.leave();
    })
    .on('error', error => {
        console.log(error);
    })
};