require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
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

const queue = new Map();

// Define the play function before it's used
function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  const stream = ytdl(song, { filter: 'audioonly' });
  const resource = createAudioResource(stream);
  player.play(resource);

  serverQueue.textChannel.send(`Now playing: ${song}`);
}

// Define the skip function before it's used
function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send('You have to be in a voice channel to skip the music!');
  if (!serverQueue)
    return message.channel.send('There is no song that I could skip!');
  serverQueue.songs.shift();
  play(message.guild, serverQueue.songs[0]);
}

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const contentLower = message.content.toLowerCase();

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
    console.log("User's voice channel ID:", message.member.voice.channelId);

    const serverQueue = queue.get(message.guild.id);

    if (serverQueue) {
      serverQueue.songs.push(youtubeURL);
      return message.channel.send('Song added to the queue!');
    } else {
      const channel = message.guild.channels.cache.get(message.member.voice.channelId);
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: channel,
        connection: null,
        songs: [],
        playing: true
      };
      queue.set(message.guild.id, queueContruct);
      queueContruct.songs.push(youtubeURL);
    }

    if (message.member.voice.channelId) {
      const channel = message.guild.channels.cache.get(message.member.voice.channelId);
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30e3);

        player = createAudioPlayer();
        connection.subscribe(player); // Subscribe the player to the connection here

        player.on(AudioPlayerStatus.Idle, () => {
          serverQueue.songs.shift();
          play(message.guild, serverQueue.songs[0]);
        });
        player.on('error', error => console.error(`Error: ${error.message}`));

        message.channel.send('Now playing your requested song!');

        queueContruct.connection = connection;
        play(message.guild, queueContruct.songs[0]);
      } catch (error) {
        console.error(error);
        message.channel.send('Failed to join your voice channel!');
        connection.destroy();
        queue.delete(message.guild.id);
      }
    } else {
      message.channel.send('You need to join a voice channel first!');
    }
  }

  if (contentLower === '!skip') {
    skip(message, serverQueue);
    return;
  }

  if (contentLower === '!pause') {
    if (player) {
      player.pause();
      message.channel.send('Paused the music.');
    } else {
      message.channel.send('No music is currently playing.');
    }
  }

  if (contentLower === '!resume') {
    if (player) {
      player.unpause();
      message.channel.send('Resumed the music.');
    } else {
      message.channel.send('No music is currently paused.');
    }
  }

  if (contentLower === '!stop') {
    if (player) {
      player.stop();
      message.channel.send('Stopped the music.');
    } else {
      message.channel.send('No music is currently playing.');
    }
  }

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

client.login(process.env.DISCORD_TOKEN);
