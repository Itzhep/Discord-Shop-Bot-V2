const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits, ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
config = require('../settings/config.js');
SERVER_ID = config.SERVER_ID;
// Path to the database file
const databasePath = path.resolve(__dirname, 'products.json');

module.exports = {
    name: ["addproduct"], // Command name
    description: "Add a new product!",
    options: [
        {
            name: 'name',
            type: ApplicationCommandOptionType.String,
            description: 'Name of the product',
            required: true,
        },
        {
            name: 'price',
            type: ApplicationCommandOptionType.String,
            description: 'Price of the product',
            required: true,
        },
        {
            name: 'description',
            type: ApplicationCommandOptionType.String,
            description: 'Description of the product',
            required: true,
        },
        {
            name: 'image',
            type: ApplicationCommandOptionType.String,
            description: 'Image URL of the product',
            required: false,
        },
        {
            name: 'video',
            type: ApplicationCommandOptionType.String,
            description: 'Video URL of the product',
            required: false,
        },
    ],
    run: async (client, interaction) => {
        const productName = interaction.options.getString('name');
        const productPrice = interaction.options.getString('price');
        const productDescription = interaction.options.getString('description');
        const productImage = interaction.options.getString('image') || null;
        const productVideo = interaction.options.getString('video') || null;

        // Create the embed
        const embed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle(":white_check_mark: New Product Added")
            .setDescription(`
                **Name:** ${productName}
                **:dollar: Price:** ${productPrice}
                **Description:** ${productDescription}
            `);

        if (productImage) {
            embed.setImage(productImage);
        }
        if (productVideo) {
            embed.setThumbnail(productVideo);
        }      
        
        try {
            const guild = interaction.guild;
        if (!guild) {
            return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
        }

            const category = guild.channels.cache.find(channel => channel.type === ChannelType.GuildCategory && channel.name === 'محصولات');

            if (!category) {
                return interaction.reply({ content: `Category "محصولات" not found!`, ephemeral: true });
            }

            // Create a new text channel with the product name
            const channel = await guild.channels.create({
                name: productName,
                type: ChannelType.GuildText,
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        allow: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: client.user.id,
                        allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.SendMessages],
                    },
                ],
            });

            console.log(`Product channel created: ${channel.name}`);
            const ticketchannel = config.TicketChannelUrl;
            // Add buttons to the product channel message
            const openTicketButton = new ButtonBuilder()
                .setLabel('ticket')
                .setStyle(ButtonStyle.Link)
                .setURL(`${ticketchannel}`)

            const actionRow = new ActionRowBuilder()
                .addComponents(openTicketButton);

            await channel.send({ embeds: [embed], components: [actionRow] });

            // Read the existing products from the database
            let products = [];
            try {
                const data = fs.readFileSync(databasePath, 'utf8');
                products = JSON.parse(data);
            } catch (error) {
                console.error('Error reading database file:', error);
            }

            // Add the new product to the products array
            const newProduct = {
                name: productName,
                price: productPrice,
                description: productDescription,
                image: productImage,
                video: productVideo,
                channelId: channel.id
            };
            products.push(newProduct);

            // Save the updated products array back to the database file
            fs.writeFile(databasePath, JSON.stringify(products, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to database file:', err);
                } else {
                    console.log('Database file updated successfully');
                }
            });

            await interaction.reply({ content: `Product channel for **${productName}** created successfully!`, ephemeral: true });

            return channel;
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to create the product channel!', ephemeral: true });
        }
    }
};
