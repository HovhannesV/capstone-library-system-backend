FROM node:16
WORKDIR /lms
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
CMD [ "npm", "run", "start:prod" ]