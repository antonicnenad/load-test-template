# Load Testing with Playwright and Artillery

This project demonstrates how to perform load testing on web applications using Playwright, Artillery, and Docker. The setup allows you to simulate multiple users visiting various URLs and executing JavaScript on those pages.

## Prerequisites

- Node.js and npm
- Docker
- Playwright
- Artillery

## Setup Instructions

### 1. Clone the Repository

First, clone the repository to your local machine:

### 2. Install Dependencies

Install Playwright and Artillery:

```bash
npm install playwright artillery
```

### 3. Define Your URLs in `artillery-config.yml`

Edit the `artillery-config.yml` file to specify the URLs you want to test:

```yaml
config:
  target: "http://dummy-target" # Placeholder URL to satisfy Artillery's requirement
  phases:
    - duration: 60
      arrivalRate: 10
  processor: "./playwright-script.js"
  variables:
    urls:
      - "https://example.com"
      - "https://blazedemo.com/index.php"
      - "https://the-internet.herokuapp.com/"

scenarios:
  - beforeScenario: |
      async function(context, ee, next) {
        const urls = context.vars.urls;
        context.vars.url = urls[Math.floor(Math.random() * urls.length)];
        return next();
      }
    flow:
      - function: "runPlaywrightScript"
```

### 4. Playwright Script Setup

Ensure that your Playwright script `playwright-script.js` is correctly set up to handle dynamic URLs:

```javascript
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
```

### 5. Run the Load Test

```bash
artillery run artillery-config.yml
```

## Docker Setup

### 1. Build Docker Image

Use the following Dockerfile to build your Docker image:

```dockerfile
# Use the official Playwright image as the base image
FROM mcr.microsoft.com/playwright:focal

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for npm install
COPY package*.json ./

# Install project dependencies, including Artillery globally
RUN npm install && npm install -g artillery

# Copy the rest of the application code
COPY . .

# Run load test
CMD ["artillery", "run", "artillery-config.yml"]

```

Build the Docker image:

```bash
docker build -t load-test .
```

### 2. Run Docker Container

Run the Docker container to execute the load test:

```bash
docker run load-test
```

```vbnet

This `README.md` file now includes the setup and installation instructions for Playwright and Artillery, as well as all the necessary steps to run the load test, build and run the Docker container.
```
