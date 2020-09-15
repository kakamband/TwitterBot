const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
require("dotenv").config();
const fetch = require("node-fetch");

const username = process.env.LOGINUSERNAME;
const password = process.env.PASSWORD;

// Connect this sucker to MongoDB
// (async () => {
//   await mongoose
//     .connect(`${process.env.DB_CONNECTION}`, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useFindAndModify: false,
//       useCreateIndex: true,
//     })
//     .then(() => {
//       console.log("Connected to database !!");
//     })
//     .catch((err) => {
//       console.log("Connection failed !!" + err.message);
//     });
// })();

//let data = undefined;

// Boot up this bad boi
(async () => {
  // Fetch Quotes
  const res = await fetch("https://type.fit/api/quotes");
  let data2 = await res.json();

  // Data manipulation
  let randomNumber = Math.floor(Math.random() * data2.length) + 1;
  let textOfDay = data2[randomNumber].text;
  let authorOfDay = data2[randomNumber].author;
  let quoteOfDay = `"${textOfDay}" - ${authorOfDay}`;

  // Let the beast loose!
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto("https://twitter.com/login");

  page.waitForSelector("input");
  // In puppeteer - querySelectorAll is $$
  const inputs = await page.$$("input");
  await inputs[5].type(username);
  await inputs[6].type(password);

  const loginButton = await page.$$('[role="button"]');
  loginButton[0].click();

  await page.waitForTimeout(4000).then(async () => {
    console.log("Waited 4 seconds!");
    page.waitForSelector('[role="textbox"]');
    const tweetInputField = await page.$$('[role="textbox"]');
    tweetInputField[0].click();

    await tweetInputField[0].type(quoteOfDay);

    const tweetButton = await page.$$('[data-testid="tweetButtonInline"]');
    tweetButton[0].click();
  });

  await page.waitForTimeout(4000);
  await browser.close();
})();

// Push to MongoDB
//    const options = {
//     method: "POST",
//     body: JSON.stringify(imageData),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };
//   fetch("http://localhost:9001/posts", options);
//   await browser.close();
