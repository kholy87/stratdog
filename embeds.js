let { MessageEmbed } = require("discord.js");
module.exports = function genEmbed(usertag, days, hours, minutes, Title){
    let embed = new MessageEmbed()
                            .setFooter("Countdown by Strat-Dog")
                            .setColor("#33ccff")
                            .setTimestamp()
                            .setTitle(Title)
                            .setDescription(`Time left - **${days} days**, **${hours} hours** and **${minutes} minutes** `)
                            .setAuthor(`Timer started by ${usertag}`);
    return embed;

                            
};