const { Client, GatewayIntentBits } = require("discord.js");
require('dotenv').config();
const{handleGenerateShortURL,handleGetRedirectURL}=require('./controllers/url.js')

const { connectMongoDB } = require("./connect.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});


//connect db
connectMongoDB("mongodb://127.0.0.1:27017/discord-bot").then(() =>
  console.log("MongoDB ConnectEd")
);


client.on("messageCreate", async(message) => {
  if (message.author.bot) return;

  //Create ShortID
  if (message.content.startsWith("create")) {
    const url = message.content.split("create")[1].trim();
    message.reply({
      content: "Generating shortid for " + url,
    });
    const shortURLid = await handleGenerateShortURL(url);
    message.reply({
      content: "Shortid created: " + shortURLid,
    });
  }

  //Redirect to Original URL
  if (message.content.startsWith("redirect")) {
    const shortID = message.content.split("redirect")[1].trim();
    const redirectURL = await handleGetRedirectURL(shortID);
    message.reply({
      content: "shortid redirects to =>" + redirectURL,
    });
  }
});

client.on("interactionCreate", (interaction) => {
  interaction.reply({
    content: "Pong!!",
  });
});

const token = process.env.DISCORD_TOKEN;
client.login(token);
