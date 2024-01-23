FROM node:18

RUN apt-get update && apt-get install -y \
    ffmpeg \
    neofetch \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 7860

CMD ["node", ".", "--pairing"]