# Use Ubuntu as the base image
FROM ubuntu:focal

# Install dependencies and Node.js from NodeSource
RUN apt-get update && apt-get install -y curl \
  && curl -fsSL https://deb.nodesource.com/setup_current.x | bash - \
  && apt-get install -y nodejs \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in package.json
# RUN npm install

# Expose port 3000
EXPOSE 3000

# Run the app when the container launches
# CMD ["npm", "start"]

# COMMANDS
# docker build -t app-name . -- create an image of the container
# docker run -P -v $(pwd):/app -it app-name
