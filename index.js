const { Client, GatewayIntentBits } = require("discord.js");
require('dotenv').config();
const{handleGenerateShortURL,handleGetRedirectURL}=require('./controllers/url.js')

const express = require("express");
const { handleGetRedirectURL } = require("./controllers/url.js");

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

//express redirecter
const app = express();
const PORT = 3000;

// Redirect route
app.get("/:shortID", async (req, res) => {
  const shortID = req.params.shortID;
  try {
    const originalURL = await handleGetRedirectURL(shortID);
    if (originalURL) {
      res.redirect(originalURL);
    } else {
      res.status(404).send("Short URL not found.");
    }
  } catch (err) {
    res.status(500).send("An error occurred.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



client.on("messageCreate", async(message) => {
  if (message.author.bot) return;

  //Create ShortID
  if (message.content.startsWith("create")) {
    const url = message.content.split("create")[1].trim();
    message.reply({
      content: "Generating short url for " + url,
    });
    const shortURLid = await handleGenerateShortURL(url);
    message.reply({
      content: "Short URL created: " + shortURLid,
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


