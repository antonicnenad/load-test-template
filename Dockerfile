# Use the official Playwright image as the base image
FROM mcr.microsoft.com/playwright:focal

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for npm install
COPY package*.json ./

# Install project dependencies, including artillery
RUN npm install && npm install -g artillery

# Copy the rest of the application code
COPY . .

# Run load test
CMD ["artillery", "run", "artillery-config.yml"]
