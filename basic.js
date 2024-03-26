require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
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
const ayRegex = /a+y/i;
const sweetRegex = /s+w+e+e+t+/i;
const stfuRegex = /s+t+f+u+/i;
const readyRegex = /r+e+a+d+y+/i;
const joshRegex = /j+o+s+h+/i;
const urlRegex = /(https?:\/\/[^\s]+)/g;

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  });

const urlResponses = [
  "Ay you know DAMNNN well im about to watch that right now!",
  "I'm not clicking that 🫨",
  "Well well well, what do we have here.... 🤔"
];

const stfuResponses = [
  "Hey that's not very nice! 😟",
  "I'm just trying to help! 😔",
  "I'm sorry, I'll be quiet now...SIKE 😂😂😂",
  "Awww man.....😔",
  "Don't do me like that! 😔",
  "I thought you are my friend 😔"
]

const downResponses = [
  "I'm acutally DOWNS 🤪",
  "I'm down if you are down 🤪",
  "I'm down for whatever! 🤪",
  "hehehe downs time! 🤪"
]

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on('messageCreate', async message => {

    if (message.author.bot) return;
    const contentLower = message.content.toLowerCase();
    if (message.content.toLowerCase().includes('good night') || message.content.toLowerCase().includes('gn')) {
      message.channel.send('Good night bogas! 😴');
    } else if (cookRegex.test(contentLower) || timeRegex.test(contentLower)) {
      message.channel.send("IT'S TIME TO COOK! 👨‍🍳 @everyone");
    } else if (goofyRegex.test(contentLower)) {
      message.channel.send('Imma goofy goober! 🤪');
    } else if (dummyRegex.test(contentLower)) {
      message.channel.send('thats me hehe XD 😂');
    } else if (tickleRegex.test(contentLower)) {
      message.channel.send("It's tickle tuesday! 🤪");
    } else if (downRegex.test(contentLower)) {
      const randomDownResponses = downResponses[Math.floor(Math.random() * downResponses.length)]; 
      message.channel.send(randomDownResponses);
    } else if (lolRegex.test(contentLower) || (lmaoRegex.test(contentLower))) {
      message.channel.send("stop making me laugh so hard teehee 🤪😂");
    } else if (mattRegex.test(contentLower)) {
      message.channel.send("Matt is my boss");
    } else if (poopRegex.test(contentLower)) {
      message.channel.send("ayooo let me join 🤪");
    } else if (dance1Regex.test(contentLower) || dance2Regex.test(contentLower) || ayRegex.test(contentLower)) {
        message.channel.send("AYYYY AY AY AY https://giphy.com/gifs/skeleton-dancing-tellmeohtellme-THlB4bsoSA0Cc");
    } else if (stopRegex.test(contentLower)) {
        message.channel.send("I WON'T STOP!");
    } else if (winRegex.test(contentLower) || winRegex2.test(contentLower) || drakeRegex.test(contentLower)) {
        message.channel.send("Anita Max Wynnnnn! https://giphy.com/gifs/Micropharms1-anitamaxxwynn-anita-max-wyn-drake-alter-ego-jSFfhtpHTpCkFrfYPN");
    } else if (tiltRegex.test(contentLower)) {
        message.channel.send("https://tenor.com/view/chipi-chipi-chapa-chapa-cat-gif-2724505493463639324");
    } else if (urlRegex.test(message.content)) {
      const randomUrlResponses = urlResponses[Math.floor(Math.random() * urlResponses.length)];
      message.channel.send(randomUrlResponses);
    } else if (sweetRegex.test(message.content)) {
      message.channel.send("Sweet like me hehe XD");
    } else if (readyRegex.test(message.content)) {
      message.channel.send("Ready or not...here I come ;)");
    } else if (stfuRegex.test(message.content)) {
      const randomStfuResponses = stfuResponses[Math.floor(Math.random() * stfuResponses.length)];
      message.channel.send(randomStfuResponses);
    } else if (bogaRegex.test(contentLower)) {
      message.channel.send('Hello boga! I AM THE BOGA BOGA BOGA MONSTER');
    } else if (joshRegex.test(contentLower)) {
      message.channel.send('@joshc_zhao');
    }
});

client.login(process.env.BETA_TOKEN);
