require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const YouTube = require('youtube-sr').default;
const queue = new Map();
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

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const contentLower = message.content.toLowerCase();

  if (contentLower.startsWith('!play')) {
    const serverQueue = queue.get(message.guild.id) || {
      songs: [],
      connection: null,
      player: createAudioPlayer(),
      playing: false
    };

    const args = message.content.split(' ').slice(1);
    if (args.length === 0) {
      message.channel.send('Please provide a YouTube URL or some keywords to search for.');
      return;
    }

    const voiceChannelId = message.member.voice.channelId;
    if (!voiceChannelId) {
      message.channel.send('You need to join a voice channel first!');
      return;
    }
    const channel = message.guild.channels.cache.get(voiceChannelId);

    if (!serverQueue.connection) {
      serverQueue.connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
      });
    }

    try {
      await entersState(serverQueue.connection, VoiceConnectionStatus.Ready, 30e3);

      let stream;
      let song;
      if (ytdl.validateURL(args[0])) {
        const videoInfo = await ytdl.getInfo(args[0]);
        stream = ytdl(args[0], { filter: 'audioonly' });
        song = {
          title: videoInfo.videoDetails.title,
          url: args[0]
        }
      } else {
        const searchResults = await YouTube.search(args.join(' '), { limit: 1 });
        if (searchResults.length === 0) {
          message.channel.send('No results found for your query.');
          return;
        }
        const videoUrl = searchResults[0].url;
        stream = ytdl(videoUrl, { filter: 'audioonly' });
        song = {
          title: searchResults[0].title,
          url: videoUrl
        }
      }

      serverQueue.songs.push(song);

      if (!serverQueue.playing) {
        serverQueue.playing = true;
        playSong(message.guild, serverQueue.songs[0]);
      } else {
        message.channel.send(`${song.title} has been added to the queue.`);
      }

      queue.set(message.guild.id, serverQueue);
    } catch (error) {
      console.error(error);
      message.channel.send('Failed to join your voice channel!');
      if (serverQueue.connection) {
        serverQueue.connection.destroy();
      }
      queue.delete(message.guild.id);
    }
  }

  if (contentLower === '!pause') {
    const serverQueue = queue.get(message.guild.id);
    if (serverQueue && serverQueue.player && serverQueue.playing) {
      serverQueue.player.pause();
      message.channel.send('Paused the music.');
    } else {
      message.channel.send('No music is currently playing.');
    }
  }

  if (contentLower === '!resume') {
    const serverQueue = queue.get(message.guild.id);
    if (serverQueue && serverQueue.player && !serverQueue.playing) {
      serverQueue.player.unpause();
      serverQueue.playing = true;
      message.channel.send('Resumed the music.');
    } else {
      message.channel.send('No music is currently paused.');
    }
  }

  if (contentLower === '!stop') {
    const serverQueue = queue.get(message.guild.id);
    if (serverQueue) {
      serverQueue.songs = []; // Clear queue
      serverQueue.player.stop();
      serverQueue.playing = false;
      message.channel.send('Stopped the music and cleared the queue.');
    } else {
      message.channel.send('No music is currently playing.');
    }
  }

function playSong(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.connection.destroy();
    serverQueue.playing = false;
    queue.delete(guild.id);
    return;
  }
  const stream = ytdl(song.url, { filter: 'audioonly' });
  const resource = createAudioResource(stream);
  serverQueue.player.play(resource);
  serverQueue.connection.subscribe(serverQueue.player);

  serverQueue.player.on(AudioPlayerStatus.Idle, () => {
    serverQueue.songs.shift();
    playSong(guild, serverQueue.songs[0]);
  });

  serverQueue.player.on('error', error => console.error(`Error: ${error.message}`));
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
