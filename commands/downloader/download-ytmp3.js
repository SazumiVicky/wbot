/*
* dev: Sazumi Viki
* github: github.com/sazumivicky
* instagram: @moe.sazumiviki
* web: www.sazumi.moe
*/

const axios = require("axios");
const { react, apis } = require("../../config.js");
const Message = require("../../file/func/Message.js");

module.exports = {
  name: "ytmp3",
  description: "Download YouTube Audio",
  options: {
    withoutPrefix: true,
  },
  menu: {
    label: "Downloader",
    example : "*/link*",
  },
  cmd: ["ytmp3"],
  run: async ({ m, sock }) => {
    const message = new Message({ m, sock });

    const youtubeUrl = m.arg;

    if (!youtubeUrl) {
      await message.react(react.failed);
      return sock.sendMessage(m.from, { text: "*Example:* .ytmp3 https://www.youtube.com/xxxxxx" }, { quoted: m });
    }

    try {
      message.react(react.process);

      const skizoApi = apis.sazumiviki;
      const apiUrl = `https://skizo.tech/api/y2mate?url=${encodeURIComponent(youtubeUrl)}&apikey=${skizoApi.apikey}`;
      const response = await axios.get(apiUrl, { responseType: "json" });

      if (response.data && response.data.audio && response.data.audio["128kbps"] && response.data.audio["128kbps"].url) {
        const audioUrl = response.data.audio["128kbps"].url;

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