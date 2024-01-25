require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const queues = new Map();
const inactivityTimeouts = new Map();
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
const commandRegex = /z+z+t+r+o+/;
// Create a new client instance with the specified intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});
// Event listener when the bot becomes ready to start working
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

let player;

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  const contentLower = message.content.toLowerCase();
  const serverQueue = queues.get(message.guild.id);

  if (contentLower.startsWith('!play')) {
    const args = message.content.split(' ');
    if (args.length < 2) {
      message.channel.send('Please provide a YouTube URL.');
      return;
    }
    const youtubeURL = args[1];
    if (!ytdl.validateURL(youtubeURL)) {
      message.channel.send('Please provide a valid YouTube URL.');
      return;
    }

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
      queue.songs.push(youtubeURL);

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
        message.channel.send('Failed to join the voice channel.');
      }
    } else {
      serverQueue.songs.push(youtubeURL);

      const timeout = inactivityTimeouts.get(message.guild.id);
      if (timeout) {
        clearTimeout(timeout);
        inactivityTimeouts.delete(message.guild.id);
      }
      message.channel.send(`Added to queue: ${youtubeURL}`);
    }
  } else if (contentLower === '!stop') {
    if (serverQueue) {
      serverQueue.songs = [];
      if (serverQueue.connection) {
        serverQueue.connection.destroy();
      }
      queues.delete(message.guild.id);
      message.channel.send('Stopped the music and cleared the queue.');
    }
  } else if (contentLower === '!pause') {
    if (serverQueue && serverQueue.player) {
      serverQueue.player.pause();
      message.channel.send('Paused the music.');
    }
  } else if (contentLower === '!resume') {
    if (serverQueue && serverQueue.player) {
      serverQueue.player.unpause();
      message.channel.send('Resumed the music.');
    }
  }

  if (contentLower === '!skip') {
    if (serverQueue && serverQueue.songs.length > 0) {
      serverQueue.songs.shift(); // Skip the current song
      if (serverQueue.songs.length > 0) {
        play(message.guild, serverQueue.songs[0]); // Play the next song
        message.channel.send('Skipped the song and playing the next one.');
      } else {
        if (serverQueue.connection) {
          serverQueue.connection.destroy();
        }
        queues.delete(message.guild.id);
        message.channel.send('Skipped the song. The queue is now empty.');
      }
    } else {
      message.channel.send('There is no song to skip.');
    }
  }

  // The following conditions should be inside the messageCreate event listener
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
  } else if (commandRegex.test(contentLower)) {
    message.channel.send(`
    \`\`\`Hello. Boga AI here to play some music for you. Here are the functions for using Boga Music Player.

    Please use the "Boga-Music" voice channel to listen to music
    
    !play [insert youtube link] = plays song -> if done again adds the song to queue
    !stop = stop song & clears queue
    !pause = pause
    !skip = skips to next song in queue
    \`\`\`
    `);
  }
});

function play(guild, song) {
  const serverQueue = queues.get(guild.id);
  if (!serverQueue) {
    console.log('No server queue found.');
    return;
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

  const stream = ytdl(song, { filter: 'audioonly' });
  const resource = createAudioResource(stream);
  if (!serverQueue.player) {
    serverQueue.player = createAudioPlayer();
    serverQueue.connection.subscribe(serverQueue.player);
  } else {
    serverQueue.player.stop();
  }
  serverQueue.player.play(resource);

  serverQueue.player.on(AudioPlayerStatus.Idle, () => {
    serverQueue.songs.shift(); // Remove the finished song from the queue
    // Set a timeout to leave the channel after 5 minutes of inactivity
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

  serverQueue.textChannel.send(`Now playing: ${song}`);
}
client.login(process.env.DISCORD_TOKEN);
