const URL=require('../model/url')
const shortid = require("shortid");

async function handleGenerateShortURL(redirectUrl) {
    const shortID = shortid.generate();
  
    const url = await URL.create({
      shortId: shortID,
      redirectURL: redirectUrl,
    });
    console.log("shorturl created");
    return `http://localhost:3000/${shortID}`;
  }

async function handleGetRedirectURL(shortID) {
    const entry = await URL.findOne({
      shortId: shortID,
    });
    return entry ? entry.redirectURL : "URL not found"; // Handle cases where no entry is found
}
module.exports={handleGenerateShortURL,handleGetRedirectURL}