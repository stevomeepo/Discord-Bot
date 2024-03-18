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
const urlRegex = /(https?:\/\/[^\s]+)/g;

// async function debate(argument) {
//   try {
//     const response = await axios.post('https://api.openai.com/v1/chat/completions', {
//       model: "gpt-4-0613",
//       messages: [{
//         role: "user",
//         content: argument
//       }],
//     }, {
//       headers: {
//         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     return response.data.choices[0].message.content;
//   } catch (error) {
//     console.error('Error getting response from OpenAI:', error);
//     return 'Sorry, I encountered an error trying to respond to your argument.';
//   }
// }

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

  client.on('messageCreate', async message => {
    // const debateChannelId = '1201747136182755398';

    // // Ignore messages from the bot itself and non-debate channel messages
    // if (message.author.id === client.user.id || message.channel.id !== debateChannelId) return;
  
    // // Ignore "Thinking..." messages to prevent responding to itself
    // if (message.content === "Thinking...") return;
  
    // // Check if the message is from the debate channel
    // if (message.author.id === '1195185960799977475') { // Replace '1195185960799977475' with the actual ID of Bot 1
    //   console.log(`Message from Bot 1 received: ${message.content}`);
  
    //   // Send a "Thinking..." message
    //   let thinkingMessage = await message.channel.send("Thinking...");
  
    //   try {
    //     const response = await debate(message.content);
    //     await thinkingMessage.delete(); // Delete the "Thinking..." message
    //     await message.channel.send(response);
    //   } catch (error) {
    //     console.error('Error getting response from OpenAI:', error);
    //     await thinkingMessage.delete(); // Ensure the "Thinking..." message is deleted even on error
    //     await message.channel.send('Sorry, I encountered an error trying to respond to your argument.');
    //   }
    // }

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
    } else if (dance1Regex.test(contentLower) || dance2Regex.test(contentLower) || ayRegex.test(contentLower)) {
        message.channel.send("AYYYY AY AY AY https://giphy.com/gifs/skeleton-dancing-tellmeohtellme-THlB4bsoSA0Cc");
    } else if (stopRegex.test(contentLower)) {
        message.channel.send("Don't stop WON'T STOP!");
    } else if (winRegex.test(contentLower) || winRegex2.test(contentLower) || drakeRegex.test(contentLower)) {
        message.channel.send("Anita Max Wynnnnn! https://giphy.com/gifs/Micropharms1-anitamaxxwynn-anita-max-wyn-drake-alter-ego-jSFfhtpHTpCkFrfYPN");
    } else if (tiltRegex.test(contentLower)) {
        message.channel.send("https://tenor.com/view/chipi-chipi-chapa-chapa-cat-gif-2724505493463639324");
    } else if (urlRegex.test(message.content)) {
      message.channel.send("Ay you know DAMNNN well im about to watch that right now!");
    } else if (sweetRegex.test(message.content)) {
      message.channel.send("Sweet like me hehe XD");
    }
});

client.login(process.env.BETA_TOKEN);
