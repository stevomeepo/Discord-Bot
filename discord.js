require('dotenv').config();
const { Client, GatewayIntentBits, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const axios = require('axios');
const { OpenAI } = require('openai');
const queues = new Map();
const inactivityTimeouts = new Map();
// Create a new client instance with the specified intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const clashResponses = {
  yes: new Set(),
  no: new Set()
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// console.log(openai);
// Event listener when the bot becomes ready to start working
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  const userId = interaction.user.id;
  const userName = interaction.user.username;

  // Check which button was pressed and update the structure
  if (interaction.customId === 'yes') {
    clashResponses.yes.add(userName); // Add the user to the 'yes' set
    clashResponses.no.delete(userName); // Ensure the user is not in the 'no' set
  } else if (interaction.customId === 'no') {
    clashResponses.no.add(userName); // Add the user to the 'no' set
    clashResponses.yes.delete(userName); // Ensure the user is not in the 'yes' set
  }

  await interaction.reply({ content: `Thanks for responding, ${userName}!`, ephemeral: true });
});

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

let player;

client.on('messageCreate', async message => {
  if (message.content.toLowerCase() === '!clash' && message.channel.id === '1219416503208906794') {
    // Create the buttons for "Yes" and "No" responses
    const yesButton = new ButtonBuilder()
      .setCustomId('yes')
      .setLabel('Yes')
      .setStyle(ButtonStyle.Success);

    const noButton = new ButtonBuilder()
      .setCustomId('no')
      .setLabel('No')
      .setStyle(ButtonStyle.Danger);

    // Create an action row to hold the buttons
    const row = new ActionRowBuilder().addComponents(yesButton, noButton);

    // Send the message with the buttons
    await message.channel.send({
      content: "Who is free to clash this weekend?",
      components: [row]
    });
  }

  // const debateChannelId = '1201747136182755398';
  // const bot2Id = '1201636915443679382';
  // // Ignore messages from the bot itself and non-debate channel messages
  // if (message.author.id === client.user.id || message.channel.id !== debateChannelId) return;

  // // Ignore "Thinking..." messages to prevent responding to itself
  // if (message.content === "Thinking...") return;

  // // Check if the message is from Bot 2
  // if (message.author.id === bot2Id) {
  //   console.log(`Message from Bot 2 received: ${message.content}`); // Log the message from Bot 2
  // }

  // // Respond to the !debate command from users or any message from Bot 2
  // if (message.content.toLowerCase().startsWith('!debate ') || message.author.id === bot2Id) {
  //   const argument = message.content.toLowerCase().startsWith('!debate ')
  //     ? message.content.slice('!debate '.length).trim()
  //     : message.content; // Use the message content directly if it's from Bot 2

  //   console.log(`Received message for debate: ${argument}`); // Log the message for debugging

  //   // Send a "Thinking..." message
  //   let thinkingMessage = await message.channel.send("Thinking...");

  //   try {
  //     const response = await debate(argument);
  //     await thinkingMessage.delete(); // Delete the "Thinking..." message
  //     await message.channel.send(response);
  //   } catch (error) {
  //     console.error('Error getting response from OpenAI:', error);
  //     await thinkingMessage.delete(); // Ensure the "Thinking..." message is deleted even on error
  //     await message.channel.send('Sorry, I encountered an error trying to respond to your argument.');
  //   }
  // }
  
  const chatChannelId = '1200653582584778772';

  if (message.channel.id === chatChannelId && !message.content.toLowerCase().startsWith('!chat') && message.author.id !== client.user.id) {
    setTimeout(() => message.delete().catch(console.error), 1000);
  }

  if (message.channel.id === chatChannelId && message.content.toLowerCase().startsWith('!chat')) {
    const chatMessage = message.content.slice('!chat'.length).trim();
    let typingMessage;

    // Send a "Typing..." message if the response takes more than 5 seconds
    const typingTimeout = setTimeout(() => {
        message.channel.send("Typing...").then(sentMsg => {
            typingMessage = sentMsg; // Assign the message once it's sent

            // Now, move the OpenAI call inside this then block
            axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-4-0613",
                messages: [{
                    role: "user",
                    content: chatMessage
                }],
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                // Clear the typing timeout as we're already inside the delayed block
                clearTimeout(typingTimeout);
                // Delete the "Typing..." message
                typingMessage.delete().catch(console.error);
                // Send the actual response from OpenAI
                message.channel.send(response.data.choices[0].message.content);
            }).catch(error => {
                console.error('Error getting response from OpenAI:', error);
                message.channel.send('Sorry, I encountered an error trying to respond to your message.');
            });
        });
    }, 5000); // Adjusted to 5000 to ensure "Typing..." message has a chance to be sent
  }
  
  const musicCommandsChannelId = '1199841447579500564';
  if (message.channel.id === musicCommandsChannelId) {
    if (message.content.startsWith('Current queue:')) {
      // If it's a queue message, delete it after 10 seconds
      setTimeout(() => message.delete().catch(console.error), 10000);
    } else {
      // If it's not a queue message, delete it after 1 second
      setTimeout(() => message.delete().catch(console.error), 1000);
    }
  }

  if (message.content.startsWith('!') && message.author.id !== client.user.id) {

    const contentLower = message.content.toLowerCase();
    const serverQueue = queues.get(message.guild.id);
    if (contentLower.startsWith('!play')) {
      const args = message.content.split(' ');
      if (args.length < 2) {
        (await message.channel.send('Please provide a YouTube URL or some keywords to search for.')).then(sentMessage => {
          setTimeout(() => sentMessage.delete().catch(console.error), 3000);
        });
        return;
      }
      const searchString = args.slice(1).join(' ');
      let youtubeURL;
      // Check if the argument is a valid YouTube URL
      if (ytdl.validateURL(searchString)) {
        youtubeURL = searchString;
      } else {
        // Use the YouTube Data API to search for a video
        const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchString)}&type=video&key=${process.env.YOUTUBE_API_KEY}`;
        try {
          const response = await axios.get(youtubeSearchUrl);
          const videos = response.data.items;
          if (!videos || videos.length === 0) {
            message.channel.send('No videos found with those keywords.').then(sentMessage => {
              setTimeout(() => sentMessage.delete().catch(console.error), 3000);
            });
            return;
          }
          const firstVideoId = videos[0].id.videoId;
          youtubeURL = `https://www.youtube.com/watch?v=${firstVideoId}`;
        } catch (err) {
          console.error(err);
          message.channel.send('Failed to search for video.').then(sentMessage => {
            setTimeout(() => sentMessage.delete().catch(console.error), 3000);
          });
          return;
        }
      }
      const videoInfo = await ytdl.getInfo(youtubeURL);
      const videoTitle = videoInfo.videoDetails.title;
      const song = { url: youtubeURL, title: videoTitle };
      if (!serverQueue) {
        // Create a queue since one doesn't exist
        const queue = {
          textChannel: message.channel,
          voiceChannel: message.member.voice.channel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true,
        };
        queues.set(message.guild.id, queue);
        queue.songs.push(song);
        try {
          const connection = joinVoiceChannel({
            channelId: message.member.voice.channelId,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
          });
          queue.connection = connection;
          play(message.guild, queue.songs[0]);
        } catch (err) {
          console.error(err);
          queues.delete(message.guild.id);
          message.channel.send('Failed to join the voice channel.').then(sentMessage => {
            setTimeout(() => sentMessage.delete().catch(console.error), 3000);
          });
        }
      } else {
        serverQueue.songs.push(song);
        const timeout = inactivityTimeouts.get(message.guild.id);
        if (timeout) {
          clearTimeout(timeout);
          inactivityTimeouts.delete(message.guild.id);
        }
        message.channel.send(`Added to queue: ${youtubeURL}`).then(sentMessage => {
          setTimeout(() => sentMessage.delete().catch(console.error), 3000);
        });
      }
    } else if (contentLower === '!stop') {
      if (serverQueue) {
        serverQueue.songs = [];
        if (serverQueue.connection) {
          serverQueue.connection.destroy();
        }
        queues.delete(message.guild.id);
        message.channel.send('Stopped the music and cleared the queue.').then(sentMessage => {
          setTimeout(() => sentMessage.delete().catch(console.error), 3000);
        });
      }
    } else if (contentLower === '!pause') {
      if (serverQueue && serverQueue.player) {
        serverQueue.player.pause();
        message.channel.send('Paused the music.').then(sentMessage => {
          setTimeout(() => sentMessage.delete().catch(console.error), 3000);
        });
      }
    } else if (contentLower === '!resume') {
      if (serverQueue && serverQueue.player) {
        serverQueue.player.unpause();
        message.channel.send('Resumed the music.').then(sentMessage => {
          setTimeout(() => sentMessage.delete().catch(console.error), 3000);
        });
      }
    } else if (contentLower === '!queue') {
      if (!serverQueue || serverQueue.songs.length === 0) {
        message.channel.send('There are no songs in the queue.').then(sentMessage => {
          setTimeout(() => sentMessage.delete().catch(console.error), 3000);
        });
        return;
      }
      let queueMessage = 'Current queue:\n';
      serverQueue.songs.forEach((song, index) => {
        queueMessage += `${index + 1}. ${song.title}\n`;
      });
      message.channel.send(queueMessage).then(sentMessage => {
        setTimeout(() => {
          sentMessage.delete().catch(error => {
            console.error('Failed to delete the queue message:', error);
          });
        }, 10000);
      });
    } else if (contentLower === '!repeat' || contentLower === '!replay') {
      if (!serverQueue) {
        (await message.channel.send('There is no song currently playing.')).then(sentMessage => {
          setTimeout(() => sentMessage.delete().catch(console.error), 3000);
        });
        return;
      }
      if (serverQueue.songs.length === 0) {
        message.channel.send('There is no song to repeat.').then(sentMessage => {
          setTimeout(() => sentMessage.delete().catch(console.error), 3000);
        });
        return;
      }
      // Call the play function with the current song and set isRepeating to true
      play(message.guild, serverQueue.songs[0], true);
      message.channel.send(`Repeating: ${serverQueue.songs[0].title}`).then(sentMessage => {
        setTimeout(() => sentMessage.delete().catch(console.error), 3000);
      });
    }

    if (contentLower === '!skip') {
      if (serverQueue && serverQueue.songs.length > 0) {
        serverQueue.songs.shift(); // Skip the current song
        if (serverQueue.songs.length > 0) {
          play(message.guild, serverQueue.songs[0]); // Play the next song
          message.channel.send('Skipped the song and playing the next one.').then(sentMessage => {
            setTimeout(() => sentMessage.delete().catch(console.error), 3000);
          });
        } else {
          if (serverQueue.connection) {
            serverQueue.connection.destroy();
          }
          queues.delete(message.guild.id);
          message.channel.send('Skipped the song. The queue is now empty.').then(sentMessage => {
            setTimeout(() => sentMessage.delete().catch(console.error), 3000);
          });
        }
      } else {
        message.channel.send('There is no song to skip.').then(sentMessage => {
          setTimeout(() => sentMessage.delete().catch(console.error), 3000);
        });
      }
    }
  // The following conditions should be inside the messageCreate event listener
  }
});

function play(guild, song, isRepeating = false) {
  const serverQueue = queues.get(guild.id);
  if (!serverQueue) {
    console.log('No server queue found.');
    return;
  }

  if (isRepeating) {
    if (serverQueue.player) {
      serverQueue.player.stop();
      const stream = ytdl(song.url, { filter: 'audioonly' });
      const resource = createAudioResource(stream);
      serverQueue.player.play(resource);
      serverQueue.player.once(AudioPlayerStatus.Idle, () => {
        play(guild, serverQueue.songs[0]);
      });
      return;
    }
  }

  // Clear the existing inactivity timeout if there is one
  const timeout = inactivityTimeouts.get(guild.id);
  if (timeout) {
    clearTimeout(timeout);
    inactivityTimeouts.delete(guild.id);
  }
  if (!song) {
    if (serverQueue.connection) {
      // Set a timeout to leave the channel after 5 minutes of inactivity
      const inactivityTimeout = setTimeout(() => {
        serverQueue.connection.destroy();
        queues.delete(guild.id);
        inactivityTimeouts.delete(guild.id);
        console.log(`Left the voice channel in ${guild.name} due to inactivity.`);
      }, 10800000);
      inactivityTimeouts.set(guild.id, inactivityTimeout);
    }
    return;
  }
  const stream = ytdl(song.url, { filter: 'audioonly' });
  const resource = createAudioResource(stream);
  if (!serverQueue.player) {
    serverQueue.player = createAudioPlayer();
    serverQueue.connection.subscribe(serverQueue.player);
  } else {
    serverQueue.player.stop();
  }
  serverQueue.player.play(resource);
  serverQueue.player.on(AudioPlayerStatus.Idle, () => {
    serverQueue.songs.shift();
    
    const inactivityTimeout = setTimeout(() => {
      if (serverQueue.connection) {
        serverQueue.connection.destroy();
        queues.delete(guild.id);
        console.log(`Left the voice channel in ${guild.name} due to inactivity.`);
      }
    }, 300000); // 5 minutes in milliseconds
    inactivityTimeouts.set(guild.id, inactivityTimeout);
    play(guild, serverQueue.songs[0]); // Play the next song
  });
  serverQueue.player.on('error', error => {
    console.error(`Error: ${error.message}`);
    serverQueue.songs.shift();
    play(guild, serverQueue.songs[0]);
  });
  serverQueue.textChannel.send(`Now playing: ${song.title}`).then(sentMessage => {
    setTimeout(() => sentMessage.delete().catch(console.error), 3000);
  });
}
client.login(process.env.DISCORD_TOKEN);
