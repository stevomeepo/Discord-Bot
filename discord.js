require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cookRegex = /c+o+o+k+/;
const bogaRegex = /b+o+g+a+/;
const goofyRegex = /g+o+o+f+y+/;
const dummyRegex = /d+u+m+b+/;
const tickleRegex = /t+i+c+k+l+e+/;
const downRegex = /d+o+w+n+/;

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
  } else if (message.content.toLowerCase().includes('good night') || message.content.toLowerCase().includes('gn')) {
    message.channel.send('Good night bogas!');
  } else if (cookRegex.test(contentLower)) {
    message.channel.send("IT'S TIME TO COOK! @everyone");
  } else if (goofyRegex.test(contentLower)) {
    message.channel.send('Imma goofy goober!');
  } else if (dummyRegex.test(contentLower)) {
    message.channel.send('thats me hehe XD');
  } else if (tickleRegex.test(contentLower)) {
    message.channel.send("It's tickle tuesday!");
  } else if (downRegex.test(contentLower)) {
    message.channel.send("I'm acutally DOWNS");
}});

client.login(process.env.DISCORD_TOKEN);