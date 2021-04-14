const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const axios = require('axios');
let { MessageEmbed } = require("discord.js");
module.exports = function genEmbed(characterName, score){
    let description = '';
    
    let embed = new MessageEmbed()
                            .setFooter("Raider.IO Scores by StratDog")
                            .setColor("#33ccff")
                            .setTimestamp()
                            .setTitle("Raider.IO Scores for Guild " + guildName)
                            .setDescription(description)
    return embed;

                            
};