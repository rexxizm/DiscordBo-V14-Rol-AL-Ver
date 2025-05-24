const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`[READY] ${client.user.tag} giriş yaptı!`);
        await client.user.setPresence({
            status: 'dnd',
            activities: [{
                name: 'discord.gg/rexdev',
                type: ActivityType.Custom
            }]
        });
        try {
            await client.application.commands.set(
                Array.from(client.commands.values()).map(cmd => cmd.data)
            );
            console.log('Slash komutları başarıyla yüklendi!');
        } catch (error) {
            console.error('Komutlar yüklenirken hata:', error);
        }
    }
};
