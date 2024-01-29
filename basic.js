require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cookRegex = /c+o+o+k+/;
const timeRegex = /t+i+m+e+/;
const bogaRegex = /b+o+g+a+/;
const goofyRegex = /g+o+o+f+y+/;
const dummyRegex = /d+u+m+b+/;
const tickleRegex = /t+i+c+k+l+e+/;
const downRegex = /d+o+w+n+/;
const lolRegex = /l+o+l+/;
const lmaoRegex = /l+m+a+o+/;
const mattRegex = /m+a+t+t+/;
const poopRegex = /p+o+o+p/;
const dance1Regex = /d+o+ *t+h+e+ *d+a+n+c+e+/i;
const dance2Regex = /d+a+n+c+e+/;

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  });

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
    } else if (cookRegex.test(contentLower) || timeRegex.test(contentLower)) {
      message.channel.send("IT'S TIME TO COOK! @everyone");
    } else if (goofyRegex.test(contentLower)) {
      message.channel.send('Imma goofy goober!');
    } else if (dummyRegex.test(contentLower)) {
      message.channel.send('thats me hehe XD');
    } else if (tickleRegex.test(contentLower)) {
      message.channel.send("It's tickle tuesday!");
    } else if (downRegex.test(contentLower)) {
      message.channel.send("I'm acutally DOWNS");
    } else if (lolRegex.test(contentLower)) {
      message.channel.send("stop making me laugh so hard teehee");
    } else if (lmaoRegex.test(contentLower)) {
      message.channel.send("stop making me laugh so hard teehee");
    } else if (mattRegex.test(contentLower)) {
      message.channel.send("Matt is my boss");
    } else if (poopRegex.test(contentLower)) {
      message.channel.send("ayooo let me join");
    } else if (dance1Regex.test(contentLower) || dance2Regex.test(contentLower)) {
        message.channel.send("https://giphy.com/gifs/skeleton-dancing-tellmeohtellme-THlB4bsoSA0Cc");
    }});
    
    client.login(process.env.BETA_TOKEN);
