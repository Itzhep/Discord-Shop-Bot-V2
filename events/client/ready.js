module.exports = async (client) => {
    console.log(`[INFO] ${client.user.tag} (${client.user.id}) is Ready!`);

    let guilds = client.guilds.cache.size;
    let members = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
    let channels = client.channels.cache.size;

    const activities = [
        'The Neighbourhood',
        `${members} members`
    ]

    setInterval(() => {
        client.user.setPresence({ 
            activities: [{ name: `${activities[Math.floor(Math.random() * activities.length)]}`, type: 3 }], 
            status: 'online', 
        });
    }, 15000)

};
