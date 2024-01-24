require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cookRegex = /c+o+o+k+/;
const bogaRegex = /b+o+g+a+/;
const goofyRegex = /g+o+o+f+y+/;

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

  const contentLower = message.content.toLowerCase();

  if (bogaRegex.test(contentLower)) {
    message.channel.send('Hello boga! I AM THE BOGA BOGA BOGA MONSTER');
  } else if (message.content.toLowerCase().includes('good night')) {
    message.channel.send('Good night bogas!');
  } else if (cookRegex.test(contentLower)) {
    message.channel.send("IT'S TIME TO COOK! @everyone");
  } else if (goofyRegex.test(contentLower)) {
    message.channel.send('Imma goofy goober!');
  }
});

client.login(process.env.DISCORD_TOKEN);