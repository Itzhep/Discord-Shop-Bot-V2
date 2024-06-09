const { EmbedBuilder } = require('discord.js');
const moment = require('moment'); // For date formatting
const { EMBED_COLOR } = require("../settings/config.js");

module.exports = {
    name: ["stats"], // Command name
    description: "Show the server status",
    run: async (client, interaction) => {
        const guild = interaction.guild;

        if (!guild) {
            return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
        }

        // Fetch all members to ensure we have the most current data
        await guild.members.fetch();

        const owner = await guild.fetchOwner();
        const roleCount = guild.roles.cache.size;
        const memberCount = guild.memberCount;
        const onlineCount = guild.members.cache.filter(member => member.presence && member.presence.status !== 'offline').size;
        const botCount = guild.members.cache.filter(member => member.user.bot).size;
        const channelCount = guild.channels.cache.size;
        const categoryCount = guild.channels.cache.filter(channel => channel.type === 'GUILD_CATEGORY').size;
        const textChannelCount = guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size;
        const voiceChannelCount = guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size;
        const serverIcon = guild.iconURL({ dynamic: true, size: 1024 });
        const serverBanner = guild.bannerURL({ size: 1024 });
        const serverId = guild.id;
        const serverCreationDate = moment(guild.createdAt).format('ddd MMM DD YYYY');
        const boosts = guild.premiumSubscriptionCount;
        const verificationLevel = guild.verificationLevel;

        const embed = new EmbedBuilder()
            .setColor(`${EMBED_COLOR}`)
            .setTitle(`${guild.name}`)
            .setThumbnail(serverIcon)
            .addFields(
                { name: 'Server ID', value: `🆔 ${serverId}`, inline: true },
                { name: 'Created On', value: `📅 ${serverCreationDate}`, inline: true },
                { name: 'Owned by', value: `👑 <@${owner.id}>`, inline: true },
                { name: 'Members', value: `👥 ${memberCount}\n🤖 ${botCount} Bots\n⭐ ${boosts} Boosts`, inline: true },
                { name: 'Channels', value: `📁 ${channelCount}`, inline: true },
                { name: 'Others', value: `🌐 Verification Level: ${verificationLevel}`, inline: true },
                { name: 'Roles', value: `🔒 ${roleCount} roles\nto see more data use /role`, inline: false },
            )
            .setImage(serverBanner);

        return interaction.reply({ embeds: [embed] });
    }
};
