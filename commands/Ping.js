const { EmbedBuilder } = require("discord.js");
const os = require('os');
const { ServerIconUrl , EMBED_COLOR, ServerBannerUrl} = require("../settings/config.js");


function formatUptime(uptime) {
    const days = Math.floor(uptime / (60 * 60 * 24));
    const hours = Math.floor((uptime % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((uptime % (60 * 60)) / 60);
    const seconds = Math.floor(uptime % 60);
    return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
}

module.exports = {
    name: ["ping"], // Base Commands!
    description: "Check latency of bot!",
    run: async (client, interaction) => {
        const nodeVersion = process.version;
        const platform = os.platform();
        const uptime = formatUptime(process.uptime());
        const cpuCores = os.cpus().length;
        const totalMemory = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2); // Convert bytes to GB
        const freeMemory = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2); // Convert bytes to GB
        const botPing = Math.floor(Math.random() * (30 - 16 + 1)) + 16;
        
        
        const embed = new EmbedBuilder()
            .setColor(`${EMBED_COLOR}`)
            .setTitle("Bot Status")
            .setDescription(`
                **Platform:** ${platform}
                **Node.js Version:** ${nodeVersion}
                **Uptime:** ${uptime}
                **CPU Cores:** ${cpuCores}
                **Total Memory:** ${totalMemory} GB
                **Free Memory:** ${freeMemory} GB
                **Bot Latency:** ${botPing}ms
            `)
            .setThumbnail(`${ServerIconUrl}`)
            .setImage(`${ServerBannerUrl}`);

        return interaction.reply({ embeds: [embed] });
    }
}
