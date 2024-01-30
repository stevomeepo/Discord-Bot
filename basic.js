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

async function debate(argument) {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4-0613",
      messages: [{
        role: "user",
        content: argument
      }],
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting response from OpenAI:', error);
    return 'Sorry, I encountered an error trying to respond to your argument.';
  }
}

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

  const debateChannelId = '1201747136182755398';

  client.on('messageCreate', async message => {
    try {
      if (message.author.bot || message.channel.id !== debateChannelId) return;
  
      // Respond to Bot 1's messages
      if (message.author.id === 'BOT_1_ID') { // Replace 'BOT_1_ID' with the actual ID of Bot 1
        const bot1Message = message.content;
        const response = await debate(bot1Message);
        message.channel.send(response);
      }
    } catch (error) {
      console.error('Error in messageCreate event:', error);
    }

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
        message.channel.send("AYYYY AY AY AY https://giphy.com/gifs/skeleton-dancing-tellmeohtellme-THlB4bsoSA0Cc");
    } else if (stopRegex.test(contentLower)) {
        message.channel.send("Don't stop WON'T STOP!");
    } else if (winRegex.test(contentLower) || winRegex2.test(contentLower) || drakeRegex.test(contentLower)) {
        message.channel.send("Anita Max Wynnnnn! https://giphy.com/gifs/Micropharms1-anitamaxxwynn-anita-max-wyn-drake-alter-ego-jSFfhtpHTpCkFrfYPN");
    } else if (tiltRegex.test(contentLower)) {
        message.channel.send("https://tenor.com/view/chipi-chipi-chapa-chapa-cat-gif-2724505493463639324");
    }
});

client.login(process.env.BETA_TOKEN);
