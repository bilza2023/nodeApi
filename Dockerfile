FROM node:latest 
WORKDIR /app
COPY package.json .
COPY package-lock.json ./
RUN npm install 
COPY . ./
RUN npm run build 
EXPOSE 5000
CMD ["node", "./build/index.js"]