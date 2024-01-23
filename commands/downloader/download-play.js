/*
* dev: Sazumi Viki
* github: github.com/sazumivicky
* instagram: @moe.sazumiviki
* web: www.sazumi.moe
*/

const axios = require("axios");
const ytSearch = require("yt-search");
const { react, apis } = require("../../config.js");
const Message = require("../../file/func/Message.js");

module.exports = {
  name: "play",
  description: "Download and Play Music",
  options: {
    withoutPrefix: true,
  },
  menu: {
    label: "Downloader",
    example : "*/query*",
  },
  cmd: ["play", "playmusic"],
  run: async ({ m, sock }) => {
    const message = new Message({ m, sock });

    const musicTitle = m.arg;

    if (!musicTitle) {
      await message.react(react.failed);
      return sock.sendMessage(m.from, { text: "*Example:* .play <music title>" }, { quoted: m });
    }

    try {
      message.react(react.process);

      const searchResults = await ytSearch(musicTitle);
      const videoInfo = searchResults.videos[0];

      const skizoApi = apis.sazumiviki;
      const apiUrl = `https://skizo.tech/api/y2mate?url=${videoInfo.url}&apikey=${skizoApi.apikey}`;
      const response = await axios.get(apiUrl, { responseType: "json" });

      if (response.data && response.data.audio && response.data.audio['128kbps']) {
        const audioUrl = response.data.audio['128kbps'].url;

        const description = `
╭─ •  「 *YOUTUBE PLAY* 」
│  ◦  *Duration:* ${videoInfo.seconds}
│  ◦  *Upload Date:* ${videoInfo.ago}
│  ◦  *Views:* ${videoInfo.views}
╰──── •
`;

        await sock.sendMessage(
          m.from,
          { image: { url: videoInfo.image }, caption: description },
          { quoted: m }
        );

        await sock.sendMessage(
          m.from,
          { audio: { url: audioUrl }, mimetype: 'audio/mp4' },
          { quoted: m }
        );

        await message.react(react.success);
      } else {
        throw new Error("🍥 Upps Error");
      }
    } catch (error) {
      console.error(error);
      await message.react(react.failed);
      await sock.sendMessage(
        m.from,
        { text: "🍥 Upps Error" },
        { quoted: m }
      ).catch((err) => {
        console.error(err);
      });
    }
  },
};