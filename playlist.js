const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
let { MessageEmbed } = require("discord.js");
module.exports = function genEmbed(playlist){
    let description = '';
    console.log(playlist);
    if (playlist !== undefined){
        for (let i = 0; i<playlist.length; i++){
            let number = i+1;
            description = description + number + ': ' + playlist[i].file + '\n';
        }

    }
    let embed = new MessageEmbed()
                            .setFooter("Playlist by Strat-Dog")
                            .setColor("#33ccff")
                            .setTimestamp()
                            .setTitle('Sounds in the playlist')
                            .setDescription(description)
    return embed;

                            
};