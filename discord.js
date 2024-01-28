require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
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
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// console.log(openai);
// Event listener when the bot becomes ready to start working
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
let player;

client.on('messageCreate', async message => {
  const chatChannelId = '1200653582584778772';

  if (message.channel.id === chatChannelId) {
    setTimeout(() => message.delete().catch(console.error), 1000);
  }

  if (message.channel.id === chatChannelId && message.content.toLowerCase().startsWith('!chat')) {
    const chatMessage = message.content.slice('!chat'.length).trim();
  
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4",
        messages: [{
          role: "user",
          content: chatMessage
        }],
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
  
      const sentMessage = await message.channel.send(response.data.choices[0].message.content);
      setTimeout(() => sentMessage.delete().catch(console.error), 10000);
      setTimeout(() => message.delete().catch(console.error), 10000);
    } catch (error) {
      console.error('Error getting response from OpenAI:', error);
      message.channel.send('Sorry, I encountered an error trying to respond to your message.');
    }
  }
  if (message.author.bot || message.channel.id !== '1199841447579500564') return;
  setTimeout(() => message.delete().catch(console.error), 1000);
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
      setTimeout(() => sentMessage.delete().catch(console.error), 10000);
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
      }, 300000); // 5 minutes in milliseconds
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