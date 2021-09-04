FROM node:16

WORKDIR /app 

RUN apt-get update && apt-get -y dist-upgrade
RUN apt install -y netcat

RUN yarn global add sequelize-cli

COPY ./package.json ./package.json

RUN yarn install 

COPY . .

RUN chmod +x entrypoint.sh

CMD ["bash", "entrypoint.sh"]