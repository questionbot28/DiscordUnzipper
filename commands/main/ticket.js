const Discord = require('discord.js');

module.exports = {
    name: 'ticket',
    description: 'Creates a ticket panel with dropdown menu',
    async execute(message, args) {
        // Check if user has permission to create ticket panel
        if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
            return message.reply({ content: 'You do not have permission to use this command.' });
        }

        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('🎫 Create a Support Ticket')
            .setDescription('Please select a category from the dropdown menu below to create a ticket.')
            .setFooter({ text: 'WRECKED G3N Support' });

        // Create selection menu
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('ticket_menu')
                    .setPlaceholder('Select ticket category')
                    .addOptions([
                        {
                            label: 'Event',
                            description: 'Create a ticket for event-related inquiries',
                            value: 'Event',
                            emoji: '🎉'
                        },
                        {
                            label: 'Reward',
                            description: 'Questions about rewards and prizes',
                            value: 'Reward',
                            emoji: '🎁'
                        },
                        {
                            label: 'Code',
                            description: 'Issues with codes or redemption',
                            value: 'Code',
                            emoji: '🔑'
                        },
                        {
                            label: 'Support',
                            description: 'General support and assistance',
                            value: 'Support',
                            emoji: '❓'
                        }
                    ])
            );

        try {
            await message.channel.send({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error('Error sending ticket menu:', error);
            message.reply({ content: 'There was an error creating the ticket menu.' });
        }
    }
};