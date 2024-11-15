const { REST, Routes }=require('discord.js');
require('dotenv').config();
const token = process.env.DISCORD_TOKEN;
const client_id = process.env.CLIENT_ID;
const commands = [
  {
    name: 'create',
    description: 'creates short url',
  },
];

const rest = new REST({ version: '10' }).setToken(token);
(async () => {
try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(client_id), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}
})()