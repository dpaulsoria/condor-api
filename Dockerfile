FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY src/ ./src
COPY --chown=node:node .env .
COPY --chown=node:node .sequelizerc .
RUN npx sequelize-cli db:migrate
RUN npx sequelize-cli db:seed:all
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]
