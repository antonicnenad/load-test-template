const { chromium } = require("playwright");

module.exports = async function (context, events, done) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const url = context.vars.url; // Use the dynamically selected URL
  console.log(`Navigating to ${url}`); // Log the URL for debugging
  await page.goto(url);

  // Wait for all JavaScript to load and execute
  await page.waitForTimeout(5000);

  const cookies = await page.context().cookies();
  const sessionStorage = await page.evaluate(() =>
    JSON.stringify(sessionStorage)
  );
  const localStorage = await page.evaluate(() => JSON.stringify(localStorage));

  console.log("Cookies:", cookies);
  console.log("Session Storage:", sessionStorage);
  console.log("Local Storage:", localStorage);

  await browser.close();
  done();
};
