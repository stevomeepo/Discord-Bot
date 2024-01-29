require('dotenv').config();
const { Client, GatewayIntentBits, MessageEmbed } = require('discord.js');
const cookRegex = /c+o+o+k+/i;
const timeRegex = /t+i+m+e+/i;
const bogaRegex = /b+o+g+a+/i;
const goofyRegex = /g+o+o+f+y+/i;
const dummyRegex = /d+u+m+b+/i;
const tickleRegex = /t+i+c+k+l+e+/i;
const downRegex = /d+o+w+n+/i;
const lolRegex = /l+o+l+/i;
const lmaoRegex = /l+m+a+o+/i;
const mattRegex = /m+a+t+t+/i;
const poopRegex = /p+o+o+p/i;
const dance1Regex = /d+o+ *t+h+e+ *d+a+n+c+e+/i;
const dance2Regex = /d+a+n+c+e+/i;
const stopRegex = /s+t+o+p+/i;
const winRegex = /d+u+b+/i;
const winRegex2 = /w+i+n/i;
const drakeRegex = /d+r+a+k+e/i;
const tiltRegex = /t+i+l+t/i;

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
    } else if (lolRegex.test(contentLower) || (lmaoRegex.test(contentLower))) {
      message.channel.send("stop making me laugh so hard teehee");
    } else if (mattRegex.test(contentLower)) {
      message.channel.send("Matt is my boss");
    } else if (poopRegex.test(contentLower)) {
      message.channel.send("ayooo let me join");
    } else if (dance1Regex.test(contentLower) || dance2Regex.test(contentLower)) {
        const embed = new MessageEmbed()
          .setTitle("AY AY AY AYYY!")
          .setImage("https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDY3ZHBhcjFtMnJpempucThwanAwa3d2bjR0ODUxbzhtcGlkZ2N6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/THlB4bsoSA0Cc/giphy.gif");
        message.channel.send({ embeds: [embed] });
    } else if (stopRegex.test(contentLower)) {
        message.channel.send("Don't stop WON'T STOP!");
    } else if (winRegex.test(contentLower) || winRegex2.test(contentLower) || drakeRegex.test(contentLower)) {
      const embed = new MessageEmbed()
        .setTitle("Anita Max Wynnnnn!")
        .setImage("https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmN6Z2N0ZjEwZHF5a2M1a25jOW41djM2b3puOGgzamo4ZjRjZ2VobiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jSFfhtpHTpCkFrfYPN/giphy.gif");
      message.channel.send({ embeds: [embed] });
    } else if (tiltRegex.test(contentLower)) {
        const embed = new MessageEmbed()
          .setTitle("Don't tilt!")
          .setImage("https://media1.tenor.com/m/Jc9jT66AJRwAAAAd/chipi-chipi-chapa-chapa.gif");
        message.channel.send({ embeds: [embed] });
    }
});

client.login(process.env.BETA_TOKEN);
