# Use Node 21 as the base image
FROM node:21-alpine

# Set the working directory in the container
WORKDIR /πτυχιακή_εργασία/client

# Copy package.json and package-lock.json (if available)
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY client/ .

# Build your app
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]