const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits, ChannelType } = require("discord.js");
const fs = require('fs');
const path = require('path');

// Path to the database file
const databasePath = path.resolve(__dirname, 'products.json');

module.exports = {
    name: ["removeproduct"], // Command name
    description: "Remove a product!",
    options: [
        {
            name: 'name',
            type: ApplicationCommandOptionType.String,
            description: 'Name of the product to remove',
            required: true,
        }
    ],
    run: async (client, interaction) => {
        const productNameToRemove = interaction.options.getString('name');

        // Load the data from the database
        let products = [];
        try {
            const data = fs.readFileSync(databasePath, 'utf8');
            products = JSON.parse(data);
        } catch (error) {
            console.error('Error reading database file:', error);
        }

        // Function to remove a product by its name
        function removeProductByName(productName) {
            const index = products.findIndex(product => product.name === productName);
            if (index !== -1) {
                const removedProduct = products.splice(index, 1)[0];
                console.log('Removed product:', removedProduct);
                return removedProduct;
            } else {
                console.log('Product not found:', productName);
                return null;
            }
        }

        // Remove the product from the database
        const removedProduct = removeProductByName(productNameToRemove);

        // Save the updated products array back to the database file
        fs.writeFile(databasePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                console.error('Error writing to database file:', err);
            } else {
                console.log('Database file updated successfully');
            }
        });

        // Delete the channel associated with the removed product
        if (removedProduct) {
            const channelToRemove = interaction.guild.channels.cache.get(removedProduct.channelId);
            if (channelToRemove) {
                channelToRemove.delete()
                    .then(() => console.log('Channel deleted successfully'))
                    .catch(error => console.error('Error deleting channel:', error));
            } else {
                console.log('Channel not found');
            }
            interaction.reply({ content: `Product "${productNameToRemove}" removed successfully!`, ephemeral: true });
        } else {
            interaction.reply({ content: `Product "${productNameToRemove}" not found!`, ephemeral: true });
        }
    }
};
