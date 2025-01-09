# Use an official Node runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of your application's code
COPY . .
# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
# Expose the port your app runs on
EXPOSE 3000
# Command to run your application
CMD ["node", "index.js"]