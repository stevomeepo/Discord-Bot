require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// Create a new client instance with the specified intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent // Required to read message content
  ]
});

// Event listener when the bot becomes ready to start working
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().includes('boga')) {
    message.channel.send('Hello boga! I AM THE BOGA BOGA BOGA MONSTER');
  } else if (message.content.toLowerCase().includes('good night')) {
    message.channel.send('Good night bogas!');
  } else if (message.content.toLowerCase().includes('cook')) {
    message.channel.send("IT'S TIME TO COOK! @everyone");
});

client.login(process.env.DISCORD_TOKEN);