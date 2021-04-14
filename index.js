const Discord = require('discord.js');
const config = require('./config.json');
const users = require('./users.json');
const embeds = require('./embeds.js');
const axios = require('axios');
const ytdl = require('ytdl-core');
const playlistEmbeds = require('./playlist.js');
const grioEmbeds = require('./embeds/grio.js');
const timerlib = require('easytimer.js').Timer;
const client = new Discord.Client();
const Canvas = require('canvas');
const simpleOauth2 = require("simple-oauth2");
const prefix = '!';
const ownerId = config.ownerId;

var b64string = config.BNET_ID + ":" + config.BNET_SECRET;
var buf = Buffer.from(b64string, 'base64'); // Ta-da

function refreshTime(){
    return new Date(new Date().getTime() - 60 * 60 * 1 * 1000);
}

const blizzard = require('blizzard.js').initialize({
    key: config.BNET_ID,
    secret: config.BNET_SECRET,
    origin: 'us', // optional
    locale: 'en_US' // optional
  });

checkBlizzardToken();

function checkBlizzardToken(){
    if ((blizzard.defaults.lastRefreshed === undefined) || (new Date() > blizzard.defaults.lastRefreshed)){
        console.log('REFRESHING TOKEN')
        blizzard.getApplicationToken()
        .then(response => {
            blizzard.defaults.token = response.data.access_token
            blizzard.defaults.lastRefreshed = new Date();
        });
    }
}

client.once('ready', () => {
	console.log('Booting up...');
});

const messageType = {sound: 1, text: 2, help: 3, stop: 4, volume: 5, random: 6, ping: 7, freedom: 8, wellnessCheck: 9, raiderio: 10, gitHub: 11, guildRio: 12};
const securityRole = {admin: 3, mod: 2, user: 1};

function setUserRole(userId){
    if (users[userId] !== undefined){
        return users[userId].role
    } else {
        return securityRole.user;
    }
};

const userIntroSongs = {
    "119896928745029632": { type: messageType.sound, file: 'joeintro2'},
    "118892076627787776": { type: messageType.sound, file: 'holyintro2' },
    "184466926901133313": { type: messageType.sound, file: 'mattintro2'},
    "112676666102292480": { type: messageType.sound, file: 'snipesintro'},
    "226819805968203787": { type: messageType.sound, file: 'kenintro'},
    "138114465718599680": { type: messageType.sound, file: 'tonyintro2'},
    "107662388752306176": { type: messageType.sound, file: 'teddyintro'},
    "320757397234778123": { type: messageType.sound, file: 'archie'},
    "321491932629172224": { type: messageType.sound, file: 'cam'}
    
}

const commands = {
    help: { type: messageType.help, toolTip: 'Display the available commands', role: securityRole.user},
    stop: { type: messageType.stop, toolTip: 'Stop bot from currently playing', role: securityRole.mod},
    volume: { type: messageType.volume, toolTip: 'change the volume of the bot (0.0-1.0)', role: securityRole.admin},
    ping: { type: messageType.ping, toolTip: 'This will show the ping of the BOT', role: securityRole.mod},
    random: { type: messageType.random, toolTip: 'Example: !random 3 | this will play 3 random sounds', role: securityRole.user},
    freedom: { type: messageType.freedom, toolTip: 'Show the countdown Paleroni being unbanned', role: securityRole.user},
    wellnesscheck: { type: messageType.wellnessCheck, toolTip: 'Have the bot ping someone to make sure they\'re okay', role: securityRole.mod},
    rio: {type: messageType.raiderio, role: securityRole.user, toolTip: "type !rio username realm to get raider.IO score"},
    github: {type: messageType.gitHub, role: securityRole.user, toolTip: "Show the url to the GitHub"},
    grio: {type: messageType.guildRio, role: securityRole.user, toolTip: "type !grio guildname realm to get guild raider.IO score"},
    joke: { type: messageType.sound, file: 'JokeIsOver', role: securityRole.user},
    good: { type: messageType.sound, file: 'IAmGood', role: securityRole.user},
    ability: { type: messageType.sound, file: 'ability', role: securityRole.user},
    laugh1: { type: messageType.sound, file: 'laugh1', role: securityRole.user},
    sorry: { type: messageType.sound, file: 'sorry', role: securityRole.user},
    //smirk: { type: messageType.sound, file: 'smirk', role: securityRole.user},
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
    //pacman: { type: messageType.sound, file: 'pacman', role: securityRole.user},
    //cube: { type: messageType.sound, file: 'cube', role: securityRole.user},
    welost: { type: messageType.sound, file: 'welost', role: securityRole.user},
    wtf2: { type: messageType.sound, file: 'wtf2', role: securityRole.user},
    soyouhave: { type: messageType.sound, file: 'soyouhave', role: securityRole.user},
    drake: { type: messageType.sound, file: 'drake', role: securityRole.user},
    wtf3: { type: messageType.sound, file: 'wtf3', role: securityRole.user},
    wheresmyboy: { type: messageType.sound, file: 'wheresmyboy', role: securityRole.user},
    yougotme: { type: messageType.sound, file: 'yougotme', role: securityRole.user},
    anger: { type: messageType.sound, file: 'anger', role: securityRole.user},
    nah: { type: messageType.sound, file: 'nah', role: securityRole.user},
    holy: { type: messageType.sound, file: 'holy', role: securityRole.user},
    holy2: { type: messageType.sound, file: 'holy2', role: securityRole.user},
    meme: { type: messageType.sound, file: 'meme', role: securityRole.user},
    finish: { type: messageType.sound, file: 'finish', role: securityRole.user},
    backmeup: { type: messageType.sound, file: 'backmeup', role: securityRole.user},
    peaked: { type: messageType.sound, file: 'peaked', role: securityRole.user},
    beefbois: { type: messageType.sound, file: 'beefbois', role: securityRole.user},
    snore: { type: messageType.sound, file: 'snore', role: securityRole.user},
    chickenwing: { type: messageType.sound, file: 'chickenwing', role: securityRole.user },
    noo: { type: messageType.sound, file: 'nooo', role: securityRole.user},
    archie: { type: messageType.sound, file: 'archie', role: securityRole.user},
    slowarchie: { type: messageType.sound, file: 'slowarchie', role: securityRole.user},
    fastarchie: { type: messageType.sound, file: 'fastarchie', role: securityRole.user},
    noyes: { type: messageType.sound, file: 'noyes', role: securityRole.user},
    slownoyes: { type: messageType.sound, file: 'slownoyes', role: securityRole.user},
    istupid: { type: messageType.sound, file: 'istupid', role: securityRole.user},
    rox: { type: messageType.sound, file: 'rox', role: securityRole.user },
    wyze: { type: messageType.sound, file: 'wyze', role: securityRole.user },
    cam: { type: messageType.sound, file: 'cam', role: securityRole.user },
    failed: { type: messageType.sound, file: 'failed', role: securityRole.user }
};

var playlist = [];

var isPlaying = false;

var volume = .7;

client.login(config.token);

client.on('ready', () => console.log('Logged in and ready to receive commands'));

client.once('reconnecting', () => {
    console.log('Reconnecting!');
   });

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (ctx.measureText(text).width > canvas.width - 300);

	// Return the result to use in the actual canvas
	return ctx.font;
};

client.on('guildMemberAdd', async member => {
    console.log('Member Joined!')
	const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./wallpaper.png');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	// Slightly smaller text placed above the member's display name
	ctx.font = '28px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

	// Add an exclamation point here and below
	ctx.font = applyText(canvas, `${member.displayName}!`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`Welcome to the server, ${member}!`, attachment);
});

client.on('voiceStateUpdate', (oldState, newState) => {
    introInfo = userIntroSongs[newState.id];
    if (oldState.channelID !== newState.channelID){
        if (introInfo !== undefined && newState.channelID === '784295420322775040'){
            playlist.push(introInfo);
            if (!isPlaying){
                playSoundFile(newState);
            }
            console.log("Playing Intro for " + newState.member.nickname)
        }
    }
 });

client.on('message', async message => {
    if (message.author.bot) return;
    let userRole = setUserRole(message.author.id)
    let args = message.content.substring(prefix.length).split(' ');
    if (message.content.startsWith(prefix)){
        console.log(message.author.username + ':', message.content);
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('nahhhh - You need to be in a voice channel to use this command');
        const permissions = voiceChannel.permissionsFor(message.client.user)
        if (!permissions.has('CONNECT')) return message.channel.send('nahhhh - I don\'t have permissions to join the voice channel'); 
        if (!permissions.has('SPEAK')) return message.channel.send('nahhhh - I don\'t have permissions to speak in the voice channel'); 
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
                                console.log("no volume passed in, ignored and skipped command.")
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
                        case messageType.raiderio: {
                            let characterName = args[1];
                            let realmName = args[2] || "sargeras";
                            let raaiderIOScore = await getRaiderIOScores(characterName, realmName);
                            message.channel.send("Raider.IO Score for "+ characterName + "-" + realmName + ": " + raaiderIOScore)
                            break;
                        }
                        case messageType.guildRio: {
                            let guildName = args[1];
                            let realmName = args[2] || "sargeras";
                            let m = await message.channel.send("Loading guild scores for " + guildName + "...");
                            let guildRoster = await getGuildRioScores(guildName, realmName);
                            if (guildRoster.members !== undefined){
                                let guildRosterText = 'Raider.IO Scores for Guild: ' + guildName + ' \n```ini\n';;
                                guildRoster.members.forEach(function (guildMember){
                                    if (guildMember.character.raiderIOScore !== 0){
                                        guildRosterText = guildRosterText + guildMember.character.name + ': ' + '[' + guildMember.character.raiderIOScore + ']' + '\n';
                                    }
                                })
                                guildRosterText = guildRosterText + '```';
                                m.edit(guildRosterText);
                            } else {
                                m.edit("No Members found");
                            }
                            
                            break;
                        }
                        case messageType.gitHub: {
                            message.channel.send('https://github.com/kholy87/stratdog')
                            break;
                        }
                        case messageType.freedom: {
                            let countDownDate = new Date(2020, 11, 8, 20, 55, 0, 0).getTime();
                              // Get today's date and time
                              let now = new Date().getTime();

                            // Find the distance between now and the count down date
                            let distance = countDownDate - now;
                            //console.log(now, countDownDate, distance);
                            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
                            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                           
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

                            let title = 'Time until Paleroni is FREE from his awful ban';
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
                                message.reply(`HE'S FREE BOYS!!!!!!! LETS GO!!!!!! HOLY IS FREEEEEEEE!!!!!!! `);
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

async function getRaiderIOScores(user, realm){
    let url = 'https://raider.io/api/v1/characters/profile?region=us&realm=' + realm +'&name=' + user + '&fields=mythic_plus_scores_by_season:current';
    let data
    await axios.get(url)
    .then(function (response) {
        // handle success
        //console.log(response);
        data = response.data;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .then(function () {
        // always executed
    });
    if (data !== undefined && data.mythic_plus_scores_by_season[0].scores) {
        return data.mythic_plus_scores_by_season[0].scores.all;
    }
    return 0;
};

async function getGuildRioScores(guild, realm, forceUpdate){
    if (forceUpdate || guilds[guild] === undefined || guilds[guild].lastRefreshed < refreshTime()){
        console.log('refreshing guild: ', guild)
        guilds[guild] = { lastRefreshed: new Date(), members: await getGuildRoster(guild, realm)}
    }
    if (guilds[guild] !== undefined && guilds[guild].members !== undefined){
        for (let i = 0; i<guilds[guild].members.length; i++){
            if (guilds[guild].members[i].character.raiderIOScore === undefined || guilds[guild].members[i].character.lastRefreshed < refreshTime()){
                guilds[guild].members[i].character.lastRefreshed = new Date();
                guilds[guild].members[i].character.raiderIOScore = await getRaiderIOScores(guilds[guild].members[i].character.name, realm);
                console.log("Updating info for: ", guilds[guild].members[i].character.name, guilds[guild].members[i].character.raiderIOScore)
            }
        }
    }
    return guilds[guild]
}  

var guilds = {}

async function getGuildRoster(guild, realm){
    await checkBlizzardToken();
    let url = 'https://us.api.blizzard.com/data/wow/guild/' + realm + '/' + guild + '/roster?namespace=profile-us&locale=en_US&access_token=' + blizzard.defaults.token;
    let data = "";
    await axios.get(url)
    .then(function (response) {
        // handle success
        //console.log(response);
        data = response.data;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .then(function () {
        // always executed
    });
    return data.members;
};

async function playSoundFile(message){
    
    const voiceChannel = message.member.voice.channel;
    isPlaying = true;
    try {
        var connection = await voiceChannel.join();
    } catch (error){
        console.log('error: ' + error)
        message.member.voice.channel.leave();
        isPlaying = false;
        playlist = [];
        return;
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