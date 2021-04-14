const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
let { MessageEmbed } = require("discord.js");
module.exports = function genEmbed(guildRoster, guildName){
    let description = '';
    if (guildRoster.members !== undefined){
        for (let i = 0; i<guildRoster.members.length; i++){
            guildMember = guildRoster.members[i].character;
            description = description + guildMember.name + ': ' + guildMember.raiderIOScore + '\n';
        }

    }
    let embed = new MessageEmbed()
                            .setFooter("Raider.IO Scores by StratDog")
                            .setColor("#33ccff")
                            .setTimestamp()
                            .setTitle("Raider.IO Scores for Guild " + guildName)
                            .setDescription(description)
    return embed;

                            
};