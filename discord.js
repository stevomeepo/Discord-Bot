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

        const stream = ytdl(youtubeURL, { filter: 'audioonly' });
        const resource = createAudioResource(stream);

        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => connection.destroy());
        player.on('error', error => console.error(`Error: ${error.message}`));

        message.channel.send('Now playing your requested song!');
      } catch (error) {
        console.error(error);
        message.channel.send('Failed to join your voice channel!');
        connection.destroy();
      }
    } else {
      message.channel.send('You need to join a voice channel first!');
    }
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
