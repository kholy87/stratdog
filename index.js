const Discord = require('discord.js');
const config = require('./config.json');
const users = require('./users.json');
const embeds = require('./embeds.js');
const playlistEmbeds = require('./playlist.js');
const timerlib = require('easytimer.js').Timer;
const client = new Discord.Client();
const prefix = '!';
const ownerId = config.ownerId;

client.once('ready', () => {
	console.log('Ready!');
});

const messageType = {sound: 1, text: 2, help: 3, stop: 4, volume: 5, random: 6, ping: 7, wowCountdown: 8, wellnessCheck: 9};
const securityRole = {admin: 3, mod: 2, user: 1};

function setUserRole(userId){
    if (users[userId] !== undefined){
        return users[userId].role
    } else {
        return securityRole.user;
    }
};

const commands = {
    help: { type: messageType.help, toolTip: 'Display the available commands', role: securityRole.user},
    stop: { type: messageType.stop, toolTip: 'Stop bot from currently playing', role: securityRole.mod},
    volume: { type: messageType.volume, toolTip: 'change the volume of the bot (0.0-1.0)', role: securityRole.admin},
    ping: { type: messageType.ping, toolTip: 'This will show the ping of the BOT', role: securityRole.mod},
    random: { type: messageType.random, toolTip: 'Example: !random 3 | this will play 3 random sounds', role: securityRole.user},
    wow: { type: messageType.wowCountdown, toolTip: 'Show the countdown to the WoW Shadowlands Expansion!', role: securityRole.user},
    wellnesscheck: { type: messageType.wellnessCheck, toolTip: 'Have the bot ping someone to make sure they\'re okay', role: securityRole.mod},
    joke: { type: messageType.sound, file: 'JokeIsOver', role: securityRole.user},
    good: { type: messageType.sound, file: 'IAmGood', role: securityRole.user},
    ability: { type: messageType.sound, file: 'ability', role: securityRole.user},
    laugh1: { type: messageType.sound, file: 'laugh1', role: securityRole.user},
    sorry: { type: messageType.sound, file: 'sorry', role: securityRole.user},
    smirk: { type: messageType.sound, file: 'smirk', role: securityRole.user},
    yeah: { type: messageType.sound, file: 'yeah', role: securityRole.user},
    click: { type: messageType.sound, file: 'click', role: securityRole.user},
    okay: { type: messageType.sound, file: 'okay', role: securityRole.user},
    tongue: { type: messageType.sound, file: 'tongue', role: securityRole.user},
    shiton: { type: messageType.sound, file: 'shiton', role: securityRole.user},
    song1: { type: messageType.sound, file: 'song1', role: securityRole.user},
    tokyo: { type: messageType.sound, file: 'tokyo', role: securityRole.user},
    stretching: { type: messageType.sound, file: 'stretching', role: securityRole.user},
    countryroad: { type: messageType.sound, file: 'countryroad', role: securityRole.user},
    back: { type: messageType.sound, file: 'back', role: securityRole.user},
    blackcooking: { type: messageType.sound, file: 'blackcooking', http: 'https://www.youtube.com/watch?v=hh-Qn1d3DjA', role: securityRole.user},
    wtf: { type: messageType.sound, file: 'wtf', role: securityRole.user},
    yamero: { type: messageType.sound, file: 'yamero', role: securityRole.user},
    roasted: { type: messageType.sound, file: 'roasted', role: securityRole.user},
    stratus: { type: messageType.text, text: 'OH OH OH OH CODY CODY CODY, BF BF', role: securityRole.user},
    song2: { type: messageType.sound, file: 'song2', role: securityRole.user},
    twelve: { type: messageType.sound, file: 'twelve', role: securityRole.user},
    dinosaur: { type: messageType.sound, file: 'dinosaur', role: securityRole.user},
    upgrade: { type: messageType.sound, file: 'upgrade', role: securityRole.user},
    earlobe: { type: messageType.sound, file: 'earlobe', role: securityRole.user},
    scream: { type: messageType.sound, file: 'scream', role: securityRole.user},
    sneeze: { type: messageType.sound, file: 'sneeze', role: securityRole.user},
    pacman: { type: messageType.sound, file: 'pacman', role: securityRole.user},
    cube: { type: messageType.sound, file: 'cube', role: securityRole.user}
};

var playlist = [];

var isPlaying = false;

var volume = .7;

client.login(config.token);

client.on('ready', () => console.log('Active'));

client.on('message', async message => {
    if (message.author.bot) return;
    let userRole = setUserRole(message.author.id)
    console.log(message.author.username, ':', message.content);
    let args = message.content.substring(prefix.length).split(' ');
    if (message.content.startsWith(prefix)){
        for (let i = 0; i<args.length; i++){
            let userCommand = commands[args[i].toLowerCase()];
            if (userCommand !== undefined){
                if (userRole >= userCommand.role){
                    switch(userCommand.type){
                        case messageType.sound:{
                            playlist.push(userCommand);
                            if (!isPlaying){
                                playSoundFile(message);
                            }
                            break;
                        }
                        case messageType.text:{
                            message.channel.send(userCommand.text);
                            break;
                        }
                        case messageType.stop:{
                            message.member.voice.channel.leave();
                            isPlaying = false;
                            playlist = [];
                            return;
                        }
                        case messageType.volume:{
                            if (args[1] !== undefined){
                                volume = args[1];
                                message.channel.send("Volume has been set to level " + volume);
                                console.log("setting volume to :", args[1])
                            } else {
                                console.log("no volume passed in, ignore and skip command.")
                            }
                            
                            break;
                        }
                        case messageType.help: {
                            let helpText = 'Here are the available commands \n```ini\n';
                            Object.keys(commands).forEach(function (command){
                                helpText = helpText + prefix + command + ' ' + (commands[command].toolTip !== undefined ? '[' + commands[command].toolTip + ']': '') + '\n';
                            })
                            helpText = helpText + '```';
                            message.channel.send(helpText);
                            return;
                        }
                        case messageType.random: {
                            let randomSounds = [];
                            let numberToPlay = 1;
                            Object.values(commands).forEach(function(command){
                                if (command.type === messageType.sound){
                                    randomSounds.push(command);
                                }
                            });
                            if (args[1] !== undefined){
                                numberToPlay = args[1];
                            }
                            for (let x = 0; x < numberToPlay; x++){
                                let randomCommand = randomSounds[Math.floor(Math.random() * randomSounds.length)];
                                playlist.push(randomCommand);
                                
                            }
                            if (!isPlaying){
                                playSoundFile(message);
                            }
                            message.channel.send({ embed: playlistEmbeds(playlist) });
                            break;
                        }
                        case messageType.ping: {
                            const m = await message.channel.send("Ping?");
                            m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
                            break;
                        }
                        case messageType.wellnessCheck: {
                            let checkUser = args[1];
                            message.channel.send(`OH OH OH, ` + checkUser + ` wya, wya!`);
                            break;
                        }
                        case messageType.wowCountdown: {
                            var countDownDate = new Date("Oct 26, 2020 18:00:00").getTime();
                              // Get today's date and time
                            var now = new Date().getTime();

                            // Find the distance between now and the count down date
                            var distance = countDownDate - now;
                            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                           
                            let timer = new timerlib();
                            timer.start({
                                countdown: true,
                                startValues: {          // Temp for testing purposes.
                                    days,
                                    hours,
                                    minutes
                                },
                                precision: 'seconds'    // TODO: does not handle small amounts of time well. eg 3h 25mins etc
                            });

                            let title = 'WoW Shadowlands Release!';
                            let embedmsg;
                            message.channel.send({ embed: embeds(message.author.tag, days, hours, minutes, title) }).then( m => embedmsg = m);

                            timer.on('minutesUpdated', () => {
                                minutes = timer.getTimeValues().minutes; //FOR TESTING
                                embedmsg.edit({ embed: embeds(message.author.tag, days, hours, minutes, title) });
                            });
                    
                            timer.on('hoursUpdated', () => {
                                hours = timer.getTimeValues().hours; // FOR TESTING
                                embedmsg.edit({ embed: embeds(message.author.tag, days, hours, minutes, title) });
                            });
                    
                            timer.on('daysUpdated', () => {
                                days = timer.getTimeValues().days; // FOR TESTING
                                embedmsg.edit({ embed: embeds(message.author.tag, days, hours, minutes, title) });
                            })
                    
                            timer.on('targetAchieved', () => {
                                message.reply(`The reminder titled \`${title}\` has finished!`);
                            });

                        }
                        default:{

                        }
                    }
                    if (userCommand.http !== undefined){
                        message.channel.send(userCommand.http);
                    }
                } else {
                    message.channel.send('You need the role ' + userCommand.role + ' to execute this command. Your current role is ' + userRole);
                }
            } else {
                //message.channel.send('Command ' + args[i] + ' doesn\'t exist, type !help to see available commands')
            }
        }
    }
});

async function playSoundFile(message){
    isPlaying = true;
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
    let soundFile = 'sounds/' + playlist.shift().file + '.mp3';
    const dispatcher = connection.play(soundFile, { volume: volume })
    .on('finish', () =>{
        //check array for additional songs
        if (playlist.length>0) {
            //if songs remaining play next
            playSoundFile(message);
        } else {
            //if none leave
            voiceChannel.leave();
            isPlaying = false;
        }
    })
    .on('error', error => {
        console.log(error);
    })

};